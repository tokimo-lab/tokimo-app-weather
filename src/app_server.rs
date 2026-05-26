//! 内嵌 axum HTTP server，监听本地 socket。
//!
//! 路由布局（server 端 `/api/apps/weather/<rest>` 反代到本 sock 的 `/<rest>`）：
//! - `GET /assets/{*path}` → 静态资源
//! - `GET /weather?lat=<f64>&lon=<f64>` → weather data
//! - `GET /geocode?q=<string>` → location search

use axum::{Router, routing::get};
use std::sync::Arc;
use std::time::Duration;
use tokimo_bus_protocol::{BusListener, DataPlaneSocket};
use tracing::{error, info};

use crate::{assets, handlers};

pub async fn spawn(service: &str) -> anyhow::Result<DataPlaneSocket> {
    let (listener, socket) = BusListener::bind_for_app(service)?;
    info!(?socket, "weather: app server listening");

    let router = build_router();

    tokio::spawn(async move {
        if let Err(e) = axum::serve(listener, router).await {
            error!(error = %e, "weather: app server stopped");
        }
    });

    Ok(socket)
}

fn build_router() -> Router {
    let http_client = reqwest::Client::builder()
        .timeout(Duration::from_secs(30))
        .user_agent("tokimo-weather/1.0")
        .build()
        .expect("reqwest client builder failed");

    let state = Arc::new(handlers::AppState { http_client });

    Router::new()
        .route("/assets/{*path}", get(assets::serve))
        .route("/weather", get(handlers::get_weather))
        .route("/geocode", get(handlers::geocode))
        .with_state(state)
}
