//! Weather app — resident sidecar with embedded axum + UDS.
//!
//! Routes (proxied by host at `/api/apps/weather/<rest>`):
//! - `GET /assets/{*path}` → embedded UI assets
//! - `GET /weather?lat=<f64>&lon=<f64>` → weather data
//! - `GET /geocode?q=<string>` → location search

pub(crate) const MANIFEST: &str = include_str!("../tokimo-app.toml");

mod app_server;
mod assets;
mod handlers;

use clap::{Parser, Subcommand};
use tokimo_bus_client::{BusClient, ClientConfig};
use tokimo_bus_cli::TokimoAuthArgs;
use tracing::{error, info};

#[derive(Parser, Debug)]
#[command(
    name = "tokimo-app-weather",
    about = "Weather — Tokimo 子 app CLI",
    term_width = 100
)]
struct Cli {
    #[command(flatten)]
    auth: TokimoAuthArgs,
    #[command(subcommand)]
    command: Option<Command>,
}

#[derive(Subcommand, Debug)]
enum Command {
    /// 打印 app 版本信息
    Version,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let Cli { auth: _, command } = Cli::parse();

    match command {
        None if std::env::var_os("TOKIMO_BUS_SOCKET").is_some() => {
            tracing_subscriber::fmt()
                .with_env_filter(
                    tracing_subscriber::EnvFilter::try_from_default_env()
                        .unwrap_or_else(|_| "info,tokimo_app_weather=debug".into()),
                )
                .init();
            if let Err(e) = run_server().await {
                error!(%e, "weather: fatal");
                std::process::exit(1);
            }
        }
        None => {
            use clap::CommandFactory;
            let mut cmd = Cli::command();
            tokimo_bus_cli::print_help_unified(&mut cmd);
            std::process::exit(0);
        }
        Some(Command::Version) => {
            println!("tokimo-app-weather {}", env!("CARGO_PKG_VERSION"));
        }
    }

    Ok(())
}

async fn run_server() -> anyhow::Result<()> {
    let cfg = ClientConfig::from_env().map_err(|e| anyhow::anyhow!("ClientConfig: {e}"))?;
    info!(endpoint = ?cfg.endpoint, "weather: connecting to broker");

    let app_socket = app_server::spawn("weather")
        .await
        .map_err(|e| anyhow::anyhow!("app_server spawn: {e}"))?;

    let client = BusClient::builder(cfg)
        .service("weather", env!("CARGO_PKG_VERSION"))
        .data_plane(app_socket)
        .build()
        .await
        .map_err(|e| anyhow::anyhow!("bus build: {e}"))?;

    info!("weather: registered with broker");

    let shutdown = {
        let client = std::sync::Arc::clone(&client);
        tokio::spawn(async move { client.run_until_shutdown().await })
    };

    tokio::select! {
        _ = tokio::signal::ctrl_c() => {
            info!("weather: SIGINT received");
            client.shutdown();
        }
        _ = shutdown => info!("weather: broker sent Shutdown"),
    }

    Ok(())
}
