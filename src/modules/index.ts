import DataTable, { type Api } from 'datatables.net';
import type { YADCF, AllParameters, DataTableInstance, DateFormat, DefaultOptions, ExFilterColArgs, FilterMatchMode, FilterType, FilterTypeMatchMode, FilterTypeMulti, FilterTypeRange } from './types/index';

class Yadcf implements YADCF {

  /**
   * Primary initialization method.
   *
   * @since 0.0.1
   * @static
   *
   * @param oTable      DataTable instance.
   * @param options_arg Array of objects found in {@link ColumnParameters}.
   * @param params      Optional. Global {@link TableParameters}.
   */
  init( oTable: InstanceType<DataTable<any>>, options_arg: Array<AllParameters<FilterType> | AllParameters<FilterTypeMulti>>, params: any ): void {

  }

  autocompleteKeyUP( table_selector_jq_friendly: string, event: Event ): void {

  }

  /**
   * Reset all filters.
   *
   * @since 0.0.1
   *
   * @param table_arg DataTable variable instance.
   * @param noRedraw  True if you don't want your table reloaded after resetting filter. Otherwise false.
   */
  dateKeyUP( table_selector_jq_friendly: string, date_format: DateFormat, event: Event ): void {

  }

  dateSelectSingle( pDate: JQuery.TriggeredEvent & Date, pEvent?: JQuery.TriggeredEvent, clear?: 'clear' | 0 | 1 ): void {

  }

  doFilter( arg: ('clear' | 'exclude') | { value: any }, table_selector_jq_friendly: string, column_number: number | string, filter_match_mode?: FilterMatchMode<DefaultOptions['filter_type']> ): void {

  }

  doFilterAutocomplete( arg: 'clear' | Record<string, any>, table_selector_jq_friendly: string, column_number: number, filter_match_mode: FilterMatchMode<DefaultOptions['filter_type']> ): void {

  }

  doFilterCustomDateFunc( arg: 'clear' | Record<string, any>, table_selector_jq_friendly: string , column_number: number ): void {

  }

  doFilterMultiSelect( arg: string, table_selector_jq_friendly: string, column_number: number, filter_match_mode: FilterMatchMode<DefaultOptions['filter_type']> ): void {

  }

  doFilterMultiTables( tablesSelectors: string, event: JQuery.Event, column_number_str: string, clear?: boolean ): void {

  }

  doFilterMultiTablesMultiSelect( tablesSelectors: string, event: Event, column_number_str: string, clear?: 'clear' ): void {

  }

  eventTargetFixUp( pEvent: Event ): void {

  }

  /**
   * Trigger filters externally and/or programmatically.
   *
   * @since 0.0.1
   *
   * @remarks Use to show table with pre-filtered columns.
   *
   * @param table_arg      DataTable variable instance.
   * @param col_filter_arr Array of tuples contain column index and what to filter by.
   * @param ajaxSource     True if using AJAX-sourced data. False if not.
   */
  exFilterColumn( table_arg: Api<any>, col_filter_arr: Array<ExFilterColArgs>, ajaxSource: boolean ): void {

  }

  /**
   * Trigger all available filters.
   *
   * @since 0.0.1
   *
   * @remarks Use only when `externally_triggered` is set to true.
   *
   * @param table_arg DataTable variable instance.
   */
  exFilterExternallyTriggered( table_arg: DataTable<any> ): void {

  }

  /**
   * Retrieve current column's filtered value.
   *
   * @since 0.0.1
   *
   * @param table_arg     DataTable variable instance.
   * @param column_number Column index number.
   */
  exGetColumnFilterVal<T = FilterTypeRange | 'multi_select'>( table_arg: DataTable<any>, column_number: number ): T extends FilterTypeRange ? object : T extends 'multi_select' ? Array<string> : string {

  }

  /**
   * Update column filter with new data.
   *
   * @since 0.0.1
   *
   * @param table_arg   DataTable variable instance.
   * @param column_num  Column index number.
   * @param updatedData Same-structured data to use as update.
   */
  exRefreshColumnFilterWithDataProp( table_arg: Api<any>, col_num: number, updatedData: Record<string, any> ): void {

  }

  /**
   * Reset all filters.
   *
   * @since 0.0.1
   *
   * @param table_arg DataTable variable instance.
   * @param noRedraw  True if you don't your table reloaded after resetting filter. Otherwise false.
   * @param columns   Array of column numbers starting at 1.
   */
  exResetAllFilters( table_arg: Api<any>, noRedraw: boolean, columns: Array<number> ): void {

  }

  /**
   * Reset specific filters.
   *
   * @since 0.0.1
   *
   * @param table_arg DataTable variable instance.
   * @param columns   Column index numbers to target.
   * @param noRedraw  True if you don't your table reloaded after resetting filter. Otherwise false.
   */
  exResetFilters( table_arg: Api<any>, columns: Array<number | string>, noRedraw: boolean ): void {

  }

  generateTableSelectorJQFriendlyNew( tmpStr: string ): string;

  generateTableSelectorJQFriendly2( obj: Api<any> ): void {

  }

  getOptions<T = AllParameters>( selector: any ): Record<keyof T, T[ keyof T ]>;

  initAndBindTable( oTable: ConfigSettings, table_selector: string, index: number, pTableDT?: ConfigSettings ): void {

  }

  /**
   * Initialize global defaults for all `yadcf` instances.
   *
   * @since 0.0.1
   *
   * @param params See {@link DefaultOptions} for details.
   */
  initDefaults<T = DefaultOptions>( params: T ): Record<keyof T, T[ keyof T ]> {

  }

  /**
   * Creates a filter that will affect multiple tables and/or multiple columns in multiple tables.
   *
   * @since 0.0.1
   *
   * @remarks Each array **_must_** have the same length of items.
   *
   * @example
   *    // Notice there are 2 tables in the first array AND 2 filter objects in the second.
   *    yadcf.initMultipleTables( [ oTable1, oTable2 ], [ { ...filter1ArgsForTable1 }, { ...filter2ArgsForTable2 } ] );
   *
   * @param tablesArray
   * @param filtersOptions
   */
  initMultipleTables( tablesArray: Array<Api<any>>, filtersOptions: Array<AllParameters<FilterTypeMulti>> ): void {

  }

  /**
   * Creates a filter that will affect multiple tables and/or multiple columns in multiple tables.
   *
   * @since 0.0.1
   *
   * @param table          DataTable instance.
   * @param filtersOptions Array of {@link AllParameters}.
   */
  initMultipleColumns( table: Api<any>, filtersOptions: Array<AllParameters<FilterTypeMulti>> ): void {

  }

  /**
   * Callback function to be fired after `dt.xhr` event finishes.
   *
   * @since 0.0.1
   */
  initOnDtXhrComplete(): any;

  /**
   * Set, initialize and refresh any jQuery select plugin with functions.
   *
   * @since 0.0.1
   *
   * @remarks jQuery selector will be passed to the user defined function to initialize and refresh the plugin.
   *
   * @param initFunc    Function to initialize plugin.
   * @param refreshFunc Function to refresh plugin.
   * @param destroyFunc Function to destroy plugin instance.
   */
  initSelectPluginCustomTriggers( initFunc: JQueryCallbackFunc, refreshFunc: JQueryCallbackFunc, destroyFunc: JQueryCallbackFunc ): void {

  }

  nullChecked( ev: Event, table_selector_jq_friendly: string, column_number: number ): void {

  }

  preventDefaultForEnter( evt: Event ): void {

  }

  rangeClear( table_selector_jq_friendly: string, event: Event, column_number: number ): void {

  }

  rangeDateKeyUP( table_selector_jq_friendly: string, date_format: DateFormat, event: Event ): void {

  }

  rangeNumberKeyUP( table_selector_jq_friendly: string, event: JQuery.Event ): void {

  }

  rangeNumberSliderClear( table_selector_jq_friendly: string, event: Event ): void {

  }

  setOptions( selector_arg: string, options_arg: ArrayObjects, params: any, table?: Api<any> ): void {

  }

  stopPropagation( evt: Event ): void {

  }

  textKeyUP( ev: Event, table_selector_jq_friendly: string, column_number: number, clear?: 'clear' ): void {

  }

  textKeyUpMultiTables( tablesSelectors: string, event: JQuery.Event, column_number_str: string, clear?: string ): void {

  }
}