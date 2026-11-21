#[cfg(target_os = "macos")]
use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem, Submenu},
    Emitter,
};

#[cfg(target_os = "macos")]
fn build_macos_menu(app: &tauri::AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    let open_item = MenuItem::with_id(app, "open", "Öffnen...", true, Some("CmdOrCtrl+O"))?;
    let save_item = MenuItem::with_id(app, "save", "Speichern", true, Some("CmdOrCtrl+S"))?;
    let quit_item = PredefinedMenuItem::quit(app, Some("Beenden"))?;

    let file_menu = Submenu::with_items(
        app,
        "Datei",
        true,
        &[
            &open_item,
            &save_item,
            &PredefinedMenuItem::separator(app)?,
            &quit_item,
        ],
    )?;

    let edit_menu = Submenu::with_items(
        app,
        "Bearbeiten",
        true,
        &[
            &PredefinedMenuItem::undo(app, Some("Rückgängig"))?,
            &PredefinedMenuItem::redo(app, Some("Wiederholen"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::cut(app, Some("Ausschneiden"))?,
            &PredefinedMenuItem::copy(app, Some("Kopieren"))?,
            &PredefinedMenuItem::paste(app, Some("Einfügen"))?,
            &PredefinedMenuItem::select_all(app, Some("Alles auswählen"))?,
        ],
    )?;

    let toggle_dark_item = MenuItem::with_id(
        app,
        "toggle-dark-mode",
        "Dark Mode umschalten",
        true,
        Some("CmdOrCtrl+Shift+D"),
    )?;
    let view_menu = Submenu::with_items(app, "Ansicht", true, &[&toggle_dark_item])?;

    let reset_db_item = MenuItem::with_id(app, "reset-db", "Zurücksetzen", true, None::<&str>)?;
    let db_menu = Submenu::with_items(app, "Datenbank", true, &[&reset_db_item])?;

    let check_updates_item =
        MenuItem::with_id(app, "check-updates", "Nach Updates suchen...", true, None::<&str>)?;
    let about_item = MenuItem::with_id(app, "about", "Über / Impressum", true, None::<&str>)?;
    let help_menu = Submenu::with_items(
        app,
        "Hilfe",
        true,
        &[
            &check_updates_item,
            &PredefinedMenuItem::separator(app)?,
            &about_item,
        ],
    )?;

    Menu::with_items(
        app,
        &[&file_menu, &edit_menu, &view_menu, &db_menu, &help_menu],
    )
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init());

    #[cfg(target_os = "macos")]
    let builder = builder
        .setup(|app| {
            let menu = build_macos_menu(app.handle())?;
            app.set_menu(menu)?;
            Ok(())
        })
        .on_menu_event(|app, event| {
            let _ = app.emit("tauri://menu-action", event.id().as_ref());
        });

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
