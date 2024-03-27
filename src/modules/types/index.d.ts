// Type definitions for Yet Another DataTable Column Filter 0.94.beta.46
// Project: yadcf
// Definitions by: Davey Jacobson <https://daveyjake.dev>

// @ts-ignore
import DataTable, { type Api, type number as ColumnNumber, type ColumnSelector as ColSelector, type Config, type DomSelector } from 'datatables.net';

//
// Column Parameters
//

/**
 * Append data `before` or along with the value retrieved from the table.
 *
 * @since 0.0.1
 *
 * @remarks `sorted` only works on array of primitives.
 */
type AppendDataToTableData = 'before' | 'sorted';

/**
 * Enable case-insensitive filtering.
 *
 * @since 0.0.1
 *
 * @remarks Use when **filter_type** equals `select`, `auto_complete`, `text`.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type CaseInsensitive<T> = T extends FilterTypeMatchMode ? boolean : never;

/**
 * Add checkboxes `exclude` and `regex` after input text column.
 *
 * @since 0.0.1
 *
 * @remarks Use with `text` filter.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type CheckboxPositionAfter<T> = T extends 'text' ? boolean : never;

/**
 * Helper function to identify `text` present in any cell.
 *
 * @since 0.0.1
 */
type ColumnDataRender = ( data: Record<string, any> ) => any;

/**
 * Helper function to parse data found in a column.
 *
 * @since 0.0.1
 */
type ColumnNumberRender = ( dataObject: Record<string, any>, action: string, data: Array<any>, meta: { row: number, col: number, settings: any } ) => any;

/**
 * Type of data in column.
 *
 * @since 0.0.1
 *
 * @remarks Use `rendered_html` when using `render()` on `columnDefs` or similar.
 */
type ColumnDataType = 'text' | 'html' | 'rendered_html' | 'html5_data_complex';

/**
 * Custom filter function applied to the columns.
 *
 * @since 0.0.1
 *
 * @remarks Required when **filter_type** is set to a value in {@link FilterTypeCustomFunc}.
 *
 * @privateremarks When using **multi_select_custom_func** as {@link FilterType},
 * **filterVal** will hold an array of selected values from the multi select element.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 *
 * @param filterVal Value from a select drop-down.
 * @param columnVal Value from the relevant row column.
 * @param rowValues Array of values from the entire row.
 * @param stateVal  Holds the current state of the table row DOM.
 */
type CustomFunc<T> = T extends FilterTypeCustomFunc ? (( filterVal: string, columnVal: unknown, rowValues: Array<any>, stateVal: Node ) => boolean) : never;

/**
 * Delimiter that separates min and max values for number range filter type.
 *
 * @since 0.0.1
 */
type CustomRangeDelimeter = string;

/**
 * The {@link https://datatables.net/reference/type/column-selector `column-selector`}
 * of the column to which the filter will be applied.
 *
 * @since 0.0.1
 */
type ColumnSelector = ColSelector;

/**
 * Predefined data for filter.
 *
 * @since 0.0.1
 *
 * @remarks When **filter_type** is set to `custom_func` or `multi_select_custom_func`, this will populate the custom
 * select filter element.
 */
type Data = any;

/**
 * Feed data to filter as is. Use when you want to define your own `<option></option>` for the filter.
 *
 * @since 0.0.1
 *
 * @remarks Only use when **filter_type** is set to `select` or `multi_select`.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type DataAsIs<T> = T extends FilterTypeDataAsIs ? boolean : never;

/**
 * Delimiter that separates text in table column.
 *
 * @since 0.0.1
 */
type DataTextDelimeter = string;

/**
 * Defines the format in which the date values are parsed in `Date` object.
 *
 * @since 0.0.1
 */
type DateFormat = 'mm/dd/yyyy' | 'mm-dd-yyyy' | 'dd/mm/yyyy' | 'dd-mm-yyyy' | 'mm/dd/yy' | 'mm-dd-yy' | 'dd/mm/yy' | 'dd-mm-yy' | 'yyyy-mm-dd' | 'hh:mm';

/**
 * Defines the format in which the date values are being parsed in Date object by `moment.js` library.
 *
 * @since 0.0.1
 * @link https://momentjs.com/docs/#/displaying/
 */
type DateFormatMoment = 'MMMM Do YYYY' | 'MMM D YYYY' | 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'HH:mm';

/**
 * Specify the `datepicker` library to use.
 *
 * @since 0.0.1
 *
 * @remarks This feature depends on `moment.js` library.
 */
type DatepickerType = 'jquery-ui' | 'bootstrap-datetimepicker' | 'bootstrap-datepicker' | 'daterangepicker' | 'dt-datetime';

/**
 * Add checkbox next to filter to enable `not/exclude` filtering.
 *
 * @since 0.0.1
 *
 * @remarks Use with `text`, `select`, and `number_range`.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type ExcludeCheckbox<T> = T extends FilterTypeExclude ? boolean : never;

/**
 * Label above the exclude checkbox.
 *
 * @since 0.0.1
 */
type ExcludeLabel = string;

/**
 * Adds external checkboxes button and hides `exclude`, `null`, `regex` checkboxes.
 *
 * @since 0.0.1
 */
type ExtTriggeredCheckboxesText = boolean | string;

/**
 * Add `onclick` function to external checkboxes button using `event` parameter.
 *
 * @since 0.0.1
 */
type ExtTriggeredCheckboxesFunction = ( event: Event ) => any;

/**
 * Add additional classes to external checkboxes filter button.
 *
 * @since 0.0.1
 */
type ExtTriggeredCheckboxesButtonStyleClass = string;

/**
 * The complete `filter_type` values.
 *
 * @since 0.0.1
 */
type Filter = 'select' | 'multi_select' | 'auto_complete' | 'text' | 'date' | 'range_number' | 'range_number_slider' | 'range_date' | 'custom_func' | 'multi_select_custom_func' | 'date_custom_func';

/**
 * Use in lieu of placing filter in column header.
 *
 * @since 0.0.1
 *
 * @remarks Pass the ID of the desired container for the column filter.
 */
type FilterContainerID = string;

/**
 * Use in lieu of placing filter in column header.
 *
 * @since 0.0.1
 *
 * @remarks Pass the jQuery selector of the desired container for the column filter.
 */
type FilterContainerSelector = string;

/**
 * Label that will appear in the select menu filter when no value is selected.
 *
 * @since 0.0.1
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type FilterDefaultLabel<T> = T extends 'range_number' ? Array<string> : string;

/**
 * Delay filter execution for this many milliseconds.
 *
 * @since 0.0.1
 *
 * @remarks Use with `text`, `range_number`, `range_date`, `range_number_slider`.
 */
type FilterDelay<T> = T extends FilterTypeFilterDelay ? number : never;

/**
 * Allows to control the matching mode of the filter.
 *
 * @since 0.0.1
 *
 * @remarks Only use with `select`, `auto_complete`, `text`.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type FilterMatchMode<T = 'select'> = T extends FilterTypeMatchMode ? 'contains' | 'exact' | 'startsWith' | 'regex' : never;

/**
 * Parameter to pass to jQuery Autocomplete, jQuery Slider and/or Bootstrap Datetimepicker.
 *
 * @since 0.0.1
 */
type FilterPluginOptions = Record<string, any>;

/**
 * The text that will appear inside the reset button next to the select drop down.
 *
 * @since 0.0.1
 *
 * @remarks Set to `false` to hide from that specific column filter.
 */
type FilterResetButtonText = false | string;

/**
 * The complete filter types.
 *
 * @since 0.0.1
 */
type FilterType = FilterTypeCustomFunc | FilterTypeDataAsIs | FilterTypeHTMLDataSelector | FilterTypeRemaining;

/**
 * The `custom_func` setting is required when `filter_type` is one of these.
 *
 * @since 0.0.1
 */
type FilterTypeCustomFunc = 'custom_func' | 'multi_select_custom_func' | 'date_custom_func';

/**
 * When using `data_as_is`, it is only supported with **filter_type** is set to the following:
 *
 * - `select`
 * - `multi_select`
 *
 * @since 0.0.1
 */
type FilterTypeDataAsIs = 'select' | 'multi_select';

/**
 * The `exclude` option is only supported by...
 *
 * - `range_number`
 * - `select`
 * - `text`
 *
 * @since 0.0.1
 */
// type FilterTypeExclude = Exclude<FilterTypeRemaining, 'date' | 'range_date'> | Extract<FilterTypeDataAsIs, 'select'>;
type FilterTypeExclude = 'range_number' | 'select' | 'text';

/**
 * The `filter_delay` setting is only supported by...
 *
 * - `text`
 * - `range_date`
 * - `range_number`
 * - `range_number_slider`
 *
 * @since 0.0.1
 */
// type FilterTypeFilterDelay = Exclude<FilterTypeRemaining, 'date'> | Extract<FilterTypeHTMLDataSelector, 'range_number_slider'>;
type FilterTypeFilterDelay = 'text' | 'range_date' | 'range_number' | 'range_number_slider';

/**
 * The `html_data_selector` setting is only supported when `filter_type` is...
 *
 * - `auto_complete`
 * - `range_number_slider`
 * - `select`
 *
 * @since 0.0.1
 */
// type FilterTypeHTMLDataSelector = 'auto_complete' | 'range_number_slider' | Exclude<FilterTypeDataAsIs, 'multi_select'>;
type FilterTypeHTMLDataSelector = 'auto_complete' | 'range_number_slider' | 'select';

/**
 * The `filter_match_mode` option only works when `filter_type` is set to...
 *
 * - `auto_complete`
 * - `select`
 * - `text`
 *
 * @since 0.0.1
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
// type FilterTypeMatchMode = Exclude<FilterTypeHTMLDataSelector, 'range_number_slider'> | Extract<FilterTypeRemaining, 'text'>;
type FilterTypeMatchMode = 'auto_complete' | 'select' | 'text';

/**
 * The `filter_type` property values for use with the `initMultipleTables` method:
 *
 * - `text`
 * - `select`
 * - `multi_select`
 *
 * @since 0.0.1
 */
// type FilterTypeMulti = Exclude<FilterTypeMatchMode, 'auto_complete'> | Extract<FilterTypeDataAsIs, 'multi_select'>;
type FilterTypeMulti = 'text' | 'select' | 'multi_select';

/**
 * The `omit_default_label` depends on the following `filter_type` values:
 *
 * - `select`
 * - `multi_select`
 * - `custom_func`
 * - `multi_select_custom_func`
 *
 * @since 0.0.1
 */
// type FilterTypeOmitDefaultLabel = FilterTypeDataAsIs | Exclude<FilterTypeCustomFunc, 'date_custom_func'>;
type FilterTypeOmitDefaultLabel = 'select' | 'multi_select' | 'custom_func' | 'multi_select_custom_func';

/**
 * Range filters:
 *
 * - `range_date`
 * - `range_number`
 * - `range_number_slider`
 *
 * @since 0.0.1
 */
// type FilterTypeRange = Exclude<FilterTypeFilterDelay, 'text'>;
type FilterTypeRange = 'range_date' | 'range_number' | 'range_number_slider';

/**
 * The type of the filter to be used in the column.
 *
 * @since 0.0.1
 */
type FilterTypeRemaining = 'text' | 'date' | 'range_number' | 'range_date';

/**
 * The `style_class` option is only supported by...
 *
 * - `select`
 * - `multi_select`
 * - `text`
 * - `custom_func`
 * - `multi_select_custom_func`
 * - `range_number`
 * - `range_number_slider`
 * - `range_date`
 *
 * @since 0.0.1
 */
// type FilterTypeStyleClass = FilterTypeOmitDefaultLabel |& Exclude<FilterTypeRemaining, 'date'> |& Extract<FilterTypeHTMLDataSelector, 'range_number_slider'>;
type FilterTypeStyleClass = 'select' | 'multi_select' | 'text' | 'custom_func' | 'multi_select_custom_func' | 'range_number' | 'range_number_slider' | 'range_date';

/**
 * Allows for advanced text value selection within HTML inside table cell (ex: `li:eq(1)`).
 *
 * @since 0.0.1
 *
 * @remarks Selector string is searched from the first element inside the table cell.
 * Only use with `range_number_slider`, `select`, `auto_complete`.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type HTMLDataSelector<T> = T extends FilterTypeHTMLDataSelector ? string : never;

/**
 * How your data is parsed.
 *
 * @since 0.0.1
 */
type HTMLDataType = 'text' | 'value' | 'id' | 'selector';

/**
 * Allows to filter based on HTML5 `data-{(sort | order) | (filter | search)}` attributes.
 *
 * @since 0.0.1
 * @link https://www.datatables.net/examples/advanced_init/html5-data-attributes.html
 */
type HTML5Data = 'data-filter' | 'data-search' | 'data-sort' | 'data-order';

/**
 * Tells the `range_number` and `range_number_slider` to ignore specific characters while filtering.
 *
 * @since 0.0.1
 */
type IgnoreChar = string | RegExp;

/**
 * Labels that will appear in the select menu filter when no value is selected.
 *
 * @since 0.0.1
 *
 * @property `select`
 * @property `select_multi`
 * @property `filter`
 * @property `range`
 * @property `date`
 */
type Language = {
  select: string;
  select_multi: string;
  filter: string;
  range: [ string, string ];
  date: string;
};

/**
 * Add checkbox next to filter to search for null values.
 *
 * @since 0.0.1
 *
 * @remarks Use with `text` and `range_number` filters.
 */
type NullCheckBox<T> = T extends Exclude<FilterTypeRemaining, 'date' | 'range_date'> ? boolean : never;

/**
 * Label above the null checkbox.
 *
 * @since 0.0.1
 */
type NullLabel = string;

/**
 * Prevent yadcf from adding 'default_label'.
 *
 * @since 0.0.1
 *
 * @remarks Only use with 'select', 'multi_select', 'custom_func', 'multi_select_custom_func'.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type OmitDefaultLabel<T> = T extends FilterTypeOmitDefaultLabel ? boolean : never;

/**
 * Add checkbox next to filter to switch `regex`, `filter_match_mode` on the fly.
 *
 * @since 0.0.1
 *
 * @remarks Only use with `text` filter.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type RegexCheckBox<T> = T extends 'text' ? boolean : never;

/**
 * Label above the regex checkbox.
 *
 * @since 0.0.1
 */
type RegexLabel = string;

/**
 * String value which internally represents `null` option in select filters.
 *
 * @since 0.0.1
 *
 * @remarks Use with `exclude`.
 */
type SelectNullOption = string;

/**
 * Turn basic `select` element into `Chose` or `Select2` drop down.
 *
 * @since 0.0.1
 *
 * @remarks When using `custom_select`, call `initSelectPluginCustomTriggers` before calling yadcf constructor / init.
 */
type SelectType = 'chosen' | 'select2' | 'jquery-ui' | 'bootstrap-datetimepicker' | 'custom_select';

/**
 * Parameter to pass as is to `Chosen/Select` plugin.
 *
 * @since 0.0.1
 */
type SelectTypeOptions<T extends SelectType> = T extends 'chosen' ?
  Chosen.Options :
  T extends 'select2' ?
    Select2.Options :
    T extends 'jquery-ui' ?
      DateTimePickerOptions :
      T extends 'bootstrap-datetimepicker' ? EonasdanBootstrapDatetimepicker.SetOptions : any;

/**
 * Defines how the values in the filter will be sorted.
 *
 * @since 0.0.1
 *
 * @remarks Use `none` to preserve the order of the data attribute as is.
 */
type SortAs = 'alpha' | 'num' | 'alphaNum' | 'custom' | 'none';

/**
 * Allows user to provide a custom sorting function for the filtered elements.
 *
 * @since 0.0.1
 */
type SortAsCustomFunc = ( a: any, b: any ) => number;

/**
 * Defines the order in which the filtered values are sorted.
 *
 * @since 0.0.1
 */
type SortOrder = 'asc' | 'desc';

/**
 * Range data type.
 *
 * @since 0.0.1
 *
 * @remarks Only use with `range_number`, `range_number_slider`, or `range_date`.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type RangeDataType<T> = T extends Exclude<FilterTypeFilterDelay, 'text'> ? 'single' | 'range' | 'delimeter' : never;

/**
 * Range data type delimeter.
 *
 * @since 0.0.1
 *
 * @remarks Only use with `range_number`, `range_number_slider`, or `range_date`.
 */
type RangeDataTypeDelimeter<T> = T extends Exclude<FilterTypeFilterDelay, 'text'> ? string : never;

/**
 * Add additional classes to filter reset button.
 *
 * @since 0.0.1
 */
type ResetButtonStyleClass = string;

/**
 * Add additional classes to filter.
 *
 * @since 0.0.1
 *
 * @remarks Use with `select`, `multi_select`, `text`, `custom_func`, `multi_select_custom_func`, `range_number`,
 * `range_number_slider`, `range_date`.
 *
 * @typeParam `T` Generic type placeholder for {@link FilterType}.
 */
type StyleClass<T> = T extends FilterTypeStyleClass ? string : never;


//
// Table Parameters
//


/**
 * Only filter when yadcf.exFilterExternallyTriggered(table_arg) is called.
 *
 * @since 0.0.1
 *
 * @remarks Useful when you want to trigger a filter when clicking on or selecting from an input.
 */
type ExternallyTriggered = boolean;

/**
 * Populate options from filtered rows (aka only use the data that remains after filtering).
 *
 * @since 0.0.1
 */
type CumulativeFiltering = boolean;

/**
 * Filters placed in the header `thead` or footer `tfoot`.
 *
 * @since 0.0.1
 */
type FiltersPosition = 'thead' | 'header' | 'tfoot' | 'footer';

/**
 * Enable control of the `tr` index inside the table header `thead`.
 *
 * @since 0.0.1
 *
 * @remarks Useful when one `tr` is used for headers/sort and another is used for filters.
 */
type FiltersTrIdx = number;

/**
 * Calls the provided callback function in the end of the `yadcf.init()` method.
 *
 * @since 0.0.1
 *
 * @remarks This callback function will run before datatables fires its event (i.e. draw/xhr/etc).
 * Useful for initializing third parties and/or loading code.
 */
type OnInitComplete = ( args?: any ) => any;

/**
 * ISO-2 locale countries.
 *
 * @since 0.0.1
 */
type ISO2Locales = (
  'af' | 'ar-DZ' | 'ar'    | 'az'    | 'be'    | 'bg'    | 'bs' | 'ca' | 'cs' | 'cy-GB' |
  'da' | 'de'    | 'el'    | 'en-AU' | 'en-GB' | 'en-NZ' | 'eo' | 'es' | 'et' | 'eu'    |
  'fa' | 'fi'    | 'fo'    | 'fr-CA' | 'fr-CH' | 'fr'    | 'gl' | 'he' | 'hi' | 'hr'    |
  'hu' | 'hy'    | 'id'    | 'is'    | 'it-CH' | 'it'    | 'ja' | 'ka' | 'kk' | 'km'    |
  'ko' | 'ky'    | 'lb'    | 'lt'    | 'lv'    | 'mk'    | 'ml' | 'ms' | 'nb' | 'nl-BE' |
  'nl' | 'nn'    | 'no'    | 'pl'    | 'pt-BR' | 'pt'    | 'rm' | 'ro' | 'ru' | 'sk'    |
  'sl' | 'sq'    | 'sr-SR' | 'sr'    | 'sv'    | 'ta'    | 'th' | 'tj' | 'tr' | 'uk'    |
  'vi' | 'zh-CN' | 'zh-HK' | 'zh-TW'
);

/**
 * Load localized jQuery UI `datepicker`.
 *
 * @since 0.0.1
 *
 * @remarks Requires `jquery-ui-i18n` library.
 */
type JQueryUIDatepickerLocale = '' | ISO2Locales;

/**
 * Value represents ***null***, used as argument for `fnFilter` and sent to server.
 *
 * @since 0.0.1
 *
 * @remarks Use when `null_check_box` is true.
 */
type NullApiCallValue = string;

/**
 * Value represents ***not null***, used as argument for `fnFilter` and sent to server.
 *
 * @since 0.0.1
 *
 * @remarks Use when `null_check_box` is true.
 */
type NotNullApiCallValue = string;

/**
 * Default options.
 *
 * @since 0.0.1
 *
 * @typeParam `F` Generic placeholder for {@link FilterType} and {@link FilterTypeMulti}.
 *
 * @property `case_insensitive`                                   — See {@link CaseInsensitive}.
 * @property `checkbox_position_after`                            — See {@link CheckboxPositionAfter}.
 * @property `column_data_type`                                   — See {@link ColumnDataType}.
 * @property `custom_range_delimiter`                             — See {@link CustomRangeDelimeter}.
 * @property `date_format`                                        — See {@link DateFormat}.
 * @property `datepicker_type`                                    — See {@link DatepickerType}.
 * @property `exclude_label`                                      — See {@link ExcludeLabel}.
 * @property `externally_triggered_checkboxes_button_style_class` — See {@link ExtTriggeredCheckboxesButtonStyleClass}.
 * @property `externally_triggered_checkboxes_function`           — See {@link ExtTriggeredCheckboxesFunction}.
 * @property `externally_triggered_checkboxes_text`               — See {@link ExtTriggeredCheckboxesText}.
 * @property `filter_match_mode`                                  — See {@link FilterMatchMode}.
 * @property `filter_type`                                        — See {@link FilterType}.
 * @property `html_data_type`                                     — See {@link HTMLDataType}.
 * @property `ignore_char`                                        — See {@link IgnoreChar}.
 * @property `language`                                           — See {@link Language}.
 * @property `null_label`                                         — See {@link NullLabel}.
 * @property `omit_default_label`                                 — See {@link OmitDefaultLabel}.
 * @property `range_data_type`                                    — See {@link RangeDataType}.
 * @property `range_data_type_delim`                              — See {@link RangeDataTypeDelimeter}.
 * @property `regex_label`                                        — See {@link RegexLabel}.
 * @property `reset_button_style_class`                           — See {@link ResetButtonStyleClass}.
 * @property `select_null_option`                                 — See {@link SelectNullOption}.
 * @property `select_type`                                        — See {@link SelectType}.
 * @property `select_type_options`                                — See {@link SelectTypeOptions}.
 * @property `sort_as`                                            — See {@link SortAs}.
 * @property `sort_order`                                         — See {@link SortOrder}.
 * @property `style_class`                                        — See {@link StyleClass}.
 */
interface DefaultOptions<F = FilterType | FilterTypeMulti> {
  case_insensitive: CaseInsensitive<F>;
  checkbox_position_after: CheckboxPositionAfter<F>;
  column_data_type: ColumnDataType;
  custom_range_delimiter: CustomRangeDelimeter;
  date_format: DateFormat;
  datepicker_type: DatepickerType;
  enable_auto_complete: boolean;
  exclude_label: ExcludeLabel;
  externally_triggered: boolean;
  externally_triggered_checkboxes_button_style_class: ExtTriggeredCheckboxesButtonStyleClass;
  externally_triggered_checkboxes_function?: ExtTriggeredCheckboxesFunction;
  externally_triggered_checkboxes_text: ExtTriggeredCheckboxesText;
  filter_match_mode: FilterMatchMode<F>;
  filter_type: F;
  html_data_type: HTMLDataType;
  ignore_char?: IgnoreChar;
  language: Language;
  null_label: NullLabel;
  omit_default_label: OmitDefaultLabel<F>;
  range_data_type: RangeDataType<F>;
  range_data_type_delim: RangeDataTypeDelimeter<F>;
  regex_label: RegexLabel;
  reset_button_style_class: ResetButtonStyleClass | false;
  select_null_option: SelectNullOption;
  select_type?: SelectType;
  select_type_options: SelectTypeOptions<SelectType>;
  sort_as: SortAs;
  sort_order: SortOrder;
  style_class: StyleClass<F>;
}

/**
 * The remaining missing default options.
 *
 * @since 0.0.1
 * @extends DefaultOptions
 *
 * @property `append_data_to_table_data`
 * @property `column_data_render`
 * @property `custom_func`
 * @property `data`
 * @property `data_as_is`
 * @property `exclude`
 * @property `filter_container_id`
 * @property `filter_container_selector`
 * @property `filter_default_label`
 * @property `filter_delay`
 * @property `filter_plugin_options`
 * @property `filter_reset_button_text`
 * @property `html_data_selector`
 * @property `html5_data`
 * @property `moment_date_format`
 * @property `null_check_box`
 * @property `regex_check_box`
 * @property `sort_as_custom_func`
 * @property `text_data_delimiter`
 */
interface MissingDefaults<F = FilterType | FilterTypeMulti> extends DefaultOptions<F> {
  append_data_to_table_data?: AppendDataToTableData;
  col_filter_array?: Record<string, any>;
  column_data_render?: ColumnDataRender;
  column_number_render?: ColumnNumberRender;
  column_number_str?: string;
  column_number_data?: number;
  custom_func?: CustomFunc<F>;
  data?: Data;
  data_as_is?: DataAsIs<F>;
  exclude?: ExcludeCheckbox<F>;
  filter_container_id?: FilterContainerID;
  filter_container_selector?: FilterContainerSelector;
  filter_default_label?: FilterDefaultLabel<F>;
  filter_delay?: FilterDelay<F>;
  filter_plugin_options?: FilterPluginOptions;
  filter_reset_button_text?: FilterResetButtonText;
  html_data_selector?: HTMLDataSelector<F>;
  html5_data?: HTML5Data;
  moment_date_format?: DateFormatMoment;
  null_check_box?: NullCheckBox<F>;
  regex_check_box?: RegexCheckBox<F>;
  sort_as_custom_func?: SortAsCustomFunc;
  text_data_delimiter?: DataTextDelimeter;
}

/**
 * All column parameters together.
 *
 * @since 0.0.1
 */
type ColNum = { column_number: number };
type ColSel = { column_selector: string };
type ColumnParameters<T extends number | string> = T extends number ? ColNum : ColSel;

/**
 * Table parameters.
 *
 * @since 0.0.1
 *
 * @see MissingDefaults
 *
 * @property `externally_triggered`        — See {@link ExternallyTriggered} for details.
 * @property `cumulative_filtering`        — See {@link CumulativeFiltering} for details.
 * @property `filters_position`            — See {@link FiltersPosition} for details.
 * @property `filters_tr_index`            — See {@link FiltersTrIdx} for details.
 * @property `onInitComplete`              — See {@link OnInitComplete} for details.
 * @property `jquery_ui_datepicker_locale` — See {@link JQueryUIDatepickerLocale} for details.
 * @property `null_api_call_value`         — See {@link NullApiCallValue} for details.
 * @property `not_null_api_call_value`     — See {@link NotNullApiCallValue} for details.
 */
interface TableParameters<F = FilterType | FilterTypeMulti> extends MissingDefaults<F> {
  externally_triggered?: ExternallyTriggered;
  cumulative_filtering?: CumulativeFiltering;
  filters_position?: FiltersPosition;
  filters_tr_index?: FiltersTrIdx;
  onInitComplete?: OnInitComplete;
  jquery_ui_datepicker_locale?: JQueryUIDatepickerLocale;
  null_api_call_value?: NullApiCallValue;
  not_null_api_call_value?: NotNullApiCallValue;
}

/**
 * Multiple table filter parameters.
 *
 * @since 0.0.1
 *
 * @see TableParameters
 * @see ColumnParameters
 * @see MissingDefaults
 * @see DefaultOptions
 *
 * @property `filter_container_id`
 */
interface MultiParams<F = FilterType | FilterTypeMulti> extends TableParameters<F> {
  filter_container_id: string;
}

/**
 * All parameters in one type.
 *
 * @since 0.0.1
 */
type AllParameters<F = FilterType | FilterTypeMulti> = ColumnParameters<number> & MultiParams<F>;

/**
 * Essentials for the `makeElement` method.
 *
 * @since 0.0.1
 */
interface MakeElementAttrs {
  onchange?: ( evt: GlobalEventHandlersEventMap['change'] ) => void;
  onclick?: ( evt: GlobalEventHandlersEventMap['click'] ) => void;
  onkeydown?: ( evt: GlobalEventHandlersEventMap['keydown'] ) => void;
  onkeyup?: ( evt: GlobalEventHandlersEventMap['keyup'] ) => void;
  onmousedown?: ( evt: GlobalEventHandlersEventMap['mousedown'] ) => void;
  id?: string;
  class?: string;
  multiple?: boolean;
  placeholder?: string | Array<string>;
  text?: boolean | string;
  title?: string;
  type?: string;
  html?: any;
  filter_match_mode?: AllParameters['filter_match_mode'];
  'data-placeholder'?: string | Array<string>;
}

/**
 * The `exFilterColumn` function accepts an array of tuples for arguments.
 *
 * @since 0.0.1
 */
type ExFilterColRange<T = number | string> = { from: T; to: T; }
type ExFilterColArgs = [ number, (string | ExFilterColRange | string[]) ];

/**
 * jQuery-based callback function.
 *
 * @since 0.0.1
 */
type JQueryCallbackFunc = ( $filterSelector: JQuery<HTMLElement> ) => any;

/**
 * Primary DataTables instance.
 *
 * @since 0.0.1
 */
export type DataTableInstance = DomSelector & DataTable<any> & Api<any> & Api<Object>;

export interface YADCF {
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
  init( oTable: DataTableInstance, options_arg: Array<AllParameters<FilterType> | AllParameters<FilterTypeMulti>>, params: any ): void;

  autocompleteKeyUP( table_selector_jq_friendly: string, event: Event ): void;

  dateKeyUP( table_selector_jq_friendly: string, date_format: DateFormat, event: Event ): void;

  dateSelectSingle( pDate: JQuery.TriggeredEvent & Date, pEvent?: JQuery.TriggeredEvent, clear?: 'clear' | 0 | 1 ): void;
  doFilter( arg: ('clear' | 'exclude') | { value: any }, table_selector_jq_friendly: string, column_number: number | string, filter_match_mode?: FilterMatchMode<DefaultOptions['filter_type']> ): void;
  doFilterAutocomplete( arg: 'clear' | Record<string, any>, table_selector_jq_friendly: string, column_number: number, filter_match_mode: FilterMatchMode<DefaultOptions['filter_type']> ): void;
  doFilterCustomDateFunc( arg: 'clear' | Record<string, any>, table_selector_jq_friendly: string , column_number: number ): void;
  doFilterMultiSelect( arg: string, table_selector_jq_friendly: string, column_number: number, filter_match_mode: FilterMatchMode<DefaultOptions['filter_type']> ): void;
  doFilterMultiTables( tablesSelectors: string, event: JQuery.Event, column_number_str: string, clear?: boolean ): void;
  doFilterMultiTablesMultiSelect( tablesSelectors: string, event: Event, column_number_str: string, clear?: 'clear' ): void;
  eventTargetFixUp( pEvent: Event ): void;

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
  exFilterColumn( table_arg: DataTableInstance, col_filter_arr: Array<ExFilterColArgs>, ajaxSource: boolean ): void;

  /**
   * Trigger all available filters.
   *
   * @since 0.0.1
   *
   * @remarks Use only when `externally_triggered` is set to true.
   *
   * @param table_arg DataTable variable instance.
   */
  exFilterExternallyTriggered( table_arg: DataTable<any> ): void;

  /**
   * Retrieve current column's filtered value.
   *
   * @since 0.0.1
   *
   * @param table_arg     DataTable variable instance.
   * @param column_number Column index number.
   */
  exGetColumnFilterVal<T = FilterTypeRange | 'multi_select'>( table_arg: DataTable<any>, column_number: number ): T extends FilterTypeRange ? object : T extends 'multi_select' ? Array<string> : string;

  /**
   * Update column filter with new data.
   *
   * @since 0.0.1
   *
   * @param table_arg   DataTable variable instance.
   * @param column_num  Column index number.
   * @param updatedData Same-structured data to use as update.
   */
  exRefreshColumnFilterWithDataProp( table_arg: DataTableInstance, col_num: number, updatedData: Record<string, any> ): void;

  /**
   * Reset all filters.
   *
   * @since 0.0.1
   *
   * @param table_arg DataTable variable instance.
   * @param noRedraw  True if you don't your table reloaded after resetting filter. Otherwise false.
   * @param columns   Array of column numbers starting at 1.
   */
  exResetAllFilters( table_arg: DataTableInstance, noRedraw: boolean, columns: Array<number> ): void;

  /**
   * Reset specific filters.
   *
   * @since 0.0.1
   *
   * @param table_arg DataTable variable instance.
   * @param columns   Column index numbers to target.
   * @param noRedraw  True if you don't your table reloaded after resetting filter. Otherwise false.
   */
  exResetFilters( table_arg: DataTableInstance, columns: Array<number | string>, noRedraw: boolean ): void;

  generateTableSelectorJQFriendlyNew( tmpStr: string ): string;
  generateTableSelectorJQFriendly2( obj: Api<any> ): void;
  getOptions<T = AllParameters>( selector: any ): Record<keyof T, T[ keyof T ]>;
  initAndBindTable( oTable: DataTableInstance, table_selector: string, index: number, pTableDT?: DataTableInstance ): void;

  /**
   * Initialize global defaults for all `yadcf` instances.
   *
   * @since 0.0.1
   *
   * @param params See {@link DefaultOptions} for details.
   */
  initDefaults<T = DefaultOptions>( params: T ): Record<keyof T, T[ keyof T ]>;

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
  initMultipleTables( tablesArray: Array<DataTable<any>>, filtersOptions: Array<AllParameters<FilterTypeMulti>> ): void;

  /**
   * Creates a filter that will affect multiple tables and/or multiple columns in multiple tables.
   *
   * @since 0.0.1
   *
   * @param table          DataTable instance.
   * @param filtersOptions Array of {@link AllParameters}.
   */
  initMultipleColumns( table: DataTable<any>, filtersOptions: Array<AllParameters<FilterTypeMulti>> ): void;

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
  initSelectPluginCustomTriggers( initFunc: JQueryCallbackFunc, refreshFunc: JQueryCallbackFunc, destroyFunc: JQueryCallbackFunc ): void;

  nullChecked( ev: Event, table_selector_jq_friendly: string, column_number: number ): void;
  preventDefaultForEnter( evt: Event ): void;
  rangeClear( table_selector_jq_friendly: string, event: Event, column_number: number ): void;
  rangeDateKeyUP( table_selector_jq_friendly: string, date_format: DateFormat, event: Event ): void;
  rangeNumberKeyUP( table_selector_jq_friendly: string, event: JQuery.Event ): void;
  rangeNumberSliderClear( table_selector_jq_friendly: string, event: Event ): void;
  setOptions( selector_arg: string, options_arg: Array<Record<string, any>>, params: any, table?: DataTableInstance ): void;
  stopPropagation( evt: Event ): void;
  textKeyUP( ev: Event, table_selector_jq_friendly: string, column_number: number, clear?: 'clear' ): void;
  textKeyUpMultiTables( tablesSelectors: string, event: JQuery.Event, column_number_str: string, clear?: string ): void;
}