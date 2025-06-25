// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use sysinfo::System;
use tauri_plugin_global_shortcut::Builder as GlobalShortcutBuilder;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn has_multiple_monitors(window: tauri::Window) -> bool {
    match window.available_monitors() {
        Ok(monitors) => monitors.len() > 1,
        Err(e) => {
            eprintln!("모니터 정보를 가져오는 데 실패했습니다: {:?}", e);
            // 에러 발생 시 안전하게 단일 모니터로 간주
            false
        }
    }
}

#[tauri::command]
fn is_process_running(process_name: String) -> bool {
    let mut sys = System::new_all();
    sys.refresh_all();

    for (_pid, process) in sys.processes() {
        if process
            .name()
            .to_string_lossy()
            .to_lowercase()
            .contains(&process_name.to_lowercase())
        {
            return true;
        }
    }
    false
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(GlobalShortcutBuilder::new().build())
        .invoke_handler(tauri::generate_handler![
            greet,
            is_process_running,
            has_multiple_monitors
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
