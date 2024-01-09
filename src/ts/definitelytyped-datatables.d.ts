// missing:
// - Some return types are not fully working

/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/datatables.net/index.d.ts" />
/// <reference types="datatables.net-colreorder/types/types.d.ts" />
/// <reference types="datatables.net-fixedheader/types/types.d.ts" />

declare namespace DataTables {
    interface JQueryDataTables extends JQuery {
        /** @deprecated Since 1.9. Use `settings()` instead. */
        fnSettings(): SettingsLegacy;
    }

    interface StaticFunctions {
        /** @deprecated Since 1.10. Use `isDataTable`. */
        fnIsDataTable(table: string | Node | JQuery | Api): boolean;
    }
}
