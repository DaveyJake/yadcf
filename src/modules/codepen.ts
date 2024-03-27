/*!
* Yet Another DataTables Column Filter - (yadcf)
*
* File:        jquery.dataTables.yadcf.js
* Version:     0.9.4.beta.46
*
* Author:      Daniel Reznick
* Info:        https://github.com/vedmack/yadcf
* Contact:     vedmack@gmail.com
* Twitter:     @danielreznick
* Q&A          http://stackoverflow.com/questions/tagged/yadcf
*
* Copyright 2015 Daniel Reznick, all rights reserved.
* Copyright 2015 Released under the MIT License
*
* This source file is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
* or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
*/
/*
* Parameters:
*
*
* -------------

* column_number
                Required:           true (or use column_selector)
                Type:               int
                Description:        The number of the column to which the filter will be applied

* column_selector
                Required:           true (or use column_number)
                Type:               see https://datatables.net/reference/type/column-selector for valid column-selector formats
                Description:        The column-selector of the column to which the filter will be applied

* filter_type
                Required:           false
                Type:               String
                Default value:      'select'
                Possible values:    select / multi_select / auto_complete / text / date / range_number / range_number_slider / range_date / custom_func / multi_select_custom_func / date_custom_func
                Description:        The type of the filter to be used in the column

* custom_func
                Required:           true (when filter_type is custom_func / multi_select_custom_func / date_custom_func)
                Type:               function
                Default value:      undefined
                Description:        should be pointing to a function with the following signature myCustomFilterFunction(filterVal, columnVal, rowValues, stateVal) , where `filterVal` is the value from the select box,
                                    `columnVal` is the value from the relevant row column, `rowValues` is an array that holds the values of the entire row and `stateVal` which holds the current state of the table row DOM
                                    , stateVal is perfect to handle situations in which you placing radiobuttons / checkbox inside table column. This function should return true if the row matches your condition and the row should be displayed) and false otherwise
                Note:               When using multi_select_custom_func as filter_type filterVal will hold an array of selected values from the multi select element

* data
                Required:           false
                Type:               Array (of string or objects)
                Description:        When the need of predefined data for filter is needed just use an array of strings ['value1','value2'....] (supported in select / multi_select / auto_complete filters) or
                                    array of objects [{value: 'Some Data 1', label: 'One'}, {value: 'Some Data 3', label: 'Three'}] (supported in select / multi_select filters)
                Note:               that when filter_type is custom_func / multi_select_custom_func this array will populate the custom filter select element

* data_as_is
                Required:           false
                Type:               boolean
                Default value:      false
                Description:        When set to true, the value of the data attribute will be fed into the filter as is (without any modification/decoration).
                                    Perfect to use when you want to define your own <option></option> for the filter
                Note:               Currently supported by the select / multi_select filters

* append_data_to_table_data
                Required:           false
                Type:               String
                Default value:      undefined
                Possible values:    before / sorted
                Description:        Use 'before' to place your data array before the values that yadcf grabs from the table
                                    use 'sorted' to place the data array sorted along with the values that yadcf grabs from the table
                Note:               'sorted' option will have affect only if you data is an array of primitives (not objects)

* column_data_type
                Required:           false
                Type:               String
                Default value:      'text'
                Possible values:    text / html / rendered_html / html5_data_complex
                Description:        The type of data in column , use 'html' when you have some html code in the column (support parsing of multiple elements per cell),
                                    use rendered_html when you are using render function of columnDefs or similar, that produces a html code, note that both types rendered_html and html have a fallback for simple text parsing.
                                    html5_data_complex allows to populate filter with pairs of display/value by using datatables datatables HTML5 data-* attributes - should be used along with specifying html5_data attribute (read docs)

* column_data_render
                Required:           false
                Type:               function
                Possible values:    function (data) {return data.someValue || ('whatever ' + data.otherValue)}
                Description:        function that will help yadcf to know what is 'text' is present in the cell
                Note:               Originally added to enable cumulative_filtering with column_data_type: 'rendered_html'

* text_data_delimiter
                Required:           false
                Type:               String
                Description:        Delimiter that separates text in table column, for example text_data_delimiter: ','

* custom_range_delimiter:
                Required:           false
                Type:               String
                Default value:      '-yadcf_delim-'
                Description:        Delimiter that separates min and max values for number range filter type, for example custom_range_delimiter: 'minMax'

* html_data_type
                Required:           false
                Type:               String
                Default value:      'text'
                Possible values:    text / value / id / selector
                Description:        When using 'html' for column_data_type argument you can choose how exactly to parse your html element/s in column , for example use 'text' for the following <span class='someClass'>Some text</span>
                Special notes:      when using selector you must provide a valid selector string for the html_data_selector property

* html_data_selector
                Required:           false
                Type:               String
                Default value:      undefined
                Possible values:    any valid selector string, for example 'li:eq(1)'
                Description:        allows for advanced text value selection within the html located in the td element
                Special notes:      know that the selector string 'begin is search' from (and not outside) the first element of the html inside the td
                                    (supported by range_number_slider / select / auto_complete)

* html5_data
                Required:           false
                Type:               String
                Default value:      undefined
                Possible values:    data-filter / data-search / anything that is supported by datatables
                Description:        Allows to filter based on data-filter / data-search attributes of the <td> element, read more: http://www.datatables.net/examples/advanced_init/html5-data-attributes.html
                Special notes:      Can be used along with column_data_type: 'html5_data_complex' to populate filter with pairs of display/value instead of values only

* filter_container_id
                Required:           false
                Type:               String
                Description:        In case that user don't want to place the filter in column header , he can pass an id of the desired container for the column filter

* filter_container_selector
                Required:           false
                Type:               String
                Description:        In case that user don't want to place the filter in column header , he can pass a (jquery) selector of the desired container for the column filter

* filter_default_label
                Required:           false
                Type:               String / Array of string in case of range_number filter (first entry is for the first input and the second entry is for the second input
                Default value:      'Select value'
                Description:        The label that will appear in the select menu filter when no value is selected from the filter

* omit_default_label
                Required:           false
                Type:               boolean
                Default value:      false
                Description:        Prevent yadcf from adding 'default_label' (Select value / Select values)
                Note                Currently supported in select / multi_select / custom_func / multi_select_custom_func

* filter_reset_button_text
                Required:           false
                Type:               String / boolean
                Default value:      'x'
                Description:        The text that will appear inside the reset button next to the select drop down (set this to false (boolean) in order to hide it from that column filter)

* enable_auto_complete (this attribute is deprecated , and will become obsolete in the future , so you better start using filter_type: 'auto_complete')
                Required:           false
                Type:               boolean
                Default value:      false
                Description:        Turns the filter into an autocomplete input - make use of the jQuery UI Autocomplete widget (with some enhancements)

* sort_as
                Required:           false
                Type:               String
                Default value:      'alpha'
                Possible values:    alpha / num / alphaNum / custom / none
                Description:        Defines how the values in the filter will be sorted, alphabetically / numerically / alphanumeric / custom / not sorted at all (none is useful to preserve
                                    the order of the data attribute as is)
                Note:               When custom value is set you must provide a custom sorting function for the sort_as_custom_func property

* sort_as_custom_func
                Required:           false
                Type:               function
                Default value:      undefined
                Description:        Allows to provide a custom sorting function for the filter elements

* sort_order
                Required:           false
                Type:               String
                Default value:      'asc'
                Possible values:    asc / desc
                Description:        Defines the order in which the values in the filter will be sorted, ascending or descending

* date_format
                Required:           false
                Type:               String
                Default value:      'mm/dd/yyyy'
                Possible values:    mm/dd/yyyy / dd/mm/yyyy / hh:mm (when using datepicker_type: 'bootstrap-datetimepicker')
                Description:        Defines the format in which the date values are being parsed into Date object
                Note:               You can replace the / separator with other one , for example mm-dd-yy

* moment_date_format
                Required:           false
                Type:               String
                Default value:      undefined
                Possible values:    Any format accepted by momentjs
                Description:        Defines the format in which the table date values are being parsed into Date object by momentjs library
                Note:               Currently relevant only when using datepicker_type: 'bootstrap-datetimepicker')

* ignore_char
                Required:           false
                Type:               String
                Description:        Tells the range_number and range_number_slider to ignore specific char while filtering (that char can used as number separator)
                Note:               Use double escape for regex chars , e.g \\$ , also you can use multiple ignore chars with | , e.g '_|\\.|\\$'

* filter_match_mode
                Required:           false
                Type:               String
                Default value:      contains
                Possible values:    contains / exact / startsWith / regex
                Description:        Allows to control the matching mode of the filter (supported in select / auto_complete / text filters)

* exclude
                Required:           false
                Type:               boolean
                Default value:      undefined
                Description:        Adds a checkbox next to the filter that allows to do a 'not/exclude' filtering (acts the same  all filter_match_mode)
                Note:               Currently available for the text, select and number_range filter

* exclude_label
                Required:           false
                Type:               String
                Default value:      'exclude'
                Description:        The label that will appear above the exclude checkbox

* regex_check_box
                Required:           false
                Type:               boolean
                Default value:      undefined
                Description:        Adds a checkbox next to the filter that allows to switch to regex filter_match_mode filtering on a fly
                Note:               Currently available for the text filter

* regex_label
                Required:           false
                Type:               String
                Default value:      'regex'
                Description:        The label that will appear above the regex checkbox

* null_check_box
                Required:           false
                Type:               boolean
                Default value:      undefined
                Description:        Adds a checkbox next to the filter that allows to filter by null value,
                                    works only for tables with data retrieved via data property, not working for html defined tables,
                                    where null is represented as string
                Note:               Currently available for the text and range_number filters

* null_label
                Required:           false
                Type:               String
                Default value:      'null'
                Description:        The label that will appear above the null checkbox

* checkbox_position_after
                Required:           false
                Type:               boolean
                Default value:      false
                Description:        Adds checkboxes exclude and regex after input text column
                Note:               Currently available for the text filter

* select_type
                Required:           false
                Type:               String
                Default value:      undefined
                Possible values:    chosen / select2 / custom_select
                Description:        Turns the simple select element into Chosen / Select2 (make use of the Chosen / Select2 select jQuery plugins)
                Note:               When using custom_select , make sure to call the initSelectPluginCustomTriggers,
                                    before calling yadcf constructor / init function

* select_type_options
                Required:           false
                Type:               Object
                Default value:      {}
                Description:        This parameter will be passed 'as is' to the Chosen/Select2 plugin constructor

* select_null_option
                Required:           false
                Type:               string
                Default value:      'null'
                Description:        String value which internally represents null option in select filters,
                                    also it is send to server if serverside feature is enabled
                                    Supports exclude, with exclude enabled the string is wrapped with exclude regex

* filter_plugin_options
                Required:           false
                Type:               Object
                Default value:      undefined
                Description:        This parameter will be passed to the jQuery Autocomplete / jQuery Slider / Bootstrap Datetimepicker

* case_insensitive
                Required:           false
                Type:               boolean
                Default value:      true
                Description:        Do case-insensitive filtering (supported in select / auto_complete / text filters)

* filter_delay
                Required:           false
                Type:               integer
                Default value:      undefined
                Description:        Delay filter execution for a XXX milliseconds - filter will fire XXX milliseconds after the last keyup.
                Special notes:      Currently supported in text / range_number / range_date filters / range_number_slider

* datepicker_type
                Required:           false
                Type:               String
                Default value:      'jquery-ui'
                Possible values:    'jquery-ui' / 'bootstrap-datetimepicker' / bootstrap-datepicker / daterangepicker / dt-datetime (DataTable Editor DateTime picker)
                Description:        You can choose datapicker library from defined in special notes
                Special notes:      Currently supported only jQueryUI datepicker (datepicker) and Bootstrap datepicker (eonasdan-bootstrap-datetimepicker)
                                    Bootstrap datepicker depends moment library. This plugin depends moment too.

* style_class
                Required:           false
                Type:               String
                Description:        Allows adding additional class/classes to filter - available for the following filters:
                                    select / multi_select / text / custom_func / multi_select_custom_func / range_number / range_number_slider / range_date

* reset_button_style_class
                Required:           false
                Type:               String
                Description:        Allows adding additional class/classes to filter reset button

* externally_triggered_checkboxes_text
                Required:           false
                Default value:      false,
                Type:               boolean | string
                Description:        Adds external checkboxes button, and hides exclude/null/regex checkboxes
                                    usecase: hide/show options (checkboxes) button, checkboxes in popover/modal

* externally_triggered_checkboxes_function
                Required:           false
                Default value:      undefined,
                Type:               function
                Description:        Adds onclick function to external checkboxes button, with event parameter

* externally_triggered_checkboxes_button_style_class
                Required:           false
                Default value:      ''
                Type:               String
                Description:        Allows adding additional class/classes to external checkboxes button

* Global Parameters (per table rather than per column)
*
* Usage example yadcf.init(oTable,[{column_number : 0}, {column_number: 3}],{cumulative_filtering: true});
* -------------

* externally_triggered
                Required:           false
                Type:               boolean
                Default value:      false
                Description:        Filters will filter only when yadcf.exFilterExternallyTriggered(table_arg) is called
                Special notes:      Useful when you want to build some form with filters and you want to trigger the filter when that form
                                    'submit' button is clicked (instead of filtering per filter input change)

* cumulative_filtering
                Required:           false
                Type:               boolean
                Default value:      false
                Description:        Change the default behavior of the filters so its options will be populated from the filtered rows (remaining
                                    table data after filtering) only, unlike the normal behavior in which the options of the filters are from all the table data

* filters_position
                Required:           false
                Type:               String
                Default value:      header
                Possible values:    'header' / 'footer'
                Description:        Filters can be placed in the header (thead) or in the footer (tfoot) of the table,
                Note:               When 'footer' you must provide a valid tfoot element in your table

* filters_tr_index
                Required:           false
                Type:               integer
                Default value:      undefined
                Description:        Allow to control the index of the <tr> inside the thead of the table, e.g when one <tr> is used for headers/sort and
                                    another <tr> is used for filters

* onInitComplete
                Required:           false
                Type:               function
                Default value:      undefined
                Description:        Calls the provided callback function in the end of the yadcf init function
                Note:               This callback function will run before datatables fires its event such as draw/xhr/etc., might be useful for call some
                                    third parties init / loading code

* jquery_ui_datepicker_locale
                Required:           false
                Type:               string
                Default value:      ''
                Description:        Load localized jquery-ui datepicker
                Note:               Need to load jquery-ui-i18n lib.
                Possible values:    af, ar-DZ, ar, az, be, bg, bs, ca, cs, cy-GB, da, de, el, en-AU, en-GB, en-NZ, eo, es, et, eu, fa, fi, fo, fr-CA, fr-CH,
                                    fr, gl, he, hi, hr, hu, hy, id, is, it-CH, it, ja, ka, kk, km, ko, ky, lb, lt, lv, mk, ml, ms, nb, nl-BE, nl, nn, no, pl,
                                    pt-BR, pt, rm, ro, ru, sk, sl, sq, sr-SR, sr, sv, ta, th, tj, tr, uk, vi, zh-CN, zh-HK, zh-TW

* null_api_call_value
                Required:           false
                Type:               string
                Default value:      'null'
                Description:        Value which represents null, and is used as argument for fnFilter function, and sent to server
                Note:               works with null filter enabled only

* not_null_api_call_value
                Required:           false
                Type:               string
                Default value:      '!^@'
                Description:        Value which represents not null, and is used as argument for fnFilter function, and sent to server
                Note:               works with null filter enabled only

*
*
*
*
* External API functions:
*
*
* -------------

* exFilterColumn
                Description:        Allows to trigger filter/s externally/programmatically (support ALL filter types!!!) , perfect for showing table with pre filtered columns
                Arguments:          table_arg: (variable of the datatable),
                                    array of pairs: column number String/Object with from and to, filter_value (the actual string value that we want to filter by)
                Usage example:      yadcf.exFilterColumn(oTable, [[0, 'Some Data 2']]); //pre filter one column
                                    yadcf.exFilterColumn(oTable, [[0, 'Some Data 1'], [1, {from: 111, to: 1110}], [2, {from: '', to: '11/25/2014'}]]); //pre filter several columns
                                    yadcf.exFilterColumn(oTable, [[0, ['Some Data 1','Some Data 2']]]); // for pre filtering multi select filter you should use array with values (or an array with single value)

* exGetColumnFilterVal
                Description:        Allows to retrieve  column current filtered value (support ALL filter types!!!)
                Arguments:          table_arg: (variable of the datatable),
                                    column number:  column number from which we want the value
                Usage example:      yadcf.exGetColumnFilterVal(oTable,1);
                Return value:       String (for simple filter) / Object (for range filter) with from and to properties / Array of strings for multi_select filter

* exResetAllFilters
                Description:        Allows to reset all filters externally/programmatically (support ALL filter types!!!) , perfect for adding a 'reset all' button to your page!
                Arguments:          table_arg: (variable of the datatable)
                                    noRedraw:   (boolean) , use it if you don't want your table to be reloaded after the filter reset,
                                                for example if you planning to call exFilterColumn function right after the exResetAllFilters (to avoid two AJAX requests)
                Usage example:      yadcf.exResetAllFilters(oTable);

* exResetFilters
                Description:        Allows to reset specific filters externally/programmatically (support ALL filter types!!!) , can be used for resetting one or more filters
                Arguments:          table_arg: (variable of the datatable)
                                    array with columns numbers
                                    noRedraw:   (boolean) , use it if you don't want your table to be reloaded after the filter reset,
                                                for example if you planning to call exFilterColumn function right after the exResetFilters (to avoid two AJAX requests)
                Usage example:      yadcf.exResetFilters(oTable, [1,2]);

* initSelectPluginCustomTriggers
                Description:        Allows to set any select jquery plugin initialize and refresh functions. jQuery selector will be passed to the user defined function to initialize and refresh the plugin.
                                    Great for integrating any jquery select plugin  (Selectize / MultiSelect / etc)
                Arguments:          initFunc  : function which will initialize the plugin
                                    refreshFunc : function that will refresh the plugin.
                                    destroyFunc : function that will destroy the plugin (upon table destroy even trigger).
                Usage example:      yadcf.initSelectPluginCustomTriggers(function ($filterSelector){$filterSelector.multiselect({});}, function ($filterSelector){$filterSelector.multiselect('refresh')}, , function ($filterSelector){$filterSelector.multiselect('destroy')});

* exFilterExternallyTriggered
                Description:        Triggers all the available filters, should be used only when the externally_triggered option used
                Arguments:          table_arg: (variable of the datatable)
                Usage example:      yadcf.exFilterExternallyTriggered(table_arg);

* exRefreshColumnFilterWithDataProp
                Description:        Updates column filter with new data, when data property was used in initialization for this filter
                                    e.g. select filter, when we used data property and we want to update it
                Arguments:          table_arg: variable of the datatable
                                    col_num: number index of column filter
                                    updatedData: array of new data (use same data structure as was used in yadcf.init options)
                Usage example:      yadcf.exRefreshColumnFilterWithDataProp(table_arg, 5, ['One', 'Two', 'Three']);

* initOnDtXhrComplete
                Description:        Allows to set a callback function to be called after dt xhr finishes
                Arguments:          function to do some logic
                Usage example:      yadcf.initOnDtXhrComplete(function() { $('#yadcf-filter--example-0').multiselect('refresh'); });

* initDefaults
                Description:        Init global defaults for all yadcf instances.
                Arguments:          Object consisting of anything defined inside default_options variable
                Usage example:      yadcf.initDefaults({language: {select: 'Pick some'}});

*
*
*
* Server-side processing API (see more on showcase):
*
* From server to client:
* In order to populate the filters with data from server (select / auto_complete / range_number_slider (min and max values), you should add to your current json respond the following properties:
* lets say for first column you add yadcf_data_0 filled with array of values, for column second column yadcf_data_1 and so on...
*
* From client to server:
* Read the filtered value like this (for first column) req.getParameter('columns[0][search][value]'); <- java code , php/.Net/etc you just need to get it from the request
* Range filter value will arrive delimited by  -yadcf_delim- , so just split it into an array or something like this: String[] minMax = sSearch_0.split('-yadcf_delim-');
*
*


*
*
*
* Working with filters for multiple tables:
*
*
* -------------

* initMultipleTables
                Description:        Allows to create filter that will affect multiple tables / multiple column(s) in multiple tables
                Arguments:          Array of tables,
                                    Array of objects with properties for each filter
                Usage example:      yadcf.initMultipleTables([oTable, oTable2], [{
                                        column_number: [0, 1], filter_container_id: 'multi-table-filter-0', filter_default_label: 'Filter all tables columns 1 and 2!'
                                    },
                                    {
                                        column_number: [2], filter_container_id: 'multi-table-filter-1', filter_default_label: 'Filter all tables column 3!'
                                    }]);
                Valid properties:   filter_type: 'text' (default) / 'select' / 'multi_select',
                                    column_number: not required (in that case the filter will be global)
                                                   can be either number(single column filter) or array of numbers(multiple columns filter)
                                    filter_container_id: '' (required),
                Note:               All the usual properties of yadcf should be supported in initMultipleTables too!

* initMultipleColumns
                Description:        Allows to create filter that will affect multiple column(s) in in a particular table
                Arguments:          Table variable,
                                    Array of objects with properties for each filter
                Usage example:      yadcf.initMultipleColumns(oTable, [{
                                        column_number: [0, 1], filter_container_id: 'multi-table-filter-0', filter_default_label: 'Filter columns 1 and 2!'
                                    },
                                    {
                                        column_number: [2, 3], filter_container_id: 'multi-table-filter-1', filter_default_label: 'Filter column 3 and 4!'
                                    }]);
                Valid properties:   filter_type: 'text' (default) / 'select' / 'multi_select',
                                    column_number: not required (in that case the filter will be global)
                                                   can be either number(single column filter) or array of numbers(multiple columns filter)
                                    filter_container_id: '' (required),
                Note:               All the usual properties of yadcf should be supported in initMultipleColumns too!
*/
// @ts-ignore
import DataTable, { Api, DomSelector, InstSelector, RowIdx } from "https://esm.sh/datatables.net";
import $ from 'https://esm.sh/jquery@3.7.1';
import * as jQueryUI from 'https://esm.sh/jqueryui';
import 'https://esm.sh/chosen-js';
import moment, { Moment } from 'https://esm.sh/moment';
import includes from 'https://esm.sh/lodash/includes';
import trim from 'https://esm.sh/lodash/trim';

// Type definitions for Yet Another DataTable Column Filter 0.94.beta.46
// Project: yadcf
// Definitions by: Davey Jacobson <https://daveyjake.dev>

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
 * @remarks Use with `select`, `auto_complete`, `text`.
 *
 * @typeParam `T` Generic type placeholder.
 */
type CaseInsensitive<T> = T extends FilterTypeMatchMode ? boolean : never;

/**
 * Add checkboxes `exclude` and `regex` after input text column.
 *
 * @since 0.0.1
 *
 * @remarks Use with `text` filter.
 *
 * @typeParam `T` Generic type placeholder.
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
 * @typeParam `T` Generic type placeholder.
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
 * @typeParam `T` Generic type placeholder.
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
 * @typeParam `T` Generic type placeholder.
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
 * @typeParam `T` Generic type placeholder.
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
 * @typeParam `T` Generic type placeholder.
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
type FilterTypeExclude = Exclude<FilterTypeRemaining, 'date' | 'range_date'> | Extract<FilterTypeDataAsIs, 'select'>;

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
type FilterTypeFilterDelay = Exclude<FilterTypeRemaining, 'date'> | Extract<FilterTypeHTMLDataSelector, 'range_number_slider'>;

/**
 * The `html_data_selector` setting is only supported when `filter_type` is...
 *
 * - `auto_complete`
 * - `range_number_slider`
 * - `select`
 *
 * @since 0.0.1
 */
type FilterTypeHTMLDataSelector = 'auto_complete' | 'range_number_slider' | Exclude<FilterTypeDataAsIs, 'multi_select'>;

/**
 * The `filter_match_mode` option only works when `filter_type` is set to...
 *
 * - `auto_complete`
 * - `select`
 * - `text`
 *
 * @since 0.0.1
 *
 * @typeParam `T` Generic type placeholder.
 */
type FilterTypeMatchMode = Exclude<FilterTypeHTMLDataSelector, 'range_number_slider'> | Extract<FilterTypeRemaining, 'text'>;

/**
 * The `filter_type` property values for use with the `initMultipleTables` method:
 *
 * - `text`
 * - `select`
 * - `multi_select`
 *
 * @since 0.0.1
 */
type FilterTypeMulti = Exclude<FilterTypeMatchMode, 'auto_complete'> | Extract<FilterTypeDataAsIs, 'multi_select'>;

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
type FilterTypeOmitDefaultLabel = FilterTypeDataAsIs | Exclude<FilterTypeCustomFunc, 'date_custom_func'>;

/**
 * Range filters:
 *
 * - `range_date`
 * - `range_number`
 * - `range_number_slider`
 *
 * @since 0.0.1
 */
type FilterTypeRange = Exclude<FilterTypeFilterDelay, 'text'>;

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
type FilterTypeStyleClass = FilterTypeOmitDefaultLabel | Exclude<FilterTypeRemaining, 'date'> | Extract<FilterTypeHTMLDataSelector, 'range_number_slider'>;

/**
 * The complete filter types.
 *
 * @since 0.0.1
 */
type FilterType = FilterTypeCustomFunc | FilterTypeDataAsIs | FilterTypeHTMLDataSelector | FilterTypeRemaining;

/**
 * Allows for advanced text value selection within HTML inside table cell (ex: `li:eq(1)`).
 *
 * @since 0.0.1
 *
 * @remarks Selector string is searched from the first element inside the table cell.
 * Only use with `range_number_slider`, `select`, `auto_complete`.
 *
 * @typeParam `T` Generic type placeholder.
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
 * @typeParam `T` Generic type placeholder.
 */
type OmitDefaultLabel<T> = T extends FilterTypeOmitDefaultLabel ? boolean : never;

/**
 * Add checkbox next to filter to switch `regex`, `filter_match_mode` on the fly.
 *
 * @since 0.0.1
 *
 * @remarks Only use with `text` filter.
 *
 * @typeParam `T` Generic type placeholder.
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
type SelectType = 'chosen' | 'select2' | 'custom_select' | 'jquery-ui' | 'bootstrap-datetimepicker';

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
 * @typeParam `T` Generic type placeholder.
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
 * @typeParam `T` Generic type placeholder.
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
interface TableParameters<F = FilterType | FilterTypeMulti> extends Partial<MissingDefaults<F>> {
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
interface MultiParams<F = FilterType | FilterTypeMulti> extends Partial<TableParameters<F>> {
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
export type DataTableInstance = InstanceType<DataTable<any>>;

/**
 * DataTables instance settings.
 *
 * @since 0.0.1
 */
export type DataTableSettings = ReturnType<DataTableInstance['settings']>;

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
  init( oTable: DataTableInstance, options_arg: Array<AllParameters>, params?: any ): void;

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
  generateTableSelectorJQFriendly2( obj: DataTableInstance ): void;
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

class Yadcf {
  private static _instance: Record<keyof YADCF, YADCF[ keyof YADCF ]> | null = null;

  private static tablesDT                = {};
  private static oTables: Record<string, DataTableInstance> = {};
  private static oTablesIndex            = {};
  private static options                 = {};
  private static plugins                 = {};
  private static exFilterColumnQueue     = [];
  private static selectElementCustomInitFunc;
  private static selectElementCustomRefreshFunc;
  private static selectElementCustomDestroyFunc;

  private static yadcfDelay: ((callback: (param: unknown) => void, ms: number, param?: any) => number) = ( function() {
    let timer = 0;

    return function( callback: ( param: unknown ) => void, ms: number, param: any ): number {
      clearTimeout( timer );

      timer = setTimeout( function(): void {
        callback( param );
      }, ms );

      return timer;
    };
  }() );

  private static default_options: TableParameters = {
    filter_type: 'select',
    sort_as: 'alpha',
    sort_order: 'asc',
    date_format: 'mm/dd/yyyy',
    ignore_char: undefined,
    filter_match_mode: 'contains',
    select_type: undefined,
    select_type_options: {},
    select_null_option: 'null',
    case_insensitive: true,
    column_data_type: 'text',
    html_data_type: 'text',
    exclude_label: 'exclude',
    regex_label: 'regex',
    null_label: 'null',
    checkbox_position_after: false,
    style_class: '',
    reset_button_style_class: '',
    datepicker_type: 'jquery-ui',
    range_data_type: 'single',
    range_data_type_delim: '-',
    omit_default_label: false,
    custom_range_delimiter: '-yadcf_delim-',
    externally_triggered_checkboxes_text: false,
    externally_triggered_checkboxes_function: undefined,
    externally_triggered_checkboxes_button_style_class: '',
    language: {
      select: 'Select value',
      select_multi: 'Select values',
      filter: 'Type to filter',
      range: [ 'From', 'To' ],
      date: 'Select a date'
    }
  };

  /**
   * Map an instantiated table to its specified settings.
   *
   * @since 0.0.1
   */
  private static settingsMap: Record<string, ReturnType<DataTableInstance['settings']>> = {};

  /**
   * Callback function that fires when jqXHR is finished.
   *
   * @since 0.0.1
   */
  private static dTXhrComplete: (() => any) | undefined;

  private static ctrlPressed                   = false;
  private static closeBootstrapDatepicker      = false;
  private static closeBootstrapDatepickerRange = false;
  private static closeSelect2                  = false;

  /**
   * Primary constructor.
   *
   * @returns yadcf
   */
  public static instance(): Record<keyof YADCF, YADCF[ keyof YADCF ]> {
    if ( Yadcf._instance === null ) {
      Yadcf._instance = {
        init: Yadcf.init,
        autocompleteKeyUP: Yadcf.autocompleteKeyUP,
        dateKeyUP: Yadcf.dateKeyUP,
        dateSelectSingle: Yadcf.dateSelectSingle,
        doFilter: Yadcf.doFilter,
        doFilterAutocomplete: Yadcf.doFilterAutocomplete,
        doFilterCustomDateFunc: Yadcf.doFilterCustomDateFunc,
        doFilterMultiSelect: Yadcf.doFilterMultiSelect,
        doFilterMultiTables: Yadcf.doFilterMultiTables,
        doFilterMultiTablesMultiSelect: Yadcf.doFilterMultiTablesMultiSelect,
        eventTargetFixUp: Yadcf.eventTargetFixUp,
        exFilterColumn: Yadcf.exFilterColumn,
        exFilterExternallyTriggered: Yadcf.exFilterExternallyTriggered,
        exGetColumnFilterVal: Yadcf.exGetColumnFilterVal,
        exRefreshColumnFilterWithDataProp: Yadcf.exRefreshColumnFilterWithDataProp,
        exResetAllFilters: Yadcf.exResetAllFilters,
        exResetFilters: Yadcf.exResetFilters,
        generateTableSelectorJQFriendlyNew: Yadcf.generateTableSelectorJQFriendlyNew,
        generateTableSelectorJQFriendly2: Yadcf.generateTableSelectorJQFriendly2,
        getOptions: Yadcf.getOptions,
        setOptions: Yadcf.setOptions,
        initAndBindTable: Yadcf.initAndBindTable,
        initDefaults: Yadcf.initDefaults,
        initMultipleColumns: Yadcf.initMultipleColumns,
        initMultipleTables: Yadcf.initMultipleTables,
        initOnDtXhrComplete: Yadcf.initOnDtXhrComplete,
        initSelectPluginCustomTriggers: Yadcf.initSelectPluginCustomTriggers,
        nullChecked: Yadcf.nullChecked,
        preventDefaultForEnter: Yadcf.preventDefaultForEnter,
        rangeClear: Yadcf.rangeClear,
        rangeDateKeyUP: Yadcf.rangeDateKeyUP,
        rangeNumberKeyUP: Yadcf.rangeNumberKeyUP,
        rangeNumberSliderClear: Yadcf.rangeNumberSliderClear,
        stopPropagation: Yadcf.stopPropagation,
        textKeyUP: Yadcf.textKeyUP,
        textKeyUpMultiTables: Yadcf.textKeyUpMultiTables,
      };
    }

    return Yadcf._instance;
  }

  /**
   * @see setOptions
   * @see initAndBindTable
   *
   * @param oTable
   * @param options_arg
   * @param params
   */
  private static init( oTable: DataTableInstance, options_arg: Array<AllParameters>, params?: any ): void {
    const instance = oTable.settings()[0].oInstance;

    let i: number = 0,
        tableSelector: string = '#' + instance[0].id,
        selector: string,
        tmpParams: Record<string, any> | string;

    // In case instance.selector is undefined (jQuery 3).
    if ( !instance.selector ) {
      instance.selector = tableSelector;
    }

    if ( params === undefined ) {
      params = {};
    }
    else if ( typeof params === 'string' ) {
      tmpParams               = params;
      params                  = {};
      params.filters_position = tmpParams;
    }

    if ( params.filters_position === undefined || params.filters_position === 'header' ) {
      params.filters_position = 'thead';
    } else {
      params.filters_position = 'tfoot';
    }

    $( document ).data( `${instance.selector}_filters_position`, params.filters_position );

    if ( $( instance.selector ).length === 1 ) {
      Yadcf.setOptions( instance.selector, options_arg, params, oTable );
      Yadcf.initAndBindTable( instance, instance.selector, 0, oTable );
    } else {
      for ( i; i < $( instance.selector ).length; i++ ) {
        $.fn.dataTable.ext.iApiIndex = i;

        selector = instance.selector + `:eq( ${i} )`;

        Yadcf.setOptions( instance.selector, options_arg, params, oTable );
        Yadcf.initAndBindTable( instance, selector, i, oTable );
      }

      $.fn.dataTable.ext.iApiIndex = 0;
    }

    if ( params.onInitComplete !== undefined ) {
      params.onInitComplete();
    }
  }

  /**
   * Initialize default settings.
   *
   * @since 0.0.1
   *
   * @see default_options
   *
   * @param params
   * @returns Options object.
   */
  private static initDefaults( params: AllParameters ): AllParameters {
    return $.extend( true, Yadcf.default_options, params );
  }

  /**
   * @see dTXhrComplete
   *
   * @param initFunc
   */
  private static initOnDtXhrComplete( initFunc: () => any ): void {
    Yadcf.dTXhrComplete = initFunc;
  }

  /**
   * Get a specific option.
   *
   * @since 0.0.1
   *
   * @see options
   *
   * @param selector
   * @returns Value set in options.
   */
  private static getOptions( selector: any ): AllParameters[ keyof AllParameters ] {
    return Yadcf.options[ selector ];
  }

  /**
   * Event from plugin fix up.
   *
   * @since 0.0.1
   * @static
   *
   * @param pEvent
   * @returns Plugin event.
   */
  private static eventTargetFixUp( pEvent: any ): any {
    if ( pEvent.target === undefined ) {
      $.extend( pEvent, { target: pEvent.srcElement });
    }

    return pEvent;
  }

  /**
   * @see replaceAll
   *
   * @param obj
   *
   * @returns
   */
  private static generateTableSelectorJQFriendly2( obj: any ): string {
    let tmpStr: Element['id'];

    if ( obj.oInstance !== undefined && obj.oInstance.selector !== undefined ) {
      tmpStr = obj.oInstance.selector;
    } else if ( obj.selector !== undefined ) {
      tmpStr = obj.selector;
    } else if ( obj.table !== undefined ) {
      tmpStr = (obj.table().node() as Element).id;
    } else {
      return '';
    }

    tmpStr = Yadcf.replaceAll( tmpStr, '.', '-' );
    tmpStr = Yadcf.replaceAll( tmpStr, ' ', '' );

    return tmpStr.replace( ':', '-' ).replace( '(', '' ).replace( ')', '' ).replace( '#', '-' );
  }

  /**
   * @see replaceAll
   *
   * @param tmpStr
   *
   * @returns
   */
  private static generateTableSelectorJQFriendlyNew( tmpStr: string ): string {
    tmpStr = Yadcf.replaceAll( tmpStr, ':', '-' );
    tmpStr = Yadcf.replaceAll( tmpStr, '(', '' );
    tmpStr = Yadcf.replaceAll( tmpStr, ')', '' );
    tmpStr = Yadcf.replaceAll( tmpStr, ',', '' );
    tmpStr = Yadcf.replaceAll( tmpStr, '.', '-' );
    tmpStr = Yadcf.replaceAll( tmpStr, '#', '-' );
    tmpStr = Yadcf.replaceAll( tmpStr, ' ', '' );

    return tmpStr;
  }

  /**
   * @see getOptions
   * @see exGetColumnFilterVal
   * @see refreshSelectPlugin
   *
   *
   * @param arg
   * @param table_selector_jq_friendly
   * @param column_number
   * @returns
   */
  private static doFilterCustomDateFunc( arg: 'clear' | { value?: any }, table_selector_jq_friendly: string, column_number: number | string ): void {
    let oTable    = Yadcf.oTables[ table_selector_jq_friendly ],
        columnObj = Yadcf.getOptions( oTable.selector )[ column_number ],
        yadcfState;

    if ( arg === 'clear' && Yadcf.exGetColumnFilterVal( oTable, column_number ) === '' ) {
      return;
    }

    if ( typeof arg === 'object' && arg.value !== undefined && arg.value !== '-1' ) {
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );
    } else {
      //when arg === 'clear' or arg.value === '-1'
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '-1' ).trigger( 'focus' );
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );

      Yadcf.refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), '-1' );
    }

    if ( ! oTable.settings()[0].oLoadedState ) {
      oTable.settings()[0].oLoadedState = {};
      oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
    }

    if ( oTable.settings()[0].oFeatures.bStateSave === true && typeof arg === 'object' ) {
      if ( oTable.settings()[0].oLoadedState.yadcfState !== undefined && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = { from: arg.value };
      } else {
        yadcfState                                                = {};
        yadcfState[ table_selector_jq_friendly ]                  = [];
        yadcfState[ table_selector_jq_friendly ][ column_number ] = { from: arg.value };
        oTable.settings()[0].oLoadedState.yadcfState               = yadcfState;
      }

      oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
    }

    oTable.fnDraw();
  }

  /**
   * @see getSettingsObjFromTable
   * @see calcColumnNumberFilter
   * @see getOptions
   * @see clearStateSave
   * @see resetExcludeRegexCheckboxes
   * @see exGetColumnFilterVal
   * @see resetIApiIndex
   * @see refreshSelectPlugin
   * @see yadcfMatchFilter
   * @see addNullFilterCapability
   * @see stateSaveNullSelect
   *
   * @param arg
   * @param table_selector_jq_friendly
   * @param column_number
   * @param filter_match_mode
   *
   * @returns
   */
  private static doFilter( arg: ('clear' | 'exclude') | { value: any }, table_selector_jq_friendly: string, column_number: number, filter_match_mode?: FilterMatchMode ): void {
    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    let oTable          = Yadcf.oTables[ table_selector_jq_friendly ],
        exclude_checked = false,
        settingsDt      = Yadcf.getSettingsObjFromTable( oTable ),
        selected_value,
        selector,
        data_value,
        column_number_filter,
        columnObj;

    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );

    columnObj = Yadcf.getOptions( oTable.selector )[ column_number ];

    if ( columnObj.exclude ) {
      exclude_checked = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
    }

    if ( arg === 'clear' ) {
      Yadcf.clearStateSave( oTable, column_number, table_selector_jq_friendly );

      if ( exclude_checked ) {
        const elId = `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}`;

        Yadcf.resetExcludeRegexCheckboxes( $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ) );
        Yadcf.clearStateSave( oTable, column_number, table_selector_jq_friendly );
      }

      if ( Yadcf.exGetColumnFilterVal( oTable, column_number ) === '' ) {
        return;
      }

      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '-1' ).trigger( 'focus' );
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
      $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val`, '-1' );

      oTable.fnFilter( '', column_number_filter );

      Yadcf.resetIApiIndex();

      Yadcf.refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), '-1' );

      return;
    }

    if ( arg === 'exclude' && ($( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).find( 'option:selected' ).val() as string).trim() === '-1' ) {
      return;
    }

    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );

    selector       = arg === 'exclude' ? `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` : arg;
    selected_value = ($( selector ).find( 'option:selected' ).val() as string).trim();
    data_value     = ((typeof arg !== 'object' && arg === 'exclude') || exclude_checked) ? selected_value : arg.value;

    $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val`, data_value );

    if ( (typeof arg === 'object' && arg.value !== '-1') && selected_value !== columnObj.select_null_option ) {
      if ( oTable.settings()[0].oFeatures.bServerSide === false ) {
        oTable.fnDraw();
      }

      Yadcf.yadcfMatchFilter( oTable, selected_value, (filter_match_mode as FilterMatchMode), column_number_filter, exclude_checked, column_number );
    } else if ( selected_value === columnObj.select_null_option ) {
      if ( oTable.settings()[0].oFeatures.bServerSide === false ) {
        oTable.fnFilter( '', column_number_filter );

        Yadcf.addNullFilterCapability( table_selector_jq_friendly, column_number, true );

        oTable.fnDraw();
      } else {
        Yadcf.yadcfMatchFilter( oTable, selected_value, (filter_match_mode as FilterMatchMode), column_number_filter, exclude_checked, column_number );
      }

      if ( oTable.settings()[0].oFeatures.bStateSave === true ) {
        Yadcf.stateSaveNullSelect( oTable, columnObj, table_selector_jq_friendly, column_number, (filter_match_mode as FilterMatchMode), exclude_checked );

        oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
      }
    } else {
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );

      oTable.fnFilter( '', column_number_filter );
    }

    Yadcf.resetIApiIndex();
  }

  /**
   * @see getSettingsObjFromTable
   * @see calcColumnNumberFilter
   * @see resetIApiIndex
   *
   * @param arg
   * @param table_selector_jq_friendly
   * @param column_number
   * @param filter_match_mode
   */
  private static doFilterMultiSelect( arg: Array<any>, table_selector_jq_friendly: string, column_number: number | string, filter_match_mode: FilterMatchMode ): void {
    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    let oTable = Yadcf.oTables[ table_selector_jq_friendly ],
        selected_values = $( arg ).val(),
        selected_values_trimmed = [],
        i: number,
        stringForSearch: string,
        column_number_filter: any,
        settingsDt = Yadcf.getSettingsObjFromTable( oTable );

    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );

    $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val`, selected_values );

    if ( selected_values !== null ) {
      for ( i = selected_values.length - 1; i >= 0; i-- ) {
        if ( selected_values[ i ] === '-1' ) {
          selected_values.splice( i, 1 );
          break;
        }
      }

      for ( i = 0; i < selected_values.length; i++ ) {
        selected_values_trimmed.push( trim( selected_values[ i ] ) );
      }

      if ( selected_values_trimmed.length !== 0 ) {
        $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );

        if ( filter_match_mode !== 'regex' ) {
          stringForSearch = selected_values_trimmed.join( 'narutouzomaki' );
          stringForSearch = stringForSearch.replace( /([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1' );
          stringForSearch = stringForSearch.split( 'narutouzomaki' ).join( '|' );

          if ( filter_match_mode === 'contains' ) {
            oTable.fnFilter( stringForSearch, column_number_filter, true, false, true ); //'^((?!' + stringForSearch + ').)*$'
          } else if ( filter_match_mode === 'exact' ) {
            oTable.fnFilter( '^(' + stringForSearch + ')$', column_number_filter, true, false, true );
          } else if ( filter_match_mode === 'startsWith' ) {
            oTable.fnFilter( '^(' + stringForSearch + ')', column_number_filter, true, false, true );
          }
        } else {
          stringForSearch = selected_values_trimmed.join( '|' );
          oTable.fnFilter( stringForSearch, column_number_filter, true, false, true );
        }
      } else {
        $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
        oTable.fnFilter( '', column_number_filter );
      }
    } else {
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
      oTable.fnFilter( '', column_number_filter );
    }

    Yadcf.resetIApiIndex();
  }

  /**
   * @see getSettingsObjFromTable
   * @see calcColumnNumberFilter
   * @see exGetColumnFilterVal
   * @see resetIApiIndex
   * @see yadcfMatchFilter
   *
   * @param arg
   * @param table_selector_jq_friendly
   * @param column_number
   * @param filter_match_mode
   *
   * @returns
   */
  private static doFilterAutocomplete( arg: 'clear' | { value: any }, table_selector_jq_friendly: string, column_number: number | string, filter_match_mode: FilterMatchMode ): void {
    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    let oTable: DataTableInstance     = Yadcf.oTables[ table_selector_jq_friendly ],
        settingsDt: DataTableSettings = Yadcf.getSettingsObjFromTable( oTable ),
        column_number_filter: number | string;

    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );

    if ( arg === 'clear' ) {
      if ( Yadcf.exGetColumnFilterVal( oTable, column_number ) === '' ) {
        return;
      }

      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' ).trigger( 'focus' );
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );

      $( document ).removeData( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val` );

      oTable.fnFilter( '', column_number_filter );

      Yadcf.resetIApiIndex();

      return;
    }

    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );

    $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val`, arg.value );

    Yadcf.yadcfMatchFilter( oTable, arg.value, filter_match_mode, column_number_filter, false, column_number );

    Yadcf.resetIApiIndex();
  }

  /**
   * @see getOptions
   * @see eventTargetFixUp
   * @see refreshSelectPlugin
   *
   * @param tablesSelectors
   * @param event
   * @param column_number_str
   * @param clear
   *
   * @returns
   */
  private static doFilterMultiTablesMultiSelect( tablesSelectors: string, event: any, column_number_str: string, clear?: boolean ): void {
    const columnsObj = Yadcf.getOptions( `${tablesSelectors}_${column_number_str}` )[ column_number_str ];

    let regex     = false,
        smart     = true,
        caseInsen = true,
        tablesAsOne,
        tablesArray = Yadcf.oTables[ tablesSelectors ],
        selected_values = $( event.target ).val(),
        i;

    event       = Yadcf.eventTargetFixUp( event );
    tablesAsOne = new $.fn.dataTable.Api( tablesArray );

    if ( clear !== undefined || !selected_values || (selected_values as Array<any>).length === 0 ) {
      if ( clear !== undefined ) {
        $( event.target ).parent().find( 'select' ).val( '-1' ).trigger( 'focus' );
        $( event.target ).parent().find( 'selectn ' ).removeClass( 'inuse' );
      }

      if ( columnsObj.column_number instanceof Array ) {
        tablesAsOne.columns( columnsObj.column_number ).search( '' ).draw();
      } else {
        tablesAsOne.search( '' ).draw();
      }

      Yadcf.refreshSelectPlugin( columnsObj, $( '#' + columnsObj.filter_container_id + ' select' ), '-1' );

      return;
    }

    $( event.target ).addClass( 'inuse' );

    regex     = true;
    smart     = false;
    caseInsen = columnsObj.case_insensitive;

    if ( selected_values !== null && Array.isArray( selected_values ) ) {
      for ( i = selected_values.length - 1; i >= 0; i-- ) {
        if ( selected_values[ i ] === '-1' ) {
          selected_values.splice( i, 1 );
          break;
        }
      }

      if ( selected_values.length !== 0 ) {
        selected_values = selected_values.join( 'narutouzomaki' );
        selected_values = selected_values.replace( /([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1' );
        selected_values = selected_values.split( 'narutouzomaki' ).join( '|' );
      }
    }

    if ( columnsObj.filter_match_mode === 'exact' ) {
      selected_values = '^' + selected_values + '$';
    } else if ( columnsObj.filter_match_mode === 'startsWith' ) {
      selected_values = '^' + selected_values;
    }

    if ( columnsObj.column_number instanceof Array ) {
      tablesAsOne.columns( columnsObj.column_number ).search( selected_values, regex, smart, caseInsen ).draw();
    } else {
      tablesAsOne.search( selected_values, regex, smart, caseInsen ).draw();
    }
  }

  /**
   * @see getOptions
   * @see eventTargetFixUp
   * @see refreshSelectPlugin
   *
   * @param tablesSelectors
   * @param event
   * @param column_number_str
   * @param clear
   * @returns
   */
  private static doFilterMultiTables( tablesSelectors: string, event: any, column_number_str: string, clear?: boolean ): void {
    const columnsObj = Yadcf.getOptions( tablesSelectors + '_' + column_number_str )[ column_number_str ];

    let regex       = false,
        smart       = true,
        caseInsen   = true,
        tablesArray = Yadcf.oTables[ tablesSelectors ],
        searchVal,
        tablesAsOne;

    event       = Yadcf.eventTargetFixUp( event );
    tablesAsOne = new $.fn.dataTable.Api( tablesArray );

    if ( clear !== undefined || (event.target as HTMLSelectElement | HTMLInputElement).value === '-1' ) {
      if ( clear !== undefined ) {
        $( event.target ).parent().find( 'select' ).val( '-1' ).trigger( 'focus' );
        $( event.target ).parent().find( 'select' ).removeClass( 'inuse' );
      }

      if ( columnsObj.column_number instanceof Array ) {
        tablesAsOne.columns( columnsObj.column_number ).search( '' ).draw();
      } else {
        tablesAsOne.search( '' ).draw();
      }

      Yadcf.refreshSelectPlugin( columnsObj, $( '#' + columnsObj.filter_container_id + ' select' ), '-1' );

      return;
    }

    $( event.target ).addClass( 'inuse' );

    searchVal = (event.target as HTMLSelectElement | HTMLInputElement).value;
    smart     = false;
    caseInsen = columnsObj.case_insensitive;

    if ( columnsObj.filter_match_mode === 'contains' ) {
      regex = false;
    } else if ( columnsObj.filter_match_mode === 'exact' ) {
      regex = true;
      searchVal = '^' + searchVal + '$';
    } else if ( columnsObj.filter_match_mode === 'startsWith' ) {
      regex = true;
      searchVal = '^' + searchVal;
    }

    if ( columnsObj.column_number instanceof Array ) {
      tablesAsOne.columns( columnsObj.column_number ).search( searchVal, regex, smart, caseInsen ).draw();
    } else {
      tablesAsOne.search( searchVal, regex, smart, caseInsen ).draw();
    }
  }

  /**
   * @see getSettingsObjFromTable
   * @see getOptions
   * @see calcColumnNumberFilter
   * @see doFilterCustomDateFunc
   * @see exGetColumnFilterVal
   * @see rangeClear
   * @see resetIApiIndex
   *
   * @param pDate
   * @param pEvent
   * @param clear
   * @returns
   */
  private static dateSelectSingle( pDate: any, pEvent?: JQuery.TriggeredEvent, clear?: 'clear' | 0 | 1 ): void {
    let oTable: DataTableInstance,
        date: string | (JQuery.TriggeredEvent | Date),
        event: any,
        column_number: number | string,
        dashIndex: number,
        table_selector_jq_friendly: string,
        column_number_filter: any,
        settingsDt: DataTableSettings,
        columnObj: AllParameters<FilterType>,
        yadcfState;

    if ( pDate ) {
      if ( pDate.type === 'dp' ) {
        event = pDate.target;
      } else if ( pDate.type === 'changeDate' ) {
        event = pDate.currentTarget;
      } else if ( $( clear as 'clear' ).length === 1 ) { // dt-datetime
        date = pDate;
        event = clear;
        clear = undefined;
      } else {
        date = pDate;
        event = pEvent;
      }
    }

    column_number              = $( event as Element ).attr( 'id' ).replace( 'yadcf-filter-', '' ).replace( '-date', '' ).replace( '-reset', '' );
    dashIndex                  = (column_number as string).lastIndexOf( '-' );
    table_selector_jq_friendly = (column_number as string).substring( 0, dashIndex );

    column_number = (column_number as string).substring( dashIndex + 1 );

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    oTable     = Yadcf.oTables[ table_selector_jq_friendly ];
    settingsDt = Yadcf.getSettingsObjFromTable( oTable );
    columnObj  = Yadcf.getOptions( oTable.selector )[ column_number ];

    if ( pDate.type === 'dp' ) {
      if ( moment( $( event ).val(), columnObj.date_format ).isValid() ) {
        date = $( event ).val();
      } else {
        clear = 'clear';
      }

      $( event ).trigger( 'blur' );
    } else if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      if ( pDate.dates ) {
        date = pDate.format( 0, columnObj.date_format );
      }
    }

    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );

    if ( clear === undefined ) {
      if ( columnObj.filter_type !== 'date_custom_func' ) {
        oTable.fnFilter( date as string, column_number_filter );
      } else {
        Yadcf.doFilterCustomDateFunc( { value: date }, table_selector_jq_friendly, column_number );
      }

      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );
    }
    else if ( clear === 'clear' ) {
      if ( Yadcf.exGetColumnFilterVal( oTable, column_number ) === '' ) {
        return;
      }

      if ( columnObj.filter_type === 'date_custom_func' ) {
        // Handle state saving.
        if ( oTable.settings()[0].oFeatures.bStateSave === true && oTable.settings()[0].oLoadedState ) {
          if ( !oTable.settings()[0].oLoadedState ) {
            oTable.settings()[0].oLoadedState = {};
            oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
          }

          if ( oTable.settings()[0].oFeatures.bStateSave === true ) {
            if ( oTable.settings()[0].oLoadedState.yadcfState !== undefined && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
              oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = { from: '' };
            } else {
              yadcfState = {};
              yadcfState[ table_selector_jq_friendly ] = [];
              yadcfState[ table_selector_jq_friendly ][ column_number ] = { from: '' };
              oTable.settings()[0].oLoadedState.yadcfState = yadcfState;
            }

            oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
          }
        }
      }

      if ( columnObj.datepicker_type === 'daterangepicker' && oTable.settings()[0].oFeatures.bServerSide !== true ) {
        Yadcf.rangeClear( table_selector_jq_friendly, event, column_number );
      }
      else {
        if ( columnObj.filter_type !== 'date_custom_func' ) {
          oTable.fnFilter( '', column_number_filter );
        }
        else {
          $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' );

          Yadcf.doFilterCustomDateFunc({ value: date }, table_selector_jq_friendly, column_number );
        }
      }

      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' ).removeClass( 'inuse' );

      if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
        $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).datepicker( 'update' );
      }
    }

    Yadcf.resetIApiIndex();
  }

  /**
   * @see eventTargetFixUp
   * @see getSettingsObjFromTable
   * @see getOptions
   * @see calcColumnNumberFilter
   * @see resetExcludeRegexCheckboxes
   * @see clearStateSave
   * @see exGetColumnFilterVal
   * @see saveStateSave
   * @see resetIApiIndex
   *
   * @param table_selector_jq_friendly
   * @param event
   * @param column_number
   * @returns
   */
  private static rangeClear( table_selector_jq_friendly: string, event: JQuery.ClickEvent, column_number: number | string ): void {
    const oTable = Yadcf.oTables[ table_selector_jq_friendly ];

    let yadcfState,
        settingsDt,
        column_number_filter,
        currentFilterValues,
        columnObj,
        fromId = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`,
        toId = ``,
        $fromInput,
        $toInput;

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    event      = Yadcf.eventTargetFixUp( event );
    settingsDt = Yadcf.getSettingsObjFromTable( oTable );
    columnObj  = Yadcf.getOptions( oTable.selector )[ column_number ];

    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );
    Yadcf.resetExcludeRegexCheckboxes( $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ) );
    Yadcf.clearStateSave( oTable, column_number, table_selector_jq_friendly );

    if ( columnObj.null_check_box ) {
      $( `#${fromId}`.replace( '-from-date-', '-from-' ) ).prop( 'disabled', false );
      $( `#${toId}`.replace( '-to-date-', '-to-' ) ).prop( 'disabled', false );

      if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
        oTable.fnDraw();
      } else {
        oTable.fnFilter( '', column_number_filter );
      }
    }

    currentFilterValues = Yadcf.exGetColumnFilterVal( oTable, column_number );

    if ( currentFilterValues.from === '' && currentFilterValues.to === '' ) {
      return;
    }

    const buttonSelector = $( event.target ).prop( 'nodeName' ) === 'BUTTON' ? $( event.target ).parent() : $( event.target ).parent().parent();

    if ( columnObj.datepicker_type === 'daterangepicker' ) {
      $( '#' + `yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' );
    } else {
      buttonSelector.find( '.yadcf-filter-range' ).val( '' );

      if ( buttonSelector.find( '.yadcf-filter-range-number' ).length > 0 ) {
        $( buttonSelector.find( '.yadcf-filter-range' )[0] ).trigger( 'focus' );
      }
    }

    if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
      Yadcf.saveStateSave( oTable, column_number, table_selector_jq_friendly, '', '' );
      oTable.fnDraw();
    } else {
      oTable.fnFilter( '', column_number_filter );
    }

    if ( !oTable.settings()[0].oLoadedState ) {
      oTable.settings()[0].oLoadedState = {};
      oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
    }

    if ( oTable.settings()[0].oFeatures.bStateSave === true ) {
      if ( oTable.settings()[0].oLoadedState.yadcfState !== undefined && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
          from: '',
          to: ''
        };
      } else {
        yadcfState = {};
        yadcfState[ table_selector_jq_friendly ] = [];
        yadcfState[ table_selector_jq_friendly ][ column_number ] = {
          from: '',
          to: ''
        };

        oTable.settings()[0].oLoadedState.yadcfState = yadcfState;
      }

      oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
    }

    Yadcf.resetIApiIndex();

    buttonSelector.parent().find( '.yadcf-filter-range' ).removeClass( 'inuse inuse-exclude' );

    if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      $fromInput = $( `#${fromId}` );
      $toInput = $( `#${toId}` );
      $fromInput.datepicker( 'update' );
      $toInput.datepicker( 'update' );
    } else if ( columnObj.datepicker_type === 'jquery-ui' ) {
      $( `#${fromId}` ).datepicker( 'option', 'maxDate', null );
      $( `#${toId}` ).datepicker( 'option', 'minDate', null );
    }

    return;
  }

  /**
   * @see eventTargetFixUp
   * @see exGetColumnFilterVal
   * @see resetIApiIndex
   *
   * @param table_selector_jq_friendly
   * @param event
   * @returns
   */
  private static rangeNumberSliderClear( table_selector_jq_friendly: string, event: JQuery.KeyPressEvent | JQuery.MouseDownEvent | JQuery.DragOverEvent ): void {
    $.fn.slider = jQuery.ui.slider;

    const oTable = Yadcf.oTables[ table_selector_jq_friendly ];

    let min_val: number,
        max_val: number,
        currentFilterValues: { from: number; to: number; },
        column_number: number;

    event = Yadcf.eventTargetFixUp( event );

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    const buttonSelector = $( event.target ).prop( 'nodeName' ) === 'BUTTON' ? $( event.target ) : $( event.target ).parent();

    column_number = parseInt( buttonSelector.prev().find( '.yadcf-filter-range-number-slider' ).attr( 'id' ).replace( `yadcf-filter-${table_selector_jq_friendly}-slider-`, '' ), 10 );

    min_val = +$( buttonSelector.parent().find( '.yadcf-filter-range-number-slider-min-tip-hidden' ) ).text();
    max_val = +$( buttonSelector.parent().find( '.yadcf-filter-range-number-slider-max-tip-hidden' ) ).text();

    currentFilterValues = Yadcf.exGetColumnFilterVal( oTable, column_number );

    if ( +currentFilterValues.from === min_val && +currentFilterValues.to === max_val ) {
      return;
    }

    buttonSelector.prev().find( '.yadcf-filter-range-number-slider' ).slider( 'option', 'yadcf-reset', true );
    buttonSelector.prev().find( '.yadcf-filter-range-number-slider' ).slider( 'option', 'values', [ min_val, max_val ] );

    $( buttonSelector.prev().find( '.ui-slider-handle' )[0] ).attr( 'tabindex', -1 ).trigger( 'focus' );
    $( buttonSelector.prev().find( '.ui-slider-handle' )[0] ).removeClass( 'inuse' );
    $( buttonSelector.prev().find( '.ui-slider-handle' )[1] ).removeClass( 'inuse' );
    buttonSelector.prev().find( '.ui-slider-range' ).removeClass( 'inuse' );

    oTable.fnDraw();
    Yadcf.resetIApiIndex();

    return;
  }

  /**
   * @see eventTargetFixUp
   * @see getOptions
   * @see resetIApiIndex
   * @see doFilterCustomDateFunc
   *
   * @param table_selector_jq_friendly
   * @param date_format
   * @param event
   */
  private static dateKeyUP( table_selector_jq_friendly: string, date_format: DateFormat, event: any ): void {
    let oTable: DataTableInstance,
        date: Date | string,
        dateId: string,
        column_number: number | string,
        columnObj: AllParameters;

    event = Yadcf.eventTargetFixUp( event );

    dateId = event.target.id;
    date   = (document.getElementById( dateId ) as HTMLInputElement).value;

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    oTable        = Yadcf.oTables[ table_selector_jq_friendly ];
    column_number = parseInt( dateId.replace( 'yadcf-filter-' + table_selector_jq_friendly + '-', '' ), 10 );
    columnObj     = Yadcf.getOptions( oTable.selector )[ column_number ];

    try {
      if ( columnObj.datepicker_type === 'jquery-ui' ) {
        if ( date.length === ( date_format.length + 2 ) ) {
          date = ( date !== '' ) ? $.datepicker.parseDate( date_format, date ) : date;
        }
      }
    } catch ( err1 ) {}

    if ( date instanceof Date || moment( date, columnObj.date_format ).isValid() ) {
      $( `#${dateId}` ).addClass( 'inuse' );

      if ( columnObj.filter_type !== 'date_custom_func' ) {
        oTable.fnFilter( (document.getElementById( dateId ) as HTMLInputElement).value, column_number );
        Yadcf.resetIApiIndex();
      } else {
        Yadcf.doFilterCustomDateFunc( { value: date }, table_selector_jq_friendly, column_number );
      }
    } else if ( date === '' || trim( event.target.value ) === '' ) {
      $( `#${dateId}` ).removeClass( 'inuse' );
      $( '#' + event.target.id ).removeClass( 'inuse' );

      oTable.fnFilter( '', column_number );

      Yadcf.resetIApiIndex();
    }
  }

  /**
   * @see eventTargetFixUp
   * @see getOptions
   * @see getSettingsObjFromTable
   * @see calcColumnNumberFilter
   * @see saveStateSave
   * @see resetIApiIndex
   * @see yadcfDelay
   *
   * @param table_selector_jq_friendly
   * @param date_format
   * @param event
   */
  private static rangeDateKeyUP( table_selector_jq_friendly: string, date_format: DateFormat, event: any ): void {
    let oTable: DataTableInstance,
        min: number | string | Date,
        max: number | string | Date,
        fromId: string,
        toId: string,
        column_number: number,
        columnObj: any,
        keyUp: () => void,
        settingsDt: DataTableSettings,
        column_number_filter: number | string,
        dpg: any,
        minTmp: number | string,
        maxTmp: number | string;

    event = Yadcf.eventTargetFixUp( event );
    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    oTable = Yadcf.oTables[ table_selector_jq_friendly ];

    column_number        = parseInt( $( event.target ).attr( 'id' ).replace( '-from-date-', '' ).replace( '-to-date-', '' ).replace( `yadcf-filter-${table_selector_jq_friendly}`, '' ), 10 );
    columnObj            = Yadcf.getOptions( oTable.selector )[ column_number ];
    settingsDt           = Yadcf.getSettingsObjFromTable( oTable );
    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );

    if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      // @ts-ignore
      dpg = $.fn.datepicker.DPGlobal;
    }

    keyUp = function(): void {
      if ( event.target.id.indexOf( '-from-' ) !== -1 ) {
        fromId = event.target.id;
        toId   = event.target.id.replace( '-from-', '-to-' );
      } else {
        toId   = event.target.id;
        fromId = event.target.id.replace( '-to-', '-from-' );
      }

      min = (document.getElementById( fromId ) as HTMLInputElement).value;
      max = (document.getElementById( toId ) as HTMLInputElement).value;

      if ( columnObj.datepicker_type === 'jquery-ui' ) {
        try {
          if ( min.length === ( date_format.length + 2 ) ) {
            min = ( min !== '' ) ? $.datepicker.parseDate( date_format, min ) : min;
          }
        } catch ( err ) {}

        try {
          if ( max.length === ( date_format.length + 2 ) ) {
            max = ( max !== '' ) ? $.datepicker.parseDate( date_format, max ) : max;
          }
        } catch ( err ) {}
      }
      else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' ) {
        try {
          min = moment( min, columnObj.date_format ).toDate();

          if ( isNaN( (min as Date).getTime() ) ) {
            min = '';
          }
        } catch ( err ) {}

        try {
          max = moment( max, columnObj.date_format ).toDate();

          if ( isNaN( (max as Date).getTime() ) ) {
            max = '';
          }
        } catch ( err ) {}
      }
      else if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
        try {
          min = dpg.parseDate( min, dpg.parseFormat( columnObj.date_format ) );
          if ( isNaN( (min as Date).getTime() ) ) {
            min = '';
          }
        } catch ( err ) {}

        try {
          max = dpg.parseDate( max, dpg.parseFormat( columnObj.date_format ) );
          if ( isNaN( (max as Date).getTime() ) ) {
            max = '';
          }
        } catch ( err ) {}
      }

      if ( ( ( max instanceof Date ) && ( min instanceof Date ) && ( max >= min ) ) || !min || !max ) {
        if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
          minTmp = (document.getElementById( fromId ) as HTMLInputElement).value;
          maxTmp = (document.getElementById( toId ) as HTMLInputElement).value;

          Yadcf.saveStateSave( oTable, column_number, table_selector_jq_friendly, !min ? '' : minTmp, !max ? '' : maxTmp );

          oTable.fnDraw();
        } else {
          oTable.fnFilter( (document.getElementById( fromId ) as HTMLInputElement).value + columnObj.custom_range_delimiter + (document.getElementById( toId ) as HTMLInputElement).value, column_number_filter );
        }

        if ( min instanceof Date ) {
          $( `#${fromId}` ).addClass( 'inuse' );
        } else {
          $( `#${fromId}` ).removeClass( 'inuse' );
        }

        if ( max instanceof Date ) {
          $( `#${toId}` ).addClass( 'inuse' );
        } else {
          $( `#${toId}` ).removeClass( 'inuse' );
        }

        if ( trim( event.target.value ) === '' && $( event.target ).hasClass( 'inuse' ) ) {
          $( '#' + event.target.id ).removeClass( 'inuse' );
        }
      }

      Yadcf.resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      keyUp();
    } else {
      Yadcf.yadcfDelay( function() {
        keyUp();
      }, columnObj.filter_delay );
    }
  }

  /**
   * @see eventTargetFixUp
   * @see getOptions
   * @see resetIApiIndex
   * @see yadcfDelay
   *
   * @param table_selector_jq_friendly
   * @param event
   */
  private static rangeNumberKeyUP( table_selector_jq_friendly: string, event: JQuery.KeyUpEvent ): void {
    const oTable = Yadcf.oTables[ table_selector_jq_friendly ];

    let min,
        max,
        fromId,
        toId,
        yadcfState,
        column_number,
        columnObj,
        keyUp,
        settingsDt,
        column_number_filter,
        exclude_checked = false,
        null_checked = false,
        checkbox;

    event    = Yadcf.eventTargetFixUp( event );
    checkbox = $( event.target ).attr( 'type' ) === 'checkbox';

    const target = checkbox ? $( event.target ).parent().parent().find( '.yadcf-filter-range-number' ).first() : $( event.target );

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    column_number        = parseInt( target.attr( 'id' ).replace( '-from-', '' ).replace( '-to-', '' ).replace( 'yadcf-filter-' + table_selector_jq_friendly, '' ), 10 );
    columnObj            = Yadcf.getOptions( oTable.selector )[ column_number ];
    settingsDt           = Yadcf.getSettingsObjFromTable( oTable );
    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );

    if ( columnObj.exclude ) {
      exclude_checked = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
    }

    // State save when exclude was fired last.
    if ( columnObj.null_check_box ) {
      null_checked = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked' );
    }

    keyUp = function() {
      fromId = `yadcf-filter-${table_selector_jq_friendly}-from-${column_number}`;
      toId   = `yadcf-filter-${table_selector_jq_friendly}-to-${column_number}`;
      min    = (document.getElementById( fromId ) as HTMLInputElement).value;
      max    = (document.getElementById( toId ) as HTMLInputElement).value;

      min = ( min !== '' ) ? ( +min ) : min;
      max = ( max !== '' ) ? ( +max ) : max;

      if ( null_checked ) {
        if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
          oTable.fnDraw();
        } else {
          const excludeString = columnObj.not_null_api_call_value ? columnObj.not_null_api_call_value : '!^@';
          const nullString    = columnObj.null_api_call_value ? columnObj.null_api_call_value : 'null';
          const requestString = exclude_checked ? excludeString : nullString;
          oTable.fnFilter( requestString, column_number_filter );
        }

        return;
      }

      if ( ( !isNaN( max ) && !isNaN( min ) && ( max >= min ) ) || min === '' || max === '' ) {
        if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
          oTable.fnDraw();
        } else {
          const exclude_delimeter = exclude_checked ? '!' : '';
          oTable.fnFilter( exclude_delimeter + min + columnObj.custom_range_delimiter + max, column_number_filter );
        }

        $( `#${fromId}` ).removeClass( 'inuse inuse-exclude' );
        $( `#${toId}` ).removeClass( 'inuse inuse-exclude' );

        const inuse_class = exclude_checked ? 'inuse inuse-exclude' : 'inuse';

        if ( (document.getElementById( fromId ) as HTMLInputElement).value !== '' ) {
          $( `#${fromId}` ).addClass( inuse_class );
        }

        if ( (document.getElementById( toId ) as HTMLInputElement).value !== '' ) {
          $( `#${toId}` ).addClass( inuse_class );
        }

        if ( !oTable.settings()[0].oLoadedState ) {
          oTable.settings()[0].oLoadedState = {};
          oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
        }

        if ( oTable.settings()[0].oFeatures.bStateSave === true ) {
          if ( oTable.settings()[0].oLoadedState.yadcfState !== undefined && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
            oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
              from: min,
              to: max,
              exclude_checked: exclude_checked,
              null_checked: null_checked
            };
          } else {
            yadcfState = {};
            yadcfState[ table_selector_jq_friendly ] = [];
            yadcfState[ table_selector_jq_friendly ][ column_number ] = {
              from: min,
              to: max
            };

            oTable.settings()[0].oLoadedState.yadcfState = yadcfState;
          }

          oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
        }
      }

      Yadcf.resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      keyUp();
    } else {
      Yadcf.yadcfDelay( function() {
        keyUp();
      }, columnObj.filter_delay );
    }
  }

  /**
   * @see getOptions
   * @see eventTargetFixUp
   * @see yadcfDelay
   *
   * @param tablesSelectors
   * @param event
   * @param column_number_str
   * @param clear
   */
  private static textKeyUpMultiTables( tablesSelectors: string, event: any, column_number_str: string, clear?: string ): void {
    let caseInsen   = true,
        smart       = true,
        regex       = false,
        columnsObj  = Yadcf.getOptions( `${tablesSelectors}_${column_number_str}` )[ column_number_str ],
        tablesArray = Yadcf.oTables[ tablesSelectors ],
        keyUp: ( ...args: any ) => void,
        serachVal: any,
        tablesAsOne: any;

    event       = Yadcf.eventTargetFixUp( event );
    tablesAsOne = new $.fn.dataTable.Api( tablesArray );

    keyUp = function( tablesAsOne: DataTables.Api, event: JQuery.KeyUpEvent, clear?: boolean ): void {
      if ( clear !== undefined || event.target.value === '' ) {
        if ( clear !== undefined ) {
          $( event.target ).prev().val( '' ).trigger( 'focus' );
          $( event.target ).prev().removeClass( 'inuse' );
        } else {
          $( event.target ).val( '' ).trigger( 'focus' );
          $( event.target ).removeClass( 'inuse' );
        }

        if ( columnsObj.column_number instanceof Array ) {
          tablesAsOne.columns( columnsObj.column_number ).search( '' ).draw();
        } else {
          tablesAsOne.search( '' ).draw();
        }

        return;
      }

      $( event.target ).addClass( 'inuse' );

      serachVal = event.target.value;
      smart     = false;
      caseInsen = columnsObj.case_insensitive;
      /*
      if (columnsObj.filter_match_mode === 'contains') {
        regex = false;
      } else if (columnsObj.filter_match_mode === 'exact') {
        regex = true;
        serachVal = '^' + serachVal + '$';
      } else if (columnsObj.filter_match_mode === 'startsWith') {
        regex = true;
        serachVal = '^' + serachVal;
      }
      */
      if ( columnsObj.column_number instanceof Array ) {
        tablesAsOne.columns( columnsObj.column_number ).search( serachVal, regex, smart, caseInsen ).draw();
      } else {
        tablesAsOne.search( serachVal, regex, smart, caseInsen ).draw();
      }
    };

    if ( columnsObj.filter_delay === undefined ) {
      keyUp( tablesAsOne, event, clear );
    } else {
      Yadcf.yadcfDelay( function() {
        keyUp( tablesAsOne, event, clear );
      }, columnsObj.filter_delay );
    }
  }

  /**
   * @see getSettingsObjFromTable
   * @see calcColumnNumberFilter
   * @see getOptions
   * @see resetExcludeRegexCheckboxes
   * @see clearStateSave
   * @see exGetColumnFilterVal
   * @see saveTextKeyUpState
   * @see resetIApiIndex
   * @see yadcfDelay
   *
   * @param ev
   * @param table_selector_jq_friendly
   * @param column_number
   * @param clear
   * @returns
   */
  private static textKeyUP( ev: any, table_selector_jq_friendly: string, column_number: number | string, clear?: string ): void {
    const oTable       = Yadcf.oTables[ table_selector_jq_friendly ],
          settingsDt   = Yadcf.getSettingsObjFromTable( oTable );

    let null_checked = false,
        keyCodes     = [ 37, 38, 39, 40, 17 ],
        keyUp,
        columnObj,
        exclude,
        column_number_filter,
        regex_check_box;

    if ( keyCodes.indexOf( ev.keyCode ) !== -1 || Yadcf.ctrlPressed ) {
      return;
    }

    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );

    columnObj = Yadcf.getOptions( oTable.selector )[ column_number ];

    keyUp = function( table_selector_jq_friendly: string, column_number: number | string, clear?: string ): void {
      let fixedPrefix = '';

      if ( (settingsDt as DataTableSettings).fixedHeader !== undefined && $( '.fixedHeader-floating' ).is( ':visible' ) ) {
        fixedPrefix = '.fixedHeader-floating ';
      }

      if ( columnObj.filters_position === 'tfoot' && settingsDt.nScrollFoot ) {
        fixedPrefix = '.' + (settingsDt.nScrollFoot as HTMLElement).className + ' ';
      }

      $.extend( $.fn, { dataTable: { ext: { iApiIndex: Yadcf.oTablesIndex[ table_selector_jq_friendly ] } } } );

      // Check checkboxes.
      if ( columnObj.null_check_box === true ) {
        null_checked = $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).closest( '.yadcf-filter-wrapper' ).find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked' );
      }

      if ( columnObj.exclude === true ) {
        exclude = $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).closest( '.yadcf-filter-wrapper' ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
      }

      if ( columnObj.regex_check_box === true ) {
        regex_check_box = $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).closest( '.yadcf-filter-wrapper' ).find( '.yadcf-regex-wrapper :checkbox' ).prop( 'checked' );
      }

      if ( clear === 'clear' || $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val() === '' ) {
        if ( clear === 'clear' ) {
          // Uncheck checkboxes on reset button pressed.
          Yadcf.resetExcludeRegexCheckboxes( $( fixedPrefix + `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ) );

          Yadcf.clearStateSave( oTable, column_number, table_selector_jq_friendly );

          $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).prop( 'disabled', false );

          if ( columnObj.null_check_box ) {
            if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
              oTable.fnDraw();
            } else {
              oTable.fnFilter( '', column_number_filter );
            }
          }

          if ( Yadcf.exGetColumnFilterVal( oTable, column_number ) === '' ) {
            return;
          }
        }

        if ( null_checked && columnObj.exclude ) {
          if ( oTable.settings()[0].oFeatures.bServerSide === true ) {
            if ( exclude ) {
              columnObj.not_null_api_call_value = columnObj.not_null_api_call_value ? columnObj.not_null_api_call_value : '!^@';
              oTable.fnFilter( columnObj.not_null_api_call_value, column_number_filter );
            } else {
              columnObj.null_api_call_value = columnObj.null_api_call_value ? columnObj.null_api_call_value : 'null';
              oTable.fnFilter( columnObj.null_api_call_value, column_number_filter );
            }
          } else {
            oTable.fnDraw();
          }

          Yadcf.saveTextKeyUpState( oTable, table_selector_jq_friendly, column_number, regex_check_box, null_checked, exclude );

          return;
        }

        $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' ).trigger( 'focus' );
        $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse inuse-exclude inuse-regex' );

        oTable.fnFilter( '', column_number_filter );

        Yadcf.resetIApiIndex();

        return;
      }

      // Delete class also on regex or exclude checkbox uncheck.
      $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse-exclude inuse-regex' );

      let inuseClass = 'inuse';
          inuseClass = exclude ? inuseClass + ' inuse-exclude' : inuseClass;
          inuseClass = regex_check_box ? inuseClass + ' inuse-regex' : inuseClass;

      $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( inuseClass );

      Yadcf.yadcfMatchFilter( oTable, $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val(), regex_check_box ? 'regex' : columnObj.filter_match_mode, column_number_filter, exclude, column_number );

      // save regex_checkbox state
      Yadcf.saveTextKeyUpState( oTable, table_selector_jq_friendly, column_number, regex_check_box, null_checked, exclude );
      Yadcf.resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      keyUp( table_selector_jq_friendly, column_number, clear );
    } else {
      Yadcf.yadcfDelay( function() {
        keyUp( table_selector_jq_friendly, column_number, clear );
      }, columnObj.filter_delay );
    }
  }

  /**
   * @see eventTargetFixUp
   * @see resetIApiIndex
   *
   * @param table_selector_jq_friendly
   * @param event
   * @returns
   */
  private static autocompleteKeyUP( table_selector_jq_friendly: string, event: any ) {
    const keyCodes = [ 37, 38, 39, 40 ];

    let oTable: DataTableInstance,
        column_number: number;

    event = Yadcf.eventTargetFixUp( event );

    if ( keyCodes.indexOf( event.keyCode ) !== -1 ) {
      return;
    }

    if ( (event.target as HTMLInputElement).value === '' && event.keyCode === 8 && $( event.target ).hasClass( 'inuse' ) ) {
      $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

      oTable        = Yadcf.oTables[ table_selector_jq_friendly ];
      column_number = parseInt( $( event.target ).attr( 'id' ).replace( 'yadcf-filter-' + table_selector_jq_friendly + '-', '' ), 10 );

      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
      $( document ).removeData( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val` );

      oTable.fnFilter( '', column_number );

      Yadcf.resetIApiIndex();
    }
  }

  /**
   * @see getSettingsObjFromTable
   * @see calcColumnNumberFilter
   * @see getOptions
   * @see resetIApiIndex
   * @see yadcfDelay
   *
   * @param ev
   * @param table_selector_jq_friendly
   * @param column_number
   */
  private static nullChecked( ev: JQuery.Event, table_selector_jq_friendly: string, column_number: number | string ): void {
    const oTable = Yadcf.oTables[ table_selector_jq_friendly ];

    let settingsDt      = Yadcf.getSettingsObjFromTable( oTable ),
        exclude_checked = false,
        column_number_filter,
        click,
        columnObj,
        yadcfState,
        null_checked;

    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );
    columnObj            = Yadcf.getOptions( oTable.selector )[ column_number ];

    let fixedPrefix = '';

    if ( (settingsDt as DataTableSettings).fixedHeader !== undefined && $( '.fixedHeader-floating' ).is( ':visible' ) ) {
      fixedPrefix = '.fixedHeader-floating ';
    }

    if ( columnObj.filters_position === 'tfoot' && settingsDt.nScrollFoot ) {
      fixedPrefix = '.' + (settingsDt.nScrollFoot as HTMLElement).className + ' ';
    }

    null_checked = $( fixedPrefix + `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked' );

    if ( columnObj.exclude ) {
      exclude_checked = $( fixedPrefix + `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
    }

    click = function( table_selector_jq_friendly: string, column_number: number | string ) {
      // Remove input data and inuse classes.
      const inner       = columnObj.filter_type === 'range_number' ? 'wrapper-inner-' : '';
      const inner_input = columnObj.filter_type === 'range_number' ? ' :input' : '';
      const input       = $( '#yadcf-filter-' + inner + table_selector_jq_friendly + '-' + column_number + inner_input );

      input.removeClass( 'inuse inuse-exclude inuse-regex' );

      if ( columnObj.filter_type === 'text' ) {
        $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' ).trigger( 'focus' );

        if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
          oTable.fnFilter( '', column_number_filter );
        }
      }

      if ( columnObj.filter_type === 'range_number' ) {
        input.val( '' );

        if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
          oTable.fnDraw();
        }
      }

      // Disable inputs.
      if ( !null_checked ) {
        input.prop( 'disabled', false );
      } else {
        input.prop( 'disabled', true );
      }

      // Filter by null.
      if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
        oTable.fnDraw();
      } else {
        if ( null_checked ) {
          if ( !exclude_checked ) {
            columnObj.null_api_call_value = columnObj.null_api_call_value ? columnObj.null_api_call_value : 'null';
            oTable.fnFilter( columnObj.null_api_call_value, column_number_filter );
          } else {
            columnObj.not_null_api_call_value = columnObj.not_null_api_call_value ? columnObj.not_null_api_call_value : '!^@';
            oTable.fnFilter( columnObj.not_null_api_call_value, column_number_filter );
          }
        } else {
          oTable.fnFilter( '', column_number_filter );
        }
      }

      // Save `regex_checkbox` state.
      if ( oTable.settings()[0].oFeatures.bStateSave === true ) {
        if ( oTable.settings()[0].oLoadedState ) {
          if ( oTable.settings()[0].oLoadedState.yadcfState !== undefined && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
            oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
              null_checked: null_checked,
              exclude_checked: exclude_checked
            };
          } else {
            yadcfState = {};
            yadcfState[ table_selector_jq_friendly ] = [];
            yadcfState[ table_selector_jq_friendly ][ column_number ] = {
              null_checked: null_checked,
              exclude_checked: exclude_checked
            };

            oTable.settings()[0].oLoadedState.yadcfState = yadcfState;
          }
        }

        oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
      }

      Yadcf.resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      click( table_selector_jq_friendly, column_number );
    } else {
      Yadcf.yadcfDelay( function() {
        click( table_selector_jq_friendly, column_number );
      }, columnObj.filter_delay );
    }
  }

  /**
   * @see columnsArrayToString
   * @see getSettingsObjFromTable
   * @see setOptions
   * @see appendFiltersMultipleTables
   *
   *
   * @param tablesArray
   * @param filtersOptions
   */
  private static initMultipleTables( tablesArray: Array<DataTableInstance>, filtersOptions: Array<AllParameters<FilterTypeMulti>> ) {
    let i: number,
        tablesSelectors: string = '',
        default_options: MultiParams = {
          filter_type: 'text',
          filter_container_id: '',
          filter_reset_button_text: 'x',
          case_insensitive: true
        },
        columnsObj: AllParameters,
        columnsArrIndex: number,
        column_number_str: AllParameters['column_number_str'],
        dummyArr: Array<any>;

    for ( columnsArrIndex = 0; columnsArrIndex < filtersOptions.length; columnsArrIndex++ ) {
      dummyArr = [];

      columnsObj = filtersOptions[ columnsArrIndex ];

      if ( columnsObj.filter_default_label === undefined ) {
        if ( columnsObj.filter_type === 'select' || columnsObj.filter_type === 'custom_func' ) {
          columnsObj.filter_default_label = 'Select value';
        } else if ( columnsObj.filter_type === 'multi_select' || columnsObj.filter_type === 'multi_select_custom_func' ) {
          columnsObj.filter_default_label = 'Select values';
        } else if ( columnsObj.filter_type === 'auto_complete' || columnsObj.filter_type === 'text' ) {
          columnsObj.filter_default_label = 'Type to filter';
        } else if ( columnsObj.filter_type === 'range_number' || columnsObj.filter_type === 'range_date' ) {
          columnsObj.filter_default_label = [ 'from', 'to' ];
        } else if ( columnsObj.filter_type === 'date' ) {
          columnsObj.filter_default_label = 'Select a date';
        }
      }

      columnsObj = $.extend( {}, default_options, columnsObj );

      column_number_str = Yadcf.columnsArrayToString( columnsObj.column_number ).column_number_str;

      columnsObj.column_number_str = column_number_str;

      dummyArr.push( columnsObj );

      tablesSelectors = '';

      for ( i = 0; i < tablesArray.length; i++ ) {
        if ( tablesArray[ i ].table !== undefined ) {
          tablesSelectors += (tablesArray[ i ].table().node() as HTMLElement).id + ',';
        } else {
          tablesSelectors += Yadcf.getSettingsObjFromTable( tablesArray[ i ] ).sTableId;
        }
      }

      tablesSelectors = tablesSelectors.substring( 0, tablesSelectors.length - 1 );

      Yadcf.setOptions( tablesSelectors + '_' + column_number_str, dummyArr, {});

      // @ts-ignore
      Yadcf.oTables[ tablesSelectors ] = tablesArray;

      Yadcf.appendFiltersMultipleTables( tablesArray, tablesSelectors, columnsObj );
    }
  }

  /**
   * @see initMultipleTables
   */
  private static initMultipleColumns( table: DataTableInstance, filtersOptions: Array<AllParameters<FilterTypeMulti>> ) {
    let tablesArray: Array<DataTable<any>> = [];

    tablesArray.push( table );

    Yadcf.initMultipleTables( tablesArray, filtersOptions );
  }

  /**
   * @see close3rdPPluginsNeededClose
   *
   * @param evt
   */
  private static stopPropagation( evt: any ) {
    Yadcf.close3rdPPluginsNeededClose( evt );

    if ( evt.stopPropagation !== undefined ) {
      evt.stopPropagation();
    } else {
      evt.cancelable = true;
    }
  }

  /**
   * @see ctrlPressed
   *
   * @param evt
   * @returns
   */
  private static preventDefaultForEnter( evt: any ): void {
    Yadcf.ctrlPressed = false;

    if ( evt.keyCode === 13 ) {
      if ( evt.preventDefault ) {
        evt.preventDefault();
      } else {
        evt.returnValue = false;
      }
    }

    if ( evt.keyCode == 65 && evt.ctrlKey ) {
      Yadcf.ctrlPressed = true;

      evt.target.select();

      return;
    }

    if ( evt.ctrlKey && ( evt.keyCode == 67 || evt.keyCode == 88 ) ) {
      Yadcf.ctrlPressed = true;

      return;
    }
  }

  /**
   * @see generateTableSelectorJQFriendly2
   * @see isDOMSource
   * @see getOptions
   * @see yadcfMatchFilterString
   * @see refreshSelectPlugin
   * @see saveStateSave
   * @see exInternalFilterColumnAJAXQueue
   *
   * @param table_arg
   * @param col_filter_arr
   * @param ajaxSource
   */
  private static exFilterColumn( table_arg: DataTableInstance, col_filter_arr: Array<ExFilterColArgs>, ajaxSource: boolean = true ) {
    $.fn.slider = jQuery.ui.slider;

    let table_selector_jq_friendly: string,
        j: number,
        tmpStr: string,
        column_number: number | string,
        column_position: number,
        filter_value: any,
        fromId: string,
        toId: string,
        sliderId: string,
        optionsObj: AllParameters<FilterType>,
        min: number | string,
        max: number | string,
        exclude: boolean = false;

    // Check if the table arg is from new datatables API (capital 'D').
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[0].oInstance;
    }

    table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2( table_arg );

    if ( Yadcf.isDOMSource( table_arg ) || ajaxSource === true ) {
      for ( j = 0; j < col_filter_arr.length; j++ ) {
        column_number   = col_filter_arr[ j ][0];
        column_position = column_number;
        exclude         = false;

        if (
          Yadcf.plugins[ table_selector_jq_friendly ] !== undefined &&
          (
            Yadcf.plugins[ table_selector_jq_friendly ] !== undefined &&
            Yadcf.plugins[ table_selector_jq_friendly ].ColReorder !== undefined
          )
        ) {
          column_position = Yadcf.plugins[ table_selector_jq_friendly ].ColReorder[ column_number ];
        }

        optionsObj = Yadcf.getOptions( table_arg.selector )[ column_number ];

        filter_value = col_filter_arr[ j ][1];

        switch ( optionsObj.filter_type ) {
          case 'auto_complete':
          case 'text':
          case 'date':
            if ( filter_value !== undefined && filter_value.indexOf( '_exclude_' ) !== -1 ) {
              exclude = true;
              filter_value = filter_value.replace( '_exclude_', '' );
            }

            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( filter_value );

            if ( filter_value !== '' ) {
              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );
            } else {
              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
            }

            tmpStr = Yadcf.yadcfMatchFilterString( table_arg, column_position, filter_value, optionsObj.filter_match_mode, false, exclude );

            table_arg.settings()[0].aoPreSearchCols[ column_position ].sSearch = tmpStr;
            break;

          case 'select':
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( filter_value );

            if ( filter_value !== '' ) {
              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );
            } else {
              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
            }

            tmpStr = Yadcf.yadcfMatchFilterString( table_arg, column_position, filter_value, optionsObj.filter_match_mode, false );

            table_arg.settings()[0].aoPreSearchCols[ column_position ].sSearch = tmpStr;

            if ( optionsObj.select_type !== undefined ) {
              Yadcf.refreshSelectPlugin( optionsObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), filter_value );
            }
            break;

          case 'multi_select':
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( filter_value );

            tmpStr = Yadcf.yadcfMatchFilterString( table_arg, column_position, filter_value, optionsObj.filter_match_mode, true );

            table_arg.settings()[0].aoPreSearchCols[ column_position ].sSearch = tmpStr;

            if ( optionsObj.select_type !== undefined ) {
              Yadcf.refreshSelectPlugin( optionsObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), filter_value );
            }
            break;

          case 'range_date':
            fromId = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`;
            toId   = `yadcf-filter-${table_selector_jq_friendly}-to-date-${column_number}`;

            $( `#${fromId}` ).val( filter_value.from );

            if ( filter_value.from !== '' ) {
              $( `#${fromId}` ).addClass( 'inuse' );
            } else {
              $( `#${fromId}` ).removeClass( 'inuse' );
            }

            $( `#${toId}` ).val( filter_value.to );

            if ( filter_value.to !== '' ) {
              $( `#${toId}` ).addClass( 'inuse' );
            } else {
              $( `#${toId}` ).removeClass( 'inuse' );
            }

            if ( table_arg.settings()[0].oFeatures.bServerSide === true ) {
              min = filter_value.from;
              max = filter_value.to;
              table_arg.settings()[0].aoPreSearchCols[ column_position ].sSearch = min + optionsObj.custom_range_delimiter + max;
            }

            Yadcf.saveStateSave( table_arg, column_number, table_selector_jq_friendly, filter_value.from, filter_value.to );
            break;

          case 'range_number':
            fromId = `yadcf-filter-${table_selector_jq_friendly}-from-${column_number}`;
            toId   = `yadcf-filter-${table_selector_jq_friendly}-to-${column_number}`;

            $( `#${fromId}` ).val( filter_value.from );

            if ( filter_value.from !== '' ) {
              $( `#${fromId}` ).addClass( 'inuse' );
            } else {
              $( `#${fromId}` ).removeClass( 'inuse' );
            }

            $( `#${toId}` ).val( filter_value.to );

            if ( filter_value.to !== '' ) {
              $( `#${toId}` ).addClass( 'inuse' );
            } else {
              $( `#${toId}` ).removeClass( 'inuse' );
            }

            if ( table_arg.settings()[0].oFeatures.bServerSide === true ) {
              table_arg.settings()[0].aoPreSearchCols[ column_position ].sSearch = filter_value.from + optionsObj.custom_range_delimiter + filter_value.to;
            }

            Yadcf.saveStateSave( table_arg, column_number, table_selector_jq_friendly, filter_value.from, filter_value.to );
            break;

          case 'range_number_slider':
            sliderId = `yadcf-filter-${table_selector_jq_friendly}-slider-${column_number}`;
            fromId = `yadcf-filter-${table_selector_jq_friendly}-min_tip-${column_number}`;
            toId = `yadcf-filter-${table_selector_jq_friendly}-max_tip-${column_number}`;

            if ( filter_value.from !== '' ) {
              min = $( `#${fromId}` ).closest( '.yadcf-filter-range-number-slider' ).find( '.yadcf-filter-range-number-slider-min-tip-hidden' ).text();

              max = $( `#${fromId}` ).closest( '.yadcf-filter-range-number-slider' ).find( '.yadcf-filter-range-number-slider-max-tip-hidden' ).text();

              $( `#${fromId}` ).text( filter_value.from );

              if ( min !== filter_value.from ) {
                $( `#${fromId}` ).parent().addClass( 'inuse' );
                $( `#${fromId}` ).parent().parent().find( 'ui-slider-range' ).addClass( 'inuse' );
              } else {
                $( `#${fromId}` ).parent().removeClass( 'inuse' );
                $( `#${fromId}` ).parent().parent().find( 'ui-slider-range' ).removeClass( 'inuse' );
              }

              $( `#${sliderId}` ).slider( 'values', 0, filter_value.from );
            }

            if ( filter_value.to !== '' ) {
              $( `#${toId}` ).text( filter_value.to );

              if ( max !== filter_value.to ) {
                $( `#${toId}` ).parent().addClass( 'inuse' );
                $( `#${toId}` ).parent().parent().find( '.ui-slider-range' ).addClass( 'inuse' );
              } else {
                $( `#${toId}` ).parent().removeClass( 'inuse' );
                $( `#${toId}` ).parent().parent().find( '.ui-slider-range' ).removeClass( 'inuse' );
              }

              $( `#${sliderId}` ).slider( 'values', 1, filter_value.to );
            }

            if ( table_arg.settings()[0].oFeatures.bServerSide === true ) {
              table_arg.settings()[0].aoPreSearchCols[ column_position ].sSearch = filter_value.from + optionsObj.custom_range_delimiter + filter_value.to;
            }

            Yadcf.saveStateSave( table_arg, column_number, table_selector_jq_friendly, filter_value.from, filter_value.to );
            break;

          case 'custom_func':
          case 'multi_select_custom_func':
          case 'date_custom_func':
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( filter_value );

            if ( filter_value !== '' ) {
              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );
            } else {
              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
            }

            if ( table_arg.settings()[0].oFeatures.bServerSide === true ) {
              table_arg.settings()[0].aoPreSearchCols[ column_position ].sSearch = filter_value;
            }

            if ( optionsObj.select_type !== undefined ) {
              Yadcf.refreshSelectPlugin( optionsObj, `#yadcf-filter-${table_selector_jq_friendly}-${column_number}`, filter_value );
            }

            Yadcf.saveStateSave( table_arg, column_number, table_selector_jq_friendly, filter_value, '' );
            break;
        }
      }

      if ( table_arg.settings()[0].oFeatures.bServerSide !== true ) {
        table_arg.fnDraw();
      } else {
        setTimeout( function() {
          table_arg.fnDraw();
        }, 10 );
      }
    } else {
      Yadcf.exFilterColumnQueue.push( Yadcf.exInternalFilterColumnAJAXQueue( table_arg, col_filter_arr ) );
    }
  }

  /**
   * @see getOptions
   * @see generateTableSelectorJQFriendly2
   * @see getSettingsObjFromTable
   *
   * @param table_arg
   * @param column_number
   * @returns
   */
  private static exGetColumnFilterVal( table_arg: DataTableInstance & DataTables.SettingsLegacy, column_number: number | string ) {
    let retVal: any,
        fromId: string,
        toId: string,
        table_selector_jq_friendly: string,
        optionsObj: AllParameters<FilterType>,
        $filterElement: JQuery | globalThis.JQuery;

    // Check if the table arg is from new datatables API (capital 'D').
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[0].oInstance;
    }

    optionsObj = Yadcf.getOptions( table_arg.selector )[ column_number ];

    table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2( table_arg );

    let selectorePrefix = '';
    let settingsDt      = Yadcf.getSettingsObjFromTable( table_arg );

    if ( optionsObj.filters_position === 'tfoot' && settingsDt.oScroll.sX ) {
      selectorePrefix = '.dataTables_scrollFoot ';
    }

    $filterElement = $( selectorePrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` );

    switch ( optionsObj.filter_type ) {
      case 'select':
      case 'custom_func':
        retVal = $filterElement.val();

        if ( retVal === '-1' ) {
          retVal = '';
        }
        break;

      case 'auto_complete':
      case 'text':
      case 'date':
      case 'date_custom_func':
        retVal = $filterElement.val();

        if ( $filterElement.prev().hasClass( 'yadcf-exclude-wrapper' ) && $filterElement.prev().find( 'input' ).prop( 'checked' ) === true ) {
          retVal = '_exclude_' + retVal;
        }
        break;

        case 'multi_select':
      case 'multi_select_custom_func':
        retVal = $filterElement.val();

        if ( retVal === null ) {
          retVal = '';
        }
        break;

        case 'range_date':
        retVal = {};
        fromId = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`;
        toId   = `yadcf-filter-${table_selector_jq_friendly}-to-date-${column_number}`;

        retVal.from = $( selectorePrefix + `#${fromId}` ).val();
        retVal.to   = $( selectorePrefix + `#${toId}` ).val();
        break;

        case 'range_number':
        retVal = {};
        fromId = `yadcf-filter-${table_selector_jq_friendly}-from-${column_number}`;
        toId   = `yadcf-filter-${table_selector_jq_friendly}-to-${column_number}`;

        retVal.from = $( selectorePrefix + `#${fromId}` ).val();
        retVal.to = $( selectorePrefix + `#${toId}` ).val();
        break;

      case 'range_number_slider':
        retVal = {};
        fromId = `yadcf-filter-${table_selector_jq_friendly}-min_tip-${column_number}`;
        toId   = `yadcf-filter-${table_selector_jq_friendly}-max_tip-${column_number}`;

        retVal.from = $( selectorePrefix + `#${fromId}` ).text();
        retVal.to   = $( selectorePrefix + `#${toId}` ).text();
        break;

        default:
        console.log( 'exGetColumnFilterVal error: no such filter_type: ' + optionsObj.filter_type );
    }
    return retVal;
  }

  /**
   * @see getOptions
   * @see generateTableSelectorJQFriendly2
   * @see getSettingsObjFromTable
   * @see resetExcludeRegexCheckboxes
   * @see clearStateSave
   * @see refreshSelectPlugin
   *
   * @param table_arg
   * @param noRedraw
   * @param columns
   */
  private static exResetAllFilters( table_arg: DataTableInstance, noRedraw: boolean, columns: Array<number | string> ): void {
    $.fn.slider = jQuery.ui.slider;

    let table_selector_jq_friendly: string,
        column_number: number,
        fromId: string,
        toId: string,
        sliderId: string,
        tableOptions: TableParameters,
        optionsObj: AllParameters<FilterType>,
        columnObjKey: string,
        settingsDt: DataTableSettings,
        i: number,
        $filterElement: JQuery | globalThis.JQuery;

    // Check if the table arg is from new datatables API (capital 'D').
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[0].oInstance;
    }

    tableOptions               = Yadcf.getOptions( table_arg.selector );
    table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2( table_arg );
    settingsDt                 = Yadcf.getSettingsObjFromTable( table_arg );

    for ( columnObjKey in tableOptions ) {
      if ( tableOptions.hasOwnProperty( columnObjKey ) ) {
        optionsObj    = tableOptions[ columnObjKey ];
        column_number = optionsObj.column_number;

        if ( columns !== undefined && $.inArray( column_number, columns ) === -1 ) {
          continue;
        }

        $( document ).removeData( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val` );

        let selectorePrefix = '';

        if ( optionsObj.filters_position === 'tfoot' && settingsDt.oScroll.sX ) {
          selectorePrefix = '.dataTables_scrollFoot ';
        }

        $filterElement = $( selectorePrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` );

        switch ( optionsObj.filter_type ) {
          case 'select':
          case 'custom_func':
            Yadcf.resetExcludeRegexCheckboxes( $filterElement.parent() );

            Yadcf.clearStateSave( table_arg, column_number, table_selector_jq_friendly );

            $filterElement.val( '-1' ).removeClass( 'inuse' );

            table_arg.settings()[0].aoPreSearchCols[ column_number ].sSearch = '';

            if ( optionsObj.select_type !== undefined ) {
              Yadcf.refreshSelectPlugin( optionsObj, $filterElement, '-1' );
            }
            break;

          case 'auto_complete':
          case 'text':
            $filterElement.prop( 'disabled', false );

            $filterElement.val( '' ).removeClass( 'inuse inuse-exclude inuse-regex' );

            table_arg.settings()[0].aoPreSearchCols[ column_number ].sSearch = '';

            Yadcf.resetExcludeRegexCheckboxes( $filterElement.parent() );

            Yadcf.clearStateSave( table_arg, column_number, table_selector_jq_friendly );
            break;

          case 'date':
            $filterElement.val( '' ).removeClass( 'inuse' );

            table_arg.settings()[0].aoPreSearchCols[ column_number ].sSearch = '';

            if ( $filterElement.prev().hasClass( 'yadcf-exclude-wrapper' ) ) {
              $filterElement.prev().find( 'input' ).prop( 'checked', false );
            }
            break;

          case 'multi_select':
          case 'multi_select_custom_func':
            $filterElement.val( '-1' );

            $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val`, undefined );

            table_arg.settings()[0].aoPreSearchCols[ column_number ].sSearch = '';

            if ( optionsObj.select_type !== undefined ) {
              Yadcf.refreshSelectPlugin( optionsObj, $filterElement, '-1' );
            }
            break;

          case 'range_date':
            fromId = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`;
            toId = `yadcf-filter-${table_selector_jq_friendly}-to-date-${column_number}`;
            $( selectorePrefix + `#${fromId}` ).val( '' );
            $( selectorePrefix + `#${fromId}` ).removeClass( 'inuse' );
            $( selectorePrefix + `#${toId}` ).val( '' );
            $( selectorePrefix + `#${toId}` ).removeClass( 'inuse' );

            if ( table_arg.settings()[0].oFeatures.bServerSide === true ) {
              table_arg.settings()[0].aoPreSearchCols[ column_number ].sSearch = '';
            }

            Yadcf.clearStateSave( table_arg, column_number, table_selector_jq_friendly );
            break;

          case 'range_number':
            fromId = `yadcf-filter-${table_selector_jq_friendly}-from-${column_number}`;
            toId = `yadcf-filter-${table_selector_jq_friendly}-to-${column_number}`;
            $( selectorePrefix + `#${fromId}` ).prop( 'disabled', false );
            $( selectorePrefix + `#${fromId}` ).val( '' );
            $( selectorePrefix + `#${fromId}` ).removeClass( 'inuse inuse-exclude' );
            $( selectorePrefix + `#${toId}` ).prop( 'disabled', false );
            $( selectorePrefix + `#${toId}` ).val( '' );
            $( selectorePrefix + `#${toId}` ).removeClass( 'inuse inuse-exclude' );

            if ( table_arg.settings()[0].oFeatures.bServerSide === true ) {
              table_arg.settings()[0].aoPreSearchCols[ column_number ].sSearch = '';
            }

            Yadcf.resetExcludeRegexCheckboxes( $( selectorePrefix + `#${fromId}` ).parent().parent() );
            Yadcf.clearStateSave( table_arg, column_number, table_selector_jq_friendly );
            break;

          case 'range_number_slider':
            sliderId = `yadcf-filter-${table_selector_jq_friendly}-slider-${column_number}`;
            fromId = `yadcf-filter-${table_selector_jq_friendly}-min_tip-${column_number}`;
            toId = `yadcf-filter-${table_selector_jq_friendly}-max_tip-${column_number}`;
            $( selectorePrefix + `#${fromId}` ).text( '' );
            $( selectorePrefix + `#${fromId}` ).parent().removeClass( 'inuse' );
            $( selectorePrefix + `#${fromId}` ).parent().parent().find( 'ui-slider-range' ).removeClass( 'inuse' );
            $( selectorePrefix + `#${toId}` ).text( '' );
            $( selectorePrefix + `#${toId}` ).parent().removeClass( 'inuse' );
            $( selectorePrefix + `#${toId}` ).parent().parent().find( '.ui-slider-range' ).removeClass( 'inuse' );
            $( selectorePrefix + `#${sliderId}` ).slider( 'option', 'values', [ $( `#${fromId}` ).parent().parent().find( '.yadcf-filter-range-number-slider-min-tip-hidden' ).text(), $( `#${fromId}` ).parent().parent().find( '.yadcf-filter-range-number-slider-max-tip-hidden' ).text() ] );

            if ( table_arg.settings()[0].oFeatures.bServerSide === true ) {
              table_arg.settings()[0].aoPreSearchCols[ column_number ].sSearch = '';
            }

            Yadcf.clearStateSave( table_arg, column_number, table_selector_jq_friendly );
            break;
        }
      }
    }

    if ( noRedraw !== true ) {
      // Clear global filter.
      settingsDt.oPreviousSearch.sSearch = '';

      if ( typeof settingsDt.aanFeatures.f !== 'undefined' ) {
        for ( i = 0; i < settingsDt.aanFeatures.f.length; i++ ) {
          $( 'input', settingsDt.aanFeatures.f[ i ] as unknown as Node ).val( '' );
        }
      }

      // End of clear global filter.
      table_arg.fnDraw( settingsDt );
    }
  }

  /**
   * @see exResetAllFilters
   *
   * @param table_arg
   * @param columns
   * @param noRedraw
   */
  private static exResetFilters( table_arg: DataTableInstance, columns: Array<number | string>, noRedraw: boolean ): void {
    Yadcf.exResetAllFilters( table_arg, noRedraw, columns );
  }

  /**
   * @see getOptions
   * @see exGetColumnFilterVal
   * @see exFilterColumn
   *
   * @param table_arg
   */
  private static exFilterExternallyTriggered( table_arg: DataTableInstance ) {
    let columnsObj: AllParameters,
        columnObjKey: string,
        columnObj: AllParameters,
        filterValue: any,
        filtersValuesSingleElem: any,
        filtersValuesArr = [];

    // Check if the table arg is from new datatables API (capital 'D').
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[0].oInstance;
    }

    columnsObj = Yadcf.getOptions( table_arg.selector );

    for ( columnObjKey in columnsObj ) {
      if ( columnsObj.hasOwnProperty( columnObjKey ) ) {
        columnObj = columnsObj[ columnObjKey ];
        filterValue = Yadcf.exGetColumnFilterVal( table_arg, columnObj.column_number );
        filtersValuesSingleElem = [];
        filtersValuesSingleElem.push( columnObj.column_number );
        filtersValuesSingleElem.push( filterValue );
        filtersValuesArr.push( filtersValuesSingleElem );
      }
    }

    Yadcf.exFilterColumn( table_arg, filtersValuesArr, true );
  }

  /**
   * @see getOptions
   * @see generateTableSelectorJQFriendly2
   * @see refreshSelectPlugin
   *
   * @param table_arg
   * @param col_num
   * @param updatedData
   */
  private static exRefreshColumnFilterWithDataProp( table_arg: DataTableInstance, col_num: number, updatedData: Record<string, any> ): void {
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[0].oInstance;
    }

    const columnsObj = Yadcf.getOptions( table_arg.selector );
    const columnObj  = columnsObj[ col_num ];

    columnObj.data = updatedData;

    const table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2( table_arg );

    Yadcf.refreshSelectPlugin( columnObj, $( `yadcf-filter-${table_selector_jq_friendly}-${col_num}` ) );
  }

  protected static getProp( nestedObj: Record<string, any>, keys: Array<string> | string ) {
    const pathArr = Array.isArray( keys ) ? keys : keys.split( '.' );
    return pathArr.reduce( ( obj, key ) => ( obj && obj[ key ] !== 'undefined' ) ? obj[ key ] : undefined, nestedObj );
  }
  protected static setProp( object: Record<string, any>, keys: Array<string> | string, val: any ) {
    keys = Array.isArray( keys ) ? keys : keys.split( '.' );

    if ( keys.length > 1 ) {
      object[ keys[0] ] = object[ keys[0] ] || {};
      Yadcf.setProp( object[ keys[0] ], keys.slice( 1 ), val );
      return;
    }

    object[ keys[0] ] = val;
  }

  /**
   * Copied from ColReorder.
   * @author SpryMedia Ltd.
   * @link https://www.sprymedia.co.uk
   *
   * @since 0.0.1
   * @static
   *
   * @param dt
   * @returns
   */
  private static getSettingsObjFromTable( dt: any ): DataTableSettings {
    let oDataTableSettings: DataTableSettings;

    if ( $.fn.dataTable && typeof $.fn.dataTable.Api !== 'undefined' ) {
      oDataTableSettings = new $.fn.dataTable.Api( dt ).settings()[0];
    } else if ( typeof dt.settings !== 'undefined' ) { // 1.9 compatibility
      // DataTables object, convert to the settings object
      oDataTableSettings = dt.settings()[0];
    } else if ( typeof dt === 'string' ) { // jQuery selector
      if ( $.fn.dataTable && $.fn.dataTable.isDataTable( $( dt )[0] ) ) {
        // @ts-ignore
        oDataTableSettings = $( dt ).eq( 0 ).dataTable().settings()[0];
      }
    } else if ( dt.nodeName && dt.nodeName.toLowerCase() === 'table' ) {
      // Table node
      if ( $.fn.dataTable && $.fn.dataTable.isDataTable( dt.nodeName ) ) {
        // @ts-ignore
        oDataTableSettings = $( dt.nodeName ).dataTable().settings()[0];
      } else {
        oDataTableSettings = new DataTable( dt.nodeName ).settings()
      }
    } else if ( dt instanceof jQuery ) {
      // jQuery object
      if ( $.fn.dataTable && $.fn.dataTable.isDataTable( dt[0] ) ) {
        oDataTableSettings = dt[0].dataTable().settings()[0];
      } else {
        oDataTableSettings = dt[0].DataTable().settings()[0]
      }
    } else {
      // DataTables settings object
      oDataTableSettings = dt;
    }

    return oDataTableSettings;
  }

  private static arraySwapValueWithIndex( pArray: Array<any> ): Array<Record<any, number>> {
    let tmp = [],
        i;

    for ( i = 0; i < pArray.length; i++ ) {
      tmp[ pArray[ i ] ] = i;
    }

    return tmp;
  }
  private static arraySwapValueWithIndex2( pArray: Array<any> ): Array<Record<any, number>> {
    let tmp = [],
        i;

    for ( i = 0; i < pArray.length; i++ ) {
      tmp[ pArray[ i ]._ColReorder_iOrigCol ] = i;
    }

    return tmp;
  }

  /**
   * Initialize column reorder, part deux.
   *
   * // Methods
   * @see arraySwapValueWithIndex
   * @see arraySwapValueWithIndex2
   *
   * // Properties.
   * @see plugins
   *
   * @param settingsDt
   * @param table_selector_jq_friendly
   */
  private static initColReorder2( settingsDt: DataTableSettings, table_selector_jq_friendly: string ): void {
    if ( settingsDt.oSavedState && settingsDt.oSavedState.ColReorder !== undefined ) {
      if ( Yadcf.plugins[ table_selector_jq_friendly ] === undefined ) {
        Yadcf.plugins[ table_selector_jq_friendly ] = {};
        Yadcf.plugins[ table_selector_jq_friendly ].ColReorder = Yadcf.arraySwapValueWithIndex( settingsDt.oSavedState.ColReorder );
      }
    } else if ( settingsDt.aoColumns && typeof settingsDt.aoColumns[0]._ColReorder_iOrigCol !== 'undefined' ) {
      if ( Yadcf.plugins[ table_selector_jq_friendly ] === undefined ) {
        Yadcf.plugins[ table_selector_jq_friendly ] = {};
        Yadcf.plugins[ table_selector_jq_friendly ].ColReorder = Yadcf.arraySwapValueWithIndex2( settingsDt.aoColumns );
      }
    }
  }

  /**
   * Unsets plugins from a DataTable's instance.
   *
   * @since 0.0.1
   *
   * @see plugins
   *
   * @param table_selector_jq_friendly
   */
  private static initColReorderFromEvent( table_selector_jq_friendly: string ): void {
    Yadcf.plugins[ table_selector_jq_friendly ] = undefined;
  }

  /**
   * Wraps all column index numbers in quotes.
   *
   * @since 0.0.1
   * @static
   *
   * @param column_number
   *
   * @returns Column number object.
   */
  private static columnsArrayToString( column_number: number | Array<number | string> ): ColumnNumberObject {
    const column_number_obj: ColumnNumberObject = {
      column_number_str: '',
      column_number: []
    };

    if ( column_number !== undefined ) {
      if ( column_number instanceof Array ) {
        column_number_obj.column_number_str = column_number.join( '_' );
      } else {
        column_number_obj.column_number_str = column_number.toString();
        column_number = [];
        column_number.push( column_number_obj.column_number_str );
      }
    } else {
      column_number_obj.column_number_str = 'global';
    }

    column_number_obj.column_number = column_number;

    return column_number_obj;
  }

  /**
   * @see options
   */
  private static getAllOptions(): typeof Yadcf.options {
    return Yadcf.options;
  }

  /**
   * Converts string with multiple dots into an object.
   *
   * @since 0.0.1
   * @static
   *
   * @param tmpObj
   * @param dot_refs
   * @returns
   */
  private static dot2obj( tmpObj: Record<string, any>, dot_refs: any ): Record<string, any> {
    let i = 0;

    dot_refs = dot_refs.split( '.' );

    for ( i = 0; i < dot_refs.length; i++ ) {
      if ( tmpObj[ dot_refs[ i ] ] !== undefined && tmpObj[ dot_refs[ i ] ] !== null ) {
        tmpObj = tmpObj[ dot_refs[ i ] ];
      }
    }

    return tmpObj;
  }

  /**
   * @see check3rdPPluginsNeededClose
   *
   * @param selector_arg
   * @param options_arg
   * @param params
   * @param table
   * @returns
   */
  private static setOptions( selector_arg: string, options_arg: ArrayObjects, params: any, table?: DataTableInstance ): void {
    let tmpOptions: Record<string, any> = {},
        i: number,
        col_num_as_int: number;
    //adaptContainerCssClassImpl = function (dummy) { return ''; };

    Yadcf.default_options = $.extend( true, Yadcf.default_options, params );

    if ( options_arg.length === undefined ) {
      Yadcf.options[ selector_arg ] = options_arg;
      return;
    }

    for ( i = 0; i < options_arg.length; i++ ) {
      if ( options_arg[ i ].date_format !== undefined && options_arg[ i ].moment_date_format === undefined ) {
        options_arg[ i ].moment_date_format = options_arg[ i ].date_format;
      }

      if ( options_arg[ i ].select_type === 'select2' ) {
        Yadcf.default_options.select_type_options = {
          //adaptContainerCssClass: adaptContainerCssClassImpl
        };
      }

      // No individual reset button for `externally_triggered` mode.
      if ( Yadcf.default_options.externally_triggered === true ) {
        options_arg[ i ].filter_reset_button_text = false;
      }

      // Validate custom function required attributes.
      if ( options_arg[ i ].filter_type !== undefined && options_arg[ i ].filter_type.indexOf( 'custom_func' ) !== -1 ) {
        if ( options_arg[ i ].custom_func === undefined ) {
          console.log( `Error: You are trying to use filter_type: "custom_func / multi_select_custom_func" for column ${options_arg[ i ].column_number} but there is no such custom_func attribute provided (custom_func: "function reference goes here...")` );
          return;
        }
      }

      if ( !options_arg[ i ].column_selector ) {
        col_num_as_int = +options_arg[ i ].column_number;

        if ( isNaN( col_num_as_int ) ) {
          tmpOptions[ options_arg[ i ].column_number_str ] = $.extend( true, {}, Yadcf.default_options, options_arg[ i ] );
        } else {
          tmpOptions[ col_num_as_int ] = $.extend( true, {}, Yadcf.default_options, options_arg[ i ] );
        }
      } else {
        if ( table && table.column ) {
          // Translate from "https://esm.sh/column_selector" to `column_number`.
          let columnNumber = table.column( options_arg[ i ].column_selector );

          if ( columnNumber.index() >= 0 ) {
            options_arg[ i ].column_number = columnNumber.index();
            tmpOptions[ options_arg[ i ].column_number ] = $.extend( true, {}, Yadcf.default_options, options_arg[ i ] );
          }
        }
      }
    }

    Yadcf.options[ selector_arg ] = tmpOptions;

    Yadcf.check3rdPPluginsNeededClose();
  }

  /**
   * Check for missing plugins needed for close values.
   *
   * @since 0.0.1
   *
   * @see closeBootstrapDatepickerRange
   * @see closeBootstrapDatepicker
   * @see closeSelect2
   */
  private static check3rdPPluginsNeededClose(): void {
    Object.entries( Yadcf.getAllOptions() ).forEach( ( tableEntry ) => {
      Object.entries( tableEntry[1] ).forEach( ( columnEntry ) => {
        if ( columnEntry[1].datepicker_type === 'bootstrap-datepicker' ) {
          if ( columnEntry[1].filter_type === 'range_date' ) {
            Yadcf.closeBootstrapDatepickerRange = true;
          } else {
            Yadcf.closeBootstrapDatepicker = true;
          }
        } else if ( columnEntry[1].select_type === 'select2' ) {
          Yadcf.closeSelect2 = true;
        }
      });
    });
  }

  /**
   * Taken and modified from DataTables 1.10.0-beta.2 source.
   *
   * @since 0.0.1
   * @static
   *
   * @param version
   * @returns TRUE of FALSE depending on success.
   */
  private static yadcfVersionCheck( version: string ): boolean {
    let aThis: Array<string> = $.fn.dataTable.ext.sVersion.split( '.' ),
        aThat: Array<string> = version.split( '.' ),
        iThis: number,
        iThat: number,
        i: number,
        iLen: number;

    for ( i = 0, iLen = aThat.length; i < iLen; i++ ) {
      iThis = parseInt( aThis[ i ], 10 ) || 0;
      iThat = parseInt( aThat[ i ], 10 ) || 0;

      // Parts are the same, keep comparing.
      if ( iThis === iThat ) {
        continue;
      }

      // Parts are different, return immediately
      return iThis > iThat;
    }

    return true;
  }

  /**
   * Reset DataTable's internal API index.
   *
   * @since 0.0.1
   * @static
   */
  private static resetIApiIndex(): void {
    $.fn.dataTable.ext.iApiIndex = 0;
  }

  /**
   * @since 0.0.1
   * @static
   *
   * @param string
   * @returns Escaped regular expression string.
   */
  private static escapeRegExp( string: string ): string {
    return string && string.replace( /([.*+?^=!:${}()|'\[\]\/\\])/g, '\\$1' );
  }

  /**
   * @since 0.0.1
   * @static
   *
   * @param arr
   * @returns Array of strings of regular expressions.
   */
  private static escapeRegExpInArray( arr: Array<any> ): Array<any> {
    let i;

    for ( i = 0; i < arr.length; i++ ) {
      arr[ i ] = arr[ i ].replace( /([.*+?^=!:${}()|'\[\]\/\\])/g, '\\$1' );
    }

    return arr;
  }

  /**
   * @see escapeRegExp
   *
   * @param string
   * @param find
   * @param replace
   * @returns
   */
  private static replaceAll( string: string, find: string, replace: string ): string {
    return string.replace( new RegExp( Yadcf.escapeRegExp( find ), 'g' ), replace );
  }

  /**
   * @see getSettingsObjFromTable
   *
   * @param obj
   * @returns
   */
  private static getTableId( obj: DataTableInstance ): number | string {
    let tableId: Element['id'];

    if ( obj.table !== undefined ) {
      const node = obj.table().node() as Element;

      if ( typeof node.id !== 'undefined' ) {
        tableId = node.id;
      }
    } else {
      tableId = Yadcf.getSettingsObjFromTable( obj ).sTableId;
    }

    return tableId;
  }

  /**
   * @see stopPropagation
   * @see refreshSelectPlugin
   * @see selectElementCustomInitFunc
   *
   * @param select_type
   * @param selectObject
   * @param select_type_options
   */
  private static initializeSelectPlugin(
      select_type: SelectType,
      selectObject: string | JQuery | globalThis.JQuery,
      select_type_options: SelectTypeOptions<DefaultOptions['select_type']>
  ): void {
    const $selectObject = typeof selectObject === 'string' ? $( selectObject ) : selectObject;

    if ( select_type === 'chosen' && typeof $.fn.chosen === 'function' ) {
      $selectObject.chosen( select_type_options );
      $selectObject.next().on( 'click mousedown', Yadcf.stopPropagation );

      Yadcf.refreshSelectPlugin({ select_type: select_type, select_type_options: select_type_options }, $selectObject );
    } else if ( select_type === 'select2' ) {
      if ( !$selectObject.data( 'select2' ) ) {
        $selectObject.select2( select_type_options );
      }

      if ( $selectObject.next().hasClass( 'select2-container' ) ) {
        $selectObject.next().on( 'click mousedown', Yadcf.stopPropagation );
      }
    } else if ( select_type === 'custom_select' ) {
      Yadcf.selectElementCustomInitFunc( $selectObject );
      $selectObject.next().on( 'click mousedown', Yadcf.stopPropagation );
    }
  }

  /**
   * @see typeColumnSelectorasColSelector
   *
   * @param columnObj
   * @param selectObject
   * @param val
   */
  private static refreshSelectPlugin( columnObj?: Partial<AllParameters<FilterType>>, selectObject?: string | JQuery | globalThis.JQuery, val?: any ): void {
    const $selectObject = typeof selectObject === 'string' ? $( selectObject ) : selectObject;

    let select_type         = columnObj.select_type,
        select_type_options = columnObj.select_type_options;

    if ( select_type === 'chosen' ) {
      $selectObject.trigger( 'chosen:updated' );
    }
    else if ( select_type === 'select2' ) {
      if ( !$selectObject.data( 'select2' ) ) {
        $selectObject.select2( select_type_options );
      }

      if ( val !== undefined ) {
        $selectObject.val( val );
      }

      $selectObject.trigger( 'change' );
    }
    else if ( select_type === 'custom_select' ) {
      Yadcf.selectElementCustomRefreshFunc( $selectObject );
    }
  }

  /**
   * Sets the `Select2` plugin custom triggers.
   *
   * @since 0.0.1
   *
   * @see selectElementCustomInitFunc
   * @see selectElementCustomRefreshFunc
   * @see selectElementCustomDestroyFunc
   *
   * @param initFunc
   * @param refreshFunc
   * @param destroyFunc
   */
  private static initSelectPluginCustomTriggers( initFunc: JQueryCallbackFunc, refreshFunc: JQueryCallbackFunc, destroyFunc: JQueryCallbackFunc ): void {
    Yadcf.selectElementCustomInitFunc    = initFunc;
    Yadcf.selectElementCustomRefreshFunc = refreshFunc;
    Yadcf.selectElementCustomDestroyFunc = destroyFunc;
  }

  /**
   * Used by `exFilterColumn` for translating readable search value into proper search string for datatables filtering.
   *
   * @see getOptions
   * @see escapeRegExpInArray
   *
   * @param table_arg
   * @param column_number
   * @param selected_value
   * @param filter_match_mode
   * @param multiple
   * @param exclude
   * @returns
   */
  private static yadcfMatchFilterString(
      table_arg: DataTableSettings,
      column_number: number | string,
      selected_value: any,
      filter_match_mode: FilterMatchMode,
      multiple?: boolean,
      exclude?: boolean
  ): string {
    let case_insensitive = Yadcf.getOptions( table_arg.selector )[ column_number ].case_insensitive,
        ret_val;

    if ( !selected_value ) {
      return '';
    }

    table_arg.settings()[0].aoPreSearchCols[ column_number ].bSmart = false;
    table_arg.settings()[0].aoPreSearchCols[ column_number ].bRegex = true;
    table_arg.settings()[0].aoPreSearchCols[ column_number ].bCaseInsensitive = case_insensitive;

    if ( multiple === undefined || multiple === false ) {
      if ( exclude !== true ) {
        if ( filter_match_mode === 'contains' ) {
          table_arg.settings()[0].aoPreSearchCols[ column_number ].bSmart = true;
          table_arg.settings()[0].aoPreSearchCols[ column_number ].bRegex = false;
          ret_val = selected_value;
        } else if ( filter_match_mode === 'exact' ) {
          ret_val = '^' + selected_value + '$';
        } else if ( filter_match_mode === 'startsWith' ) {
          ret_val = '^' + selected_value;
        } else if ( filter_match_mode === 'regex' ) {
          ret_val = selected_value;
        }
      } else {
        ret_val = '^((?!' + selected_value + ').)*$';
      }
    } else {
      if ( filter_match_mode !== 'regex' ) {
        if ( !( selected_value instanceof Array ) ) {
          selected_value = [ selected_value ];
        }
        selected_value = Yadcf.escapeRegExpInArray( selected_value );
      }

      if ( filter_match_mode === 'contains' ) {
        ret_val = selected_value.join( '|' );
      } else if ( filter_match_mode === 'exact' ) {
        ret_val = '^(' + selected_value.join( '|' ) + ')$';
      } else if ( filter_match_mode === 'startsWith' ) {
        ret_val = '^(' + selected_value.join( '|' ) + ')';
      } else if ( filter_match_mode === 'regex' ) {
        ret_val = selected_value;
      }
    }

    return ret_val;
  }

  /**
   * @see getOptions
   * @see escapeRegExp
   *
   * @param oTable
   * @param selected_value
   * @param filter_match_mode
   * @param column_number
   * @param exclude
   * @param original_column_number
   * @returns
   */
  private static yadcfMatchFilter(
      oTable: DataTableInstance,
      selected_value: any,
      filter_match_mode: FilterMatchMode,
      column_number: number | string,
      exclude: boolean,
      original_column_number: number | string
  ): void {
    let columnObj        = Yadcf.getOptions( oTable.selector )[ original_column_number ],
        case_insensitive = columnObj.case_insensitive;

    if ( exclude !== true ) {
      if ( filter_match_mode === 'contains' ) {
        oTable.fnFilter( selected_value, column_number, false, false, true, case_insensitive );
      }
      else if ( filter_match_mode === 'exact' ) {
        let prefix = '^';
        let suffix = '$';

        if ( columnObj.text_data_delimiter !== undefined ) {
          let text_data_delimiter = Yadcf.escapeRegExp( columnObj.text_data_delimiter );
          prefix = '(' + prefix + '|' + text_data_delimiter + ')';
          suffix = '(' + suffix + '|' + text_data_delimiter + ')';
        }

        selected_value = Yadcf.escapeRegExp( selected_value );

        oTable.fnFilter( prefix + selected_value + suffix, column_number, true, false, true, case_insensitive );
      }
      else if ( filter_match_mode === 'startsWith' ) {
        selected_value = Yadcf.escapeRegExp( selected_value );
        oTable.fnFilter( '^' + selected_value, column_number, true, false, true, case_insensitive );
      }
      else if ( filter_match_mode === 'regex' ) {
        try {
          //validate regex, only call fnFilter if valid
          new RegExp( selected_value );
        } catch ( error ) {
          return;
        }

        oTable.fnFilter( selected_value, column_number, true, false, true, case_insensitive );
      }
    } else {
      if ( filter_match_mode === 'exact' ) {
        selected_value = '^' + Yadcf.escapeRegExp( selected_value ) + '$';
      }
      else if ( filter_match_mode === 'startsWith' ) {
        selected_value = '^' + Yadcf.escapeRegExp( selected_value );
      }

      oTable.fnFilter( '^((?!' + selected_value + ').)*$', column_number, true, false, true, case_insensitive );
    }
  }

  /**
   * The actual filter to find values by string.
   *
   * @since 0.0.2
   * @static
   *
   * @param tmpStr
   * @param filter_match_mode
   * @returns Matched string.
   */
  private static yadcfParseMatchFilter( tmpStr: string, filter_match_mode: FilterMatchMode ): string {
    let retVal: string;

    if ( filter_match_mode === 'contains' ) {
      retVal = tmpStr;
    } else if ( filter_match_mode === 'exact' ) {
      retVal = tmpStr.substring( 1, tmpStr.length - 1 );
      retVal = retVal.replace( /([\\])/g, '' );
    } else if ( filter_match_mode === 'startsWith' ) {
      retVal = tmpStr.substring( 1, tmpStr.length );
      retVal = retVal.replace( /([\\])/g, '' );
    } else if ( filter_match_mode === 'regex' ) {
      retVal = tmpStr;
    }

    return retVal;
  }

  /**
   * @see initColReorder2
   *
   * @param settingsDt
   * @param column_number
   * @param table_selector_jq_friendly
   * @returns
   */
  private static calcColumnNumberFilter( settingsDt: DataTableSettings, column_number: number | string, table_selector_jq_friendly: string ): string | number {
    let column_number_filter;

    if (
      ( settingsDt.oSavedState && settingsDt.oSavedState.ColReorder !== undefined ) ||
      // @ts-ignore
      settingsDt.colReorder ||
      ( Yadcf.plugins[ table_selector_jq_friendly ] !== undefined && Yadcf.plugins[ table_selector_jq_friendly ].ColReorder !== undefined )
    ) {
      Yadcf.initColReorder2( settingsDt, table_selector_jq_friendly );
      column_number_filter = Yadcf.plugins[ table_selector_jq_friendly ].ColReorder[ column_number ];
    } else {
      column_number_filter = column_number;
    }

    return column_number_filter;
  }

  /**
   * @see escapeRegExp
   *
   * @param oTable
   * @param columnObj
   * @param table_selector_jq_friendly
   * @param column_number
   * @param filter_match_mode
   * @param exclude_checked
   */
  private static stateSaveNullSelect(
      oTable: DataTableInstance,
      columnObj: AllParameters<FilterType>,
      table_selector_jq_friendly: string,
      column_number: number | string,
      filter_match_mode: FilterMatchMode,
      exclude_checked?: boolean
  ): void {
    let null_str = columnObj.select_null_option;

    switch ( filter_match_mode ) {
      case 'exact':
        null_str = '^' + Yadcf.escapeRegExp( null_str ) + '$';
        break;
      case 'startsWith':
        null_str = '^' + Yadcf.escapeRegExp( null_str );
        break;
      default:
        break;
    }

    const excludeStrStart = '^((?!';
    const excludeStrEnd   = ').)*$';

    null_str = exclude_checked ? ( excludeStrStart + null_str + excludeStrEnd ) : null_str;

    if ( oTable.settings()[0].oLoadedState ) {
      if (
        oTable.settings()[0].oLoadedState.yadcfState !== undefined &&
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined
      ) {
        oTable.settings()[0].aoPreSearchCols[ column_number ].sSearch = null_str;
      }
    }
  }

  private static yadcfParseMatchFilterMultiSelect( tmpStr: string, filter_match_mode: FilterMatchMode ): string {
    let retVal: string;

    if ( filter_match_mode === 'contains' ) {
      retVal = tmpStr;
    } else if ( filter_match_mode === 'exact' ) {
      retVal = (tmpStr as string).substring( 1, tmpStr.length - 1 );
      retVal = (retVal as string).substring( 1, retVal.length - 1 );
    } else if ( filter_match_mode === 'startsWith' ) {
      retVal = (tmpStr as string).substring( 1, tmpStr.length );
      retVal = (retVal as string).substring( 1, retVal.length - 1 );
    } else if ( filter_match_mode === 'regex' ) {
      retVal = tmpStr;
    }

    return retVal;
  }

  /**
   * @see eventTargetFixUp
   * @see doFilterAutocomplete
   *
   * @param event
   * @param ui
   */
  private static autocompleteSelect: JQueryUI.AutocompleteEvent = ( event: JQuery.Event & Event, ui: JQueryUI.AutocompleteUIParams ): void => {
    let table_column: string,
        dashIndex: number,
        table_selector_jq_friendly: string,
        col_num: number,
        filter_match_mode: string;

    event                      = Yadcf.eventTargetFixUp( event );
    table_column               = (event.target as Element).id.replace( 'yadcf-filter-', '' );
    dashIndex                  = table_column.lastIndexOf( '-' );
    table_selector_jq_friendly = table_column.substring( 0, dashIndex );
    col_num                    = parseInt( table_column.substring( dashIndex + 1 ), 10 );
    filter_match_mode          = $( event.target ).attr( 'filter_match_mode' );

    Yadcf.doFilterAutocomplete( ui.item, table_selector_jq_friendly, col_num, filter_match_mode as FilterMatchMode );
  }

  private static sortNumAsc( a: number, b: number ): number {
    return a - b;
  }
  private static sortNumDesc( a: number, b: number ): number {
    return b - a;
  }
  private static findMinInArray( array: Array<any>, columnObj: AllParameters<FilterType> ): number {
    let narray = [],
        i,
        num,
        min;

    for ( i = 0; i < array.length; i++ ) {
      if ( array[ i ] !== null ) {
        if ( columnObj.ignore_char !== undefined ) {
          array[ i ] = array[ i ].toString().replace( columnObj.ignore_char, '' );
        }

        if ( columnObj.range_data_type !== 'range' ) {
          num = +array[ i ];
        } else {
          num = array[ i ].split( columnObj.range_data_type_delim );
          num = num[0];
        }

        if ( !isNaN( num ) ) {
          narray.push( num );
        }
      }
    }

    min = Math.min( ...narray );

    if ( !isFinite( min ) ) {
      min = 0;
    } else if ( min !== 0 ) {
      if ( min > 0 ) {
        min = Math.floor( min );
      } else {
        min = -1 * Math.ceil( min * -1 );
      }
    }

    return min;
  }
  private static findMaxInArray( array: Array<any>, columnObj: AllParameters<FilterType> ): number {
    let narray = [],
        i,
        num,
        max;

    for ( i = 0; i < array.length; i++ ) {
      if ( array[ i ] !== null ) {
        if ( columnObj.ignore_char !== undefined ) {
          array[ i ] = array[ i ].toString().replace( columnObj.ignore_char, '' );
        }

        if ( columnObj.range_data_type !== 'range' ) {
          num = +array[ i ];
        } else {
          num = array[ i ].split( columnObj.range_data_type_delim );
          num = num[1];
        }

        if ( !isNaN( num ) ) {
          narray.push( num );
        }
      }
    }

    max = Math.max( ...narray );

    if ( ! isFinite( max ) ) {
      max = 0;
    } else {
      max = Math.ceil( max );
    }

    return max;
  }

  /**
   * @see generateTableSelectorJQFriendly2
   * @see getOptions
   * @see calcColumnNumberFilter
   * @see getProp
   * @see setProp
   * @see dot2obj
   *
   * @param table_selector_jq_friendly
   * @param fromId
   * @param toId
   * @param col_num
   * @param ignore_char
   * @param sliderMaxMin
   */
  private static addRangeNumberAndSliderFilterCapability(
      table_selector_jq_friendly: string,
      fromId: number | string,
      toId: number | string,
      col_num: number,
      ignore_char: IgnoreChar,
      sliderMaxMin?: Record<'min' | 'max', number | string>
  ): void {
    $.fn.dataTable.ext.afnFiltering.push(
      function( settingsDt: DataTableSettings, aData: any, iDataIndex: RowIdx, rowData?: Array<any> ): boolean {
        let min: any,
            max: any,
            val: any,
            retVal: boolean = false,
            table_selector_jq_friendly_local: string = table_selector_jq_friendly,
            current_table_selector_jq_friendly: string = Yadcf.generateTableSelectorJQFriendly2( settingsDt ),
            ignore_char_local: IgnoreChar = ignore_char,
            column_data_type: ColumnDataType,
            html_data_type: HTMLDataType,
            columnObj: Partial<AllParameters<FilterType>>,
            column_number_filter: number | string,
            valFrom: number | string,
            valTo: number | string,
            exclude_checked: boolean = false;

        if ( table_selector_jq_friendly_local !== current_table_selector_jq_friendly ) {
          return true;
        }

        columnObj = Yadcf.getOptions( settingsDt.oInstance.selector )[ col_num ];

        if ( columnObj.filter_type === 'range_number_slider' ) {
          min = $( `#${fromId}` ).text();
          max = $( `#${toId}` ).text();
        } else {
          min = $( `#${fromId}` ).val();
          max = $( `#${toId}` ).val();
        }

        if ( columnObj.exclude ) {
          exclude_checked = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${col_num}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
        }

        column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, col_num, table_selector_jq_friendly );

        if ( rowData !== undefined ) {
          let rowDataRender: any;

          if ( columnObj.column_number_render ) {
            rowDataRender = $.extend( true, [], rowData );

            const index = columnObj.column_number_data ? columnObj.column_number_data : column_number_filter;
            const meta  = {
              row: iDataIndex,
              col: columnObj.column_number,
              settings: settingsDt
            };

            if ( typeof index === 'string' && typeof rowDataRender === 'object' ) {
              const cellDataRender = columnObj.column_number_render( Yadcf.getProp( rowDataRender, index ), 'filter', rowData, meta );
              Yadcf.setProp( rowDataRender, index, ( cellDataRender !== undefined && cellDataRender !== null ) ? cellDataRender : Yadcf.getProp( rowData, index ) );
            } else {
              const cellDataRender   = columnObj.column_number_render( rowDataRender[ index ], 'filter', rowData, meta );
              rowDataRender[ index ] = ( cellDataRender !== undefined && cellDataRender !== null ) ? cellDataRender : rowData[ index ];
            }
          }

          aData = rowDataRender ? rowDataRender : rowData;

          if ( columnObj.column_number_data !== undefined ) {
            column_number_filter = columnObj.column_number_data;
            val                  = Yadcf.dot2obj( aData, column_number_filter );
          } else {
            val = aData[ column_number_filter ];
          }
        } else {
          val = aData[ column_number_filter ];
        }

        if ( ! isFinite( min ) || ! isFinite( max ) ) {
          return true;
        }

        column_data_type = columnObj.column_data_type;
        html_data_type   = columnObj.html_data_type;

        if ( column_data_type === 'html' || column_data_type === 'rendered_html' ) {
          if ( html_data_type === undefined ) {
            html_data_type = 'text';
          }

          if ( $( val ).length !== 0 ) {
            switch ( html_data_type ) {
              case 'text':
                val = $( val ).text();
                break;
              case 'value':
                val = $( val ).val();
                break;
              case 'id':
                val = val.id;
                break;
              case 'selector':
                val = $( val ).find( columnObj.html_data_selector ).text();
                break;
            }
          }
        } else {
          if ( typeof val === 'object' && columnObj.html5_data !== undefined ) {
            val = val[ '@' + columnObj.html5_data ];
          }
        }

        if ( ignore_char_local !== undefined ) {
          min = min.replace( ignore_char_local, '' );
          max = max.replace( ignore_char_local, '' );

          if ( val ) {
            val = val.toString().replace( ignore_char_local, '' );
          } else {
            val = '';
          }
        }

        // Omit empty rows when filtering.
        if ( columnObj.filter_type === 'range_number_slider' ) {
          if ( val === '' && ( ( +min ) !== sliderMaxMin.min || ( +max ) !== sliderMaxMin.max ) ) {
            return false;
          }
        } else {
          if ( val === '' && ( min !== '' || max !== '' ) ) {
            return false;
          }
        }

        min = ( min !== '' ) ? ( +min ) : min;
        max = ( max !== '' ) ? ( +max ) : max;

        if ( ! exclude_checked ) {
          if ( columnObj.range_data_type === 'single' ) {
            val = ( val !== '' ) ? ( +val ) : val;

            if ( min === '' && max === '' ) {
              retVal = true;
            } else if ( min === '' && val <= max ) {
              retVal = true;
            } else if ( min <= val && '' === max ) {
              retVal = true;
            } else if ( min <= val && val <= max ) {
              retVal = true;
            } else if ( val === '' || isNaN( val ) ) {
              retVal = true;
            }
          } else if ( columnObj.range_data_type === 'range' ) {
            val     = val.split( columnObj.range_data_type_delim );
            valFrom = ( val[0] !== '' ) ? ( +val[0] ) : val[0];
            valTo   = ( val[1] !== '' ) ? ( +val[1] ) : val[1];
            // @ts-ignore
            if ( !columnObj.range_data_operator ) {
              if ( min === '' && max === '' ) {
                retVal = true;
              } else if ( min === '' && valTo <= max ) {
                retVal = true;
              } else if ( min <= valFrom && '' === max ) {
                retVal = true;
              } else if ( min <= valFrom && valTo <= max ) {
                retVal = true;
              } else if ( ( valFrom === '' || isNaN( valFrom as number ) ) && ( valTo === '' || isNaN( valTo as number ) ) ) {
                retVal = true;
              }
            }
          } else if ( columnObj.range_data_type === 'delimeter' ) {
            if ( columnObj.text_data_delimiter !== undefined ) {
              let valSplitted = val.split( columnObj.text_data_delimiter );

              let anyNumberInRange = function( fromToObj: { from: number; to: number; } ) {
                return function( element: number, index: number, array: Array<number> ) {
                  return element >= fromToObj.from && element <= fromToObj.to;
                };
              };

              retVal = valSplitted.some( anyNumberInRange( { from: min, to: max }) );
            }
          }

          return retVal;
        } else {
          if ( columnObj.range_data_type === 'single' ) {
            val = ( val !== '' ) ? ( +val ) : val;

            if ( min === '' && max === '' ) {
              retVal = true;
            } else if ( min === '' && val > max ) {
              retVal = true;
            } else if ( min > val && '' === max ) {
              retVal = true;
            } else if ( !( min <= val && val <= max ) && ( '' !== max && '' !== min ) ) {
              retVal = true;
            } else if ( val === '' || isNaN( val ) ) {
              retVal = true;
            }
          } else if ( columnObj.range_data_type === 'range' ) {
            val     = val.split( columnObj.range_data_type_delim );
            valFrom = ( val[0] !== '' ) ? ( +val[0] ) : val[0];
            valTo   = ( val[1] !== '' ) ? ( +val[1] ) : val[1];

            if ( min === '' && max === '' ) {
              retVal = true;
            } else if ( min === '' && valTo > max ) {
              retVal = true;
            } else if ( min > valFrom && '' === max ) {
              retVal = true;
            } else if ( !( min <= valFrom && valTo <= max ) && ( '' !== max && '' !== min ) ) {
              retVal = true;
            } else if ( ( valFrom === '' || isNaN( valFrom as number ) ) && ( valTo === '' || isNaN( valTo as number ) ) ) {
              retVal = true;
            }
          }

          return retVal;
        }
      }
    );
  }

  /**
   * @see generateTableSelectorJQFriendly2
   * @see calcColumnNumberFilter
   * @see getOptions
   *
   * @param table_selector_jq_friendly
   * @param filterId
   * @param col_num
   */
  private static addCustomFunctionFilterCapability( table_selector_jq_friendly: string, filterId: string, col_num: number ): void {
    $.fn.dataTable.ext.afnFiltering.push(
      function( settingsDt: DataTableSettings, aData: Array<any>, iDataIndex: RowIdx, stateVal: Node ): boolean {
        let filterVal: any                             = $( '#' + filterId ).val(),
            columnVal: number | string,
            retVal: boolean                            = false,
            table_selector_jq_friendly_local: string   = table_selector_jq_friendly,
            current_table_selector_jq_friendly: string = Yadcf.generateTableSelectorJQFriendly2( settingsDt ),
            custom_func: CustomFunc<FilterType>,
            column_number_filter: number | string;

        if ( table_selector_jq_friendly_local !== current_table_selector_jq_friendly || filterVal === '-1' ) {
          return true;
        }

        column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, col_num, table_selector_jq_friendly );

        columnVal = aData[ column_number_filter ] === '-' ? 0 : aData[ column_number_filter ];

        custom_func = Yadcf.getOptions( settingsDt.oInstance.selector )[ col_num ].custom_func;

        retVal = custom_func( filterVal, columnVal, aData, stateVal );

        return retVal;
      }
    );
  }

  /**
   * @see generateTableSelectorJQFriendly2
   * @see getOptions
   * @see calcColumnNumberFilter
   * @see dot2obj
   *
   * @param table_selector_jq_friendly
   * @param fromId
   * @param toId
   * @param col_num
   * @param date_format
   */
  private static addRangeDateFilterCapability( table_selector_jq_friendly: string, fromId: string, toId: string, col_num: number, date_format: DateFormat ): void {
    $.fn.dataTable.ext.afnFiltering.push(
      function( settingsDt: DataTableSettings, aData: any, iDataIndex: RowIdx, rowData: Array<any> ): boolean {
        let min: any = document.getElementById( fromId ) !== null ? (document.getElementById( fromId ) as HTMLInputElement).value : '',
            max: any = document.getElementById( toId ) !== null ? (document.getElementById( toId ) as HTMLInputElement).value : '',
            val: any,
            retVal: boolean = false,
            table_selector_jq_friendly_local: string = table_selector_jq_friendly,
            current_table_selector_jq_friendly: string = Yadcf.generateTableSelectorJQFriendly2( settingsDt ),
            column_data_type: ColumnDataType,
            html_data_type: HTMLDataType,
            columnObj: Partial<AllParameters<FilterType>>,
            column_number_filter: number | string,
            min_time: number | string | Moment,
            max_time: number | string | Moment,
            dataRenderFunc: boolean,
            dpg: any;
        //'2019/01/30 - 2019/01/30'
        if ( table_selector_jq_friendly_local !== current_table_selector_jq_friendly ) {
          return true;
        }

        columnObj = Yadcf.getOptions( settingsDt.oInstance.selector )[ col_num ];

        if ( columnObj.filters_position === 'tfoot' && settingsDt.oScroll.sX ) {
          let selectorePrefix = '.dataTables_scrollFoot ';
          min = document.querySelector( selectorePrefix + `#${fromId}` ) ? (document.querySelector( selectorePrefix + `#${fromId}` ) as HTMLInputElement).value : '';
          max = document.querySelector( selectorePrefix + `#${toId}` ) ? (document.querySelector( selectorePrefix + `#${toId}` ) as HTMLInputElement).value : '';
        }

        if ( columnObj.datepicker_type === 'daterangepicker' ) {
          min = trim( min.substring( 0, min.indexOf( '-' ) ) );
          max = trim( max.substring( max.indexOf( '-' ) + 1 ) );
        }

        if ( columnObj.datepicker_type === 'bootstrap-datepicker' && typeof $.fn.datepicker !== 'undefined' ) {
          // @ts-ignore
          dpg = $.fn.datepicker.DPGlobal;
        }

        column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, col_num, table_selector_jq_friendly );

        if ( typeof columnObj.column_number_data === 'function' || typeof columnObj.column_number_render === 'function' ) {
          dataRenderFunc = true;
        }

        if ( rowData !== undefined && dataRenderFunc !== true ) {
          if ( columnObj.column_number_data !== undefined ) {
            column_number_filter = columnObj.column_number_data;
            val = Yadcf.dot2obj( rowData, column_number_filter );
          } else {
            val = rowData[ column_number_filter ];
          }
        } else {
          val = aData[ column_number_filter ];
        }

        column_data_type = columnObj.column_data_type;
        html_data_type   = columnObj.html_data_type;

        if ( column_data_type === 'html' || column_data_type === 'rendered_html' ) {
          if ( html_data_type === undefined ) {
            html_data_type = 'text';
          }

          if ( $( val ).length !== 0 ) {
            switch ( html_data_type ) {
              case 'text':
                val = $( val ).text();
                break;
              case 'value':
                val = $( val ).val();
                break;
              case 'id':
                val = val.id;
                break;
              case 'selector':
                val = $( val ).find( columnObj.html_data_selector ).text();
                break;
            }
          }
        } else if ( typeof val === 'object' ) {
          if ( columnObj.html5_data !== undefined ) {
            val = val[ '@' + columnObj.html5_data ];
          }
        }

        // Omit empty rows when filtering.
        if ( val === '' && ( min !== '' || max !== '' ) ) {
          return false;
        }

        try {
          if ( min.length === ( date_format.length + 2 ) || columnObj.datepicker_type.indexOf( 'bootstrap' ) !== -1 || columnObj.datepicker_type === 'daterangepicker' ) {
            if ( columnObj.datepicker_type === 'jquery-ui' ) {
              min = ( min !== '' ) ? $.datepicker.parseDate( date_format, min ) : min;
            } else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' || columnObj.datepicker_type === 'daterangepicker' ) {
              min = ( min !== '' ) ? moment( min, columnObj.date_format ).toDate() : min;
            } else if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
              min = ( min !== '' ) ? dpg.parseDate( min, dpg.parseFormat( columnObj.date_format ) ) : min;
            }
          }
        } catch ( err1 ) {}

        try {
          if ( max.length === ( date_format.length + 2 ) || columnObj.datepicker_type.indexOf( 'bootstrap' ) !== -1 || columnObj.datepicker_type === 'daterangepicker' ) {
            if ( columnObj.datepicker_type === 'jquery-ui' ) {
              max = ( max !== '' ) ? $.datepicker.parseDate( date_format, max ) : max;
            } else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' || columnObj.datepicker_type === 'daterangepicker' ) {
              max = ( max !== '' ) ? moment( max, columnObj.date_format ).toDate() : max;
            } else if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
              max = ( max !== '' ) ? dpg.parseDate( max, dpg.parseFormat( columnObj.date_format ) ) : max;
            }
          }
        } catch ( err2 ) {}

        try {
          if ( columnObj.datepicker_type === 'jquery-ui' ) {
            val = ( val !== '' ) ? $.datepicker.parseDate( date_format, val ) : val;
          } else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' ) {
            val = ( val !== '' ) ? moment( val, columnObj.moment_date_format ).toDate() : val;
          } else if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
            val = ( val !== '' ) ? dpg.parseDate( val, dpg.parseFormat( columnObj.date_format ) ) : val;
          } else if ( columnObj.datepicker_type === 'daterangepicker' ) {
            val = ( val !== '' ) ? moment( val, columnObj.date_format ).toDate() : val;
          }
        } catch ( err3 ) {}

        if ( date_format.toLowerCase() !== 'hh:mm' ) {
          if ( ( min === '' || !( min instanceof Date ) ) && ( max === '' || !( max instanceof Date ) ) ) {
            retVal = true;
          } else if ( min === '' && val <= max ) {
            retVal = true;
          } else if ( min <= val && '' === max ) {
            retVal = true;
          } else if ( min <= val && val <= max ) {
            retVal = true;
          }
        } else {
          min_time = moment( min );
          min_time = min_time.minutes() + min_time.hours() * 60;

          if ( isNaN( min_time ) ) {
            min_time = '';
          }

          max_time = moment( max );
          max_time = (max_time).minutes() + max_time.hours() * 60;

          if ( isNaN( max_time ) ) {
            max_time = '';
          }

          val = moment( val );
          val = val.minutes() + val.hours() * 60;

          if ( ( min === '' || !( moment( min, date_format ).isValid() ) ) && ( max === '' || !( moment( max, date_format ).isValid() ) ) ) {
            retVal = true;
          } else if ( min_time === '' && val <= max_time ) {
            retVal = true;
          } else if ( min_time <= val && '' === max_time ) {
            retVal = true;
          } else if ( min_time <= val && val <= max_time ) {
            retVal = true;
          }
        }

        return retVal;
      }
    );
  }

  /**
   * @see generateTableSelectorJQFriendly2
   * @see getOptions
   * @see calcColumnNumberFilter
   * @see getProp
   * @see setProp
   */
  private static addNullFilterCapability( table_selector_jq_friendly: string, col_num: number, isSelect: boolean ): void {
    $.fn.dataTable.ext.afnFiltering.push(
      function( settingsDt: DataTableSettings, aData: Array<any>, iDataIndex: RowIdx, rowData?: Array<any> ): boolean {
        let val: any,
            retVal: boolean = false,
            table_selector_jq_friendly_local: string = table_selector_jq_friendly,
            current_table_selector_jq_friendly: string = Yadcf.generateTableSelectorJQFriendly2( settingsDt ),
            columnObj: Partial<AllParameters<FilterType>>,
            column_number_filter: number | string,
            null_checked: boolean,
            exclude_checked: boolean;

        if ( table_selector_jq_friendly_local !== current_table_selector_jq_friendly ) {
          return true;
        }

        columnObj = Yadcf.getOptions( settingsDt.oInstance.selector )[ col_num ];

        column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, col_num, table_selector_jq_friendly );

        let fixedPrefix = '';

        if ( (settingsDt as DataTableSettings).fixedHeader !== undefined && $( '.fixedHeader-floating' ).is( ':visible' ) ) {
          fixedPrefix = '.fixedHeader-floating ';
        }

        if ( columnObj.filters_position === 'tfoot' && settingsDt.nScrollFoot ) {
          fixedPrefix = `.${(settingsDt.nScrollFoot as Element).className} `;
        }

        null_checked = $( `${fixedPrefix}#yadcf-filter-wrapper-${table_selector_jq_friendly}-${col_num}` ).find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked' );
        null_checked = isSelect ? ( ($( `#yadcf-filter-${table_selector_jq_friendly}-${col_num}` ).find( 'option:selected' ).val() as string).trim() === columnObj.select_null_option ) : null_checked;

        if ( !null_checked ) {
          return true;
        }

        if ( columnObj.exclude ) {
          exclude_checked = $( `${fixedPrefix}#yadcf-filter-wrapper-${table_selector_jq_friendly}-${col_num}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
        }

        if ( rowData !== undefined ) {
          /**
           * Support dt render fn, usecase structured data when top is null inner property will return undefined.
           * e.g data = person.cat.name && person.cat = null
           */
          let rowDataRender: Array<Record<string, any>>;

          if ( columnObj.column_number_render ) {
            rowDataRender = $.extend( true, [], rowData );
            const index = columnObj.column_number_data ? columnObj.column_number_data : column_number_filter;
            const meta = {
              row: iDataIndex,
              col: columnObj.column_number,
              settings: settingsDt
            };

            if ( typeof index === 'string' && typeof rowDataRender === 'object' ) {
              const cellDataRender = columnObj.column_number_render( Yadcf.getProp( rowDataRender, index ), 'filter', rowData, meta );
              Yadcf.setProp( rowDataRender, index, ( cellDataRender !== undefined ) ? cellDataRender : Yadcf.getProp( rowData, index ) );
            } else {
              const cellDataRender = columnObj.column_number_render( rowDataRender[ index ], 'filter', rowData, meta );
              rowDataRender[ index ] = ( cellDataRender !== undefined ) ? cellDataRender : rowData[ index ];
            }
          }

          aData = rowDataRender ? rowDataRender : rowData;

          if ( columnObj.column_number_data !== undefined ) {
            column_number_filter = columnObj.column_number_data;
            val = Yadcf.getProp( aData, column_number_filter.toString() );
          } else {
            val = aData[ column_number_filter ];
          }
        } else {
          val = aData[ column_number_filter ];
        }

        if ( columnObj.exclude && exclude_checked ) {
          retVal = val === null ? false : true;
        } else {
          retVal = val === null ? true : false;
        }

        return retVal;
      }
    );
  }

  /**
   * @see getOptions
   * @see makeElement
   * @see stopPropagation
   * @see rangeNumberKeyUP
   * @see preventDefaultForEnter
   * @see rangeClear
   * @see nullChecked
   * @see addNullFilterCapability
   * @see resetIApiIndex
   * @see addRangeNumberAndSliderFilterCapability
   *
   * @param filter_selector_string
   * @param table_selector_jq_friendly
   * @param column_number
   * @param filter_reset_button_text
   * @param filter_default_label
   * @param ignore_char
   * @returns
   */
  private static addRangeNumberFilter(
      filter_selector_string: string,
      table_selector_jq_friendly: string,
      column_number: number | string,
      filter_reset_button_text: FilterResetButtonText,
      filter_default_label: FDL,
      ignore_char: IgnoreChar
  ): void {
    let fromId = `yadcf-filter-${table_selector_jq_friendly}-from-${column_number}`,
        toId   = `yadcf-filter-${table_selector_jq_friendly}-to-${column_number}`,
        filter_selector_string_tmp: string,
        filter_wrapper_id: number | string,
        oTable: DataTableSettings,
        columnObj: AllParameters,
        filterActionFn: ( arg?: any ) => any,
        null_str: JQuery | globalThis.JQuery,
        exclude_str: JQuery | globalThis.JQuery;

    filter_wrapper_id = `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}`;

    if ( $( `#${filter_wrapper_id}` ).length > 0 ) {
      return;
    }

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    oTable = Yadcf.oTables[ table_selector_jq_friendly ];

    columnObj = Yadcf.getOptions( oTable.selector )[ column_number ];

    // Add a wrapper to hold both filter and reset button.
    $( filter_selector_string ).append(
      Yadcf.makeElement( '<div />', {
        onmousedown: Yadcf.stopPropagation,
        onclick: Yadcf.stopPropagation,
        id: filter_wrapper_id,
        class: `yadcf-filter-wrapper ${columnObj.style_class}`
      })
    );

    filter_selector_string    += ' div.yadcf-filter-wrapper';
    filter_selector_string_tmp = filter_selector_string;

    $( filter_selector_string ).append(
      Yadcf.makeElement( '<div />', {
        id: `yadcf-filter-wrapper-inner-${table_selector_jq_friendly}-${column_number}`,
        class: `yadcf-filter-wrapper-inner -${table_selector_jq_friendly}-${column_number}`
      })
    );

    filter_selector_string += ' div.yadcf-filter-wrapper-inner';

    filterActionFn = function( tableSel: string ) {
      return function( event: JQuery.KeyUpEvent ): void {
        Yadcf.rangeNumberKeyUP( tableSel, event );
      };
    }( table_selector_jq_friendly );

    if ( columnObj.externally_triggered === true ) {
      filterActionFn = function() {};
    }

    $( filter_selector_string ).append(
      Yadcf.makeElement( '<input />', {
        onkeydown: Yadcf.preventDefaultForEnter,
        placeholder: filter_default_label[0],
        id: fromId,
        class: 'yadcf-filter-range-number yadcf-filter-range',
        onkeyup: filterActionFn
      })
    );

    $( filter_selector_string ).append(
      Yadcf.makeElement( '<span />', {
        class: 'yadcf-filter-range-number-seperator'
      })
    );

    $( filter_selector_string ).append(
      Yadcf.makeElement( '<input />', {
        onkeydown: Yadcf.preventDefaultForEnter,
        placeholder: filter_default_label[1],
        id: toId,
        class: 'yadcf-filter-range-number yadcf-filter-range',
        onkeyup: filterActionFn
      })
    );

    if ( filter_reset_button_text !== false ) {
      $( filter_selector_string_tmp ).append(
        Yadcf.makeElement( '<button />', {
          type: 'button',
          id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}-reset`,
          onmousedown: Yadcf.stopPropagation,
          onclick: function( colNo: number, tableSel: string ) {
            return function( event: JQuery.ClickEvent ) {
              Yadcf.stopPropagation( event );
              Yadcf.rangeClear( tableSel, event, colNo );
              return false;
            };
          }( column_number as number, table_selector_jq_friendly ),
          class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
          text: filter_reset_button_text
        })
      );
    }

    if ( columnObj.externally_triggered_checkboxes_text && typeof columnObj.externally_triggered_checkboxes_function === 'function' ) {
      $( filter_selector_string_tmp ).append(
        Yadcf.makeElement( '<button />', {
          type: 'button',
          id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}-externally_triggered_checkboxes-button`,
          onmousedown: Yadcf.stopPropagation,
          onclick: Yadcf.stopPropagation,
          class: `yadcf-filter-externally_triggered_checkboxes-button ${columnObj.externally_triggered_checkboxes_button_style_class}`,
          text: columnObj.externally_triggered_checkboxes_text
        })
      );

      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}-externally_triggered_checkboxes-button` ).on( 'click', columnObj.externally_triggered_checkboxes_function );
    }

    exclude_str = $();

    if ( columnObj.exclude === true ) {
      if ( columnObj.externally_triggered !== true ) {
        exclude_str = Yadcf.makeElement( '<div />', {
          class: 'yadcf-exclude-wrapper',
          onmousedown: Yadcf.stopPropagation,
          onclick: Yadcf.stopPropagation
        })
        .append(
          Yadcf.makeElement( '<span />', {
            class: 'yadcf-label small',
            text: columnObj.exclude_label
          })
        )
        .append(
          Yadcf.makeElement( '<input />', {
            type: 'checkbox',
            title: columnObj.exclude_label,
            onclick: function( tableSel: string ) {
              return function( event: any ) {
                Yadcf.stopPropagation( event );
                Yadcf.rangeNumberKeyUP( tableSel, event );
              };
            }( table_selector_jq_friendly )
          })
        );
      } else {
        exclude_str = Yadcf.makeElement( '<div />', {
          class: 'yadcf-exclude-wrapper',
          onmousedown: Yadcf.stopPropagation,
          onclick: Yadcf.stopPropagation
        })
        .append(
          Yadcf.makeElement( '<span />', {
            class: 'yadcf-label small',
            text: columnObj.exclude_label
          })
        )
        .append(
          Yadcf.makeElement( '<input />', {
            type: 'checkbox',
            title: columnObj.exclude_label,
            onclick: Yadcf.stopPropagation
          })
        );
      }
    }

    null_str = $();

    if ( columnObj.null_check_box === true ) {
      null_str = Yadcf.makeElement( '<div />', {
        class: 'yadcf-null-wrapper',
        onmousedown: Yadcf.stopPropagation,
        onclick: Yadcf.stopPropagation
      })
      .append(
        Yadcf.makeElement( '<span />', {
          class: 'yadcf-label small',
          text: columnObj.null_label
        })
      )
      .append(
        Yadcf.makeElement( '<input />', {
          type: 'checkbox',
          title: columnObj.null_label,
          onclick: function( colNo: number, tableSel: string ) {
            return function( event: any ) {
              Yadcf.stopPropagation( event );
              Yadcf.nullChecked( event, tableSel, colNo );
            };
          }( column_number as number, table_selector_jq_friendly )
        })
      );

      if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
        Yadcf.addNullFilterCapability( table_selector_jq_friendly, column_number as number, false );
      }
    }

    if ( columnObj.checkbox_position_after ) {
      exclude_str.addClass( 'after' );
      null_str.addClass( 'after' );
      $( filter_selector_string_tmp ).append( exclude_str, null_str );
    } else {
      $( filter_selector_string ).before( exclude_str, null_str );
    }

    // Hide on load.
    if ( columnObj.externally_triggered_checkboxes_text && typeof columnObj.externally_triggered_checkboxes_function === 'function' ) {
      const sel = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` );
      sel.find( '.yadcf-exclude-wrapper' ).hide();
      sel.find( '.yadcf-null-wrapper' ).hide();
    }

    if ( oTable.settings()[0].oFeatures.bStateSave === true && oTable.settings()[0].oLoadedState ) {
      if (
        oTable.settings()[0].oLoadedState.yadcfState &&
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] &&
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ]
      ) {
        let exclude_checked = false;
        let null_checked = false;

        if ( columnObj.null_check_box ) {
          null_checked = oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].null_checked;

          $( `#${filter_wrapper_id}` ).find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked', null_checked );

          if ( columnObj.exclude ) {
            exclude_checked = oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].exclude_checked;
            $( `#${filter_wrapper_id}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked', exclude_checked );
          }
        }

        if ( null_checked ) {
          $( `#${fromId}` ).prop( 'disabled', true );
          $( `#${toId}` ).prop( 'disabled', true );
        } else {
          const inuseClass = exclude_checked ? ' inuse inuse-exclude' : ' inuse ';

          if ( oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from ) {
            $( `#${fromId}` ).val( oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from );

            if ( oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from !== '' ) {
              $( `#${fromId}` ).addClass( inuseClass );
            }
          }

          if ( oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to ) {
            $( `#${toId}` ).val( oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to );

            if ( oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to !== '' ) {
              $( `#${toId}` ).addClass( inuseClass );
            }
          }
        }
      }
    }

    Yadcf.resetIApiIndex();

    if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
      Yadcf.addRangeNumberAndSliderFilterCapability( table_selector_jq_friendly, fromId, toId, column_number as number, ignore_char );
    }
  }

  /**
   * @see getSettingsObjFromTable
   * @see calcColumnNumberFilter
   * @see getOptions
   * @see resetIApiIndex
   * @see yadcfDelay
   *
   * @param pDate
   * @param pEvent
   */
  private static dateSelect( pDate: JQuery.TriggeredEvent, pEvent?: JQuery.TriggeredEvent ): void {
    let oTable,
        column_number,
        dashIndex,
        table_selector_jq_friendly,
        yadcfState,
        from,
        to,
        event,
        columnObj,
        column_number_filter,
        settingsDt,
        keyUp;

    if ( pDate.type === 'dp' || pDate.namespace === 'daterangepicker' ) {
      event = pDate.target;
    } else if ( pDate.type === 'changeDate' ) {
      event = pDate.currentTarget;
    } else {
      event = pEvent;
    }

    column_number              = $( event ).attr( 'id' ).replace( 'yadcf-filter-', '' ).replace( '-from-date', '' ).replace( '-to-date', '' );
    dashIndex                  = column_number.lastIndexOf( '-' );
    table_selector_jq_friendly = column_number.substring( 0, dashIndex );

    column_number = column_number.substring( dashIndex + 1 );

    oTable               = Yadcf.oTables[ table_selector_jq_friendly ];
    settingsDt           = Yadcf.getSettingsObjFromTable( oTable );
    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    columnObj = Yadcf.getOptions( oTable.selector )[ column_number ];

    if ( pDate.type === 'dp' ) {
      event = pDate.target;
      // @ts-expect-error
      if ( pDate.date === false || !moment( $( event ).val(), columnObj.date_format ).isValid() ) {
        $( event ).removeClass( 'inuse' );
        $( event ).data( 'DateTimePicker' ).minDate( false );
      } else {
        $( event ).addClass( 'inuse' );
      }

      $( event ).trigger( 'blur' );
    } else if ( pDate.type === 'changeDate' ) {
      // @ts-expect-error
      if ( pDate.date !== undefined ) {
        $( event ).addClass( 'inuse' );
      } else {
        $( event ).removeClass( 'inuse' );
      }
    } else {
      $( event ).addClass( 'inuse' );
    }

    if ( pDate.namespace === 'daterangepicker' ) {
      // @ts-expect-error
      from = moment( pEvent.startDate ).format( columnObj.date_format );
      // @ts-expect-error
      to = moment( pEvent.endDate ).format( columnObj.date_format );
    } else {
      if ( $( event ).attr( 'id' ).indexOf( '-from-' ) !== -1 ) {
        from = (document.getElementById( $( event ).attr( 'id' ) ) as HTMLInputElement).value;
        to   = (document.getElementById( $( event ).attr( 'id' ).replace( '-from-', '-to-' ) ) as HTMLInputElement).value;
      } else {
        to   = (document.getElementById( $( event ).attr( 'id' ) ) as HTMLInputElement).value;
        from = (document.getElementById( $( event ).attr( 'id' ).replace( '-to-', '-from-' ) ) as HTMLInputElement).value;
      }
    }

    keyUp = function() {
      if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
        oTable.fnDraw();
      } else {
        oTable.fnFilter( from + columnObj.custom_range_delimiter + to, column_number_filter );
      }

      if ( !oTable.settings()[0].oLoadedState ) {
        oTable.settings()[0].oLoadedState = {};
        oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
      }

      if ( oTable.settings()[0].oFeatures.bStateSave === true ) {
        if ( oTable.settings()[0].oLoadedState.yadcfState !== undefined && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
          oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = { from: from, to: to };
        } else {
          yadcfState = {};
          yadcfState[ table_selector_jq_friendly ] = [];
          yadcfState[ table_selector_jq_friendly ][ column_number ] = { from: from, to: to };
          oTable.settings()[0].oLoadedState.yadcfState = yadcfState;
        }

        oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
      }

      if ( from !== '' || to !== '' ) {
        $( '#' + event.id ).addClass( 'inuse' );
      }

      Yadcf.resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      keyUp();
    } else {
      Yadcf.yadcfDelay( function() {
        keyUp();
      }, columnObj.filter_delay );
    }
  }

  /**
   * @see getOptions
   * @see makeElement
   * @see stopPropagation
   * @see rangeDateKeyUP
   * @see preventDefaultForEnter
   * @see stopPropagation
   * @see rangeClear
   * @see dateSelect
   * @see addRangeDateFilterCapability
   * @see resetIApiIndex
   *
   * @param filter_selector_string
   * @param table_selector_jq_friendly
   * @param column_number
   * @param filter_reset_button_text
   * @param filter_default_label
   * @param date_format
   * @returns
   */
  private static addRangeDateFilter(
      filter_selector_string: string,
      table_selector_jq_friendly: string,
      column_number: number,
      filter_reset_button_text: FilterResetButtonText,
      filter_default_label: FilterDefaultLabel,
      date_format: DateFormat
  ): void {
    let fromId: string = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`,
        toId: string   = `yadcf-filter-${table_selector_jq_friendly}-to-date-${column_number}`,
        filter_selector_string_tmp: string,
        filter_wrapper_id: string,
        oTable: DataTableInstance,
        columnObj: Partial<AllParameters<FilterType>>,
        datepickerObj = {},
        filterActionFn: ( arg?: any ) => any,
        $fromInput: JQuery,
        $toInput: JQuery,
        innerWrapperAdditionalClass: string = '';

    filter_wrapper_id = `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}`;

    if ( $( `#${filter_wrapper_id}` ).length > 0 ) {
      return;
    }

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    oTable = Yadcf.oTables[ table_selector_jq_friendly ];

    columnObj = Yadcf.getOptions( oTable.selector )[ column_number ];

    if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      innerWrapperAdditionalClass = 'input-daterange';
    }

    // Add a wrapper to hold both filter and reset button.
    $( filter_selector_string ).append(
      Yadcf.makeElement( '<div />', {
        onmousedown: Yadcf.stopPropagation,
        onclick: Yadcf.stopPropagation,
        id: filter_wrapper_id,
        class: 'yadcf-filter-wrapper'
      })
    );

    filter_selector_string    += ' div.yadcf-filter-wrapper';
    filter_selector_string_tmp = filter_selector_string;

    $( filter_selector_string ).append(
      Yadcf.makeElement( '<div />', {
        id: `yadcf-filter-wrapper-inner-${table_selector_jq_friendly}-${column_number}`,
        class: `yadcf-filter-wrapper-inner ${innerWrapperAdditionalClass}`
      })
    );

    filter_selector_string += ' div.yadcf-filter-wrapper-inner';

    filterActionFn = function( tableSel: string ) {
      return function( event: any ) {
        Yadcf.rangeDateKeyUP( tableSel, date_format, event );
      };
    }( table_selector_jq_friendly );

    if ( columnObj.externally_triggered === true ) {
      filterActionFn = function() {};
    }

    $( filter_selector_string ).append(
      Yadcf.makeElement( '<input />', {
        onkeydown: Yadcf.preventDefaultForEnter,
        placeholder: filter_default_label[0],
        id: fromId,
        class: `yadcf-filter-range-date yadcf-filter-range yadcf-filter-range-start ${columnObj.style_class}`,
        onkeyup: filterActionFn
      })
    );

    $( filter_selector_string ).append(
      Yadcf.makeElement( '<span />', {
        class: 'yadcf-filter-range-date-seperator'
      })
    );

    $( filter_selector_string ).append(
      Yadcf.makeElement( '<input />', {
        onkeydown: Yadcf.preventDefaultForEnter,
        placeholder: filter_default_label[1],
        id: toId,
        class: `yadcf-filter-range-date yadcf-filter-range yadcf-filter-range-end ${columnObj.style_class}`,
        onkeyup: filterActionFn
      })
    );

    $fromInput = $( `#${fromId}` );
    $toInput   = $( `#${toId}` );

    if ( filter_reset_button_text !== false ) {
      $( filter_selector_string_tmp ).append(
        Yadcf.makeElement( '<button />', {
          type: 'button',
          onmousedown: Yadcf.stopPropagation,
          onclick: function( colNo: number, tableSel: string ) {
            return function( event: JQuery.ClickEvent ) {
              Yadcf.stopPropagation( event );
              Yadcf.rangeClear( tableSel, event, colNo );
              return false;
            };
          }( column_number, table_selector_jq_friendly ),
          class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
          text: filter_reset_button_text
        })
      );
    }

    if ( columnObj.datepicker_type === 'jquery-ui' ) {
      // @ts-expect-error
      datepickerObj.dateFormat = date_format;
    } else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' ) {
      // @ts-expect-error
      datepickerObj.format = date_format;
    }

    if ( columnObj.externally_triggered !== true ) {
      if ( columnObj.datepicker_type === 'jquery-ui' ) {
        // @ts-expect-error
        datepickerObj.onSelect = dateSelect;
      }
      // for 'bootstrap-datetimepicker' its implemented below...
    }

    datepickerObj = $.extend( {}, datepickerObj, columnObj.filter_plugin_options );

    if ( columnObj.datepicker_type === 'jquery-ui' ) {
      if ( columnObj.jquery_ui_datepicker_locale ) {
        $.extend( datepickerObj, $.datepicker.regional[ columnObj.jquery_ui_datepicker_locale ] );
      }

      $fromInput.datepicker( $.extend( datepickerObj, {
        onClose: function( selectedDate: any ) {
          $toInput.datepicker( 'option', 'minDate', selectedDate );
        }
      }) );

      $toInput.datepicker( $.extend( datepickerObj, {
        onClose: function( selectedDate: any ) {
          $fromInput.datepicker( 'option', 'maxDate', selectedDate );
        }
      }) );
    }
    else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' ) {
      // @ts-expect-error
      datepickerObj.useCurrent = false;
      $fromInput.datetimepicker( datepickerObj );
      $toInput.datetimepicker( datepickerObj );

      if ( columnObj.externally_triggered !== true ) {
        $fromInput.add( $toInput ).on( 'dp.hide', Yadcf.dateSelect );
      }
    }
    else if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      if ( date_format ) {
        $.extend( datepickerObj, { format: date_format });
      }

      $fromInput.datepicker( datepickerObj ).on( 'changeDate', function( e: JQuery.TriggeredEvent ) {
        Yadcf.dateSelect( e );

        $( this ).datepicker( 'hide' );
      });

      $toInput.datepicker( datepickerObj ).on( 'changeDate', function( e: JQuery.TriggeredEvent ) {
        Yadcf.dateSelect( e );

        $( this ).datepicker( 'hide' );
      });
    }

    if ( oTable.settings()[0].oFeatures.bStateSave === true && oTable.settings()[0].oLoadedState ) {
      if (
        oTable.settings()[0].oLoadedState.yadcfState &&
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] &&
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ]
      ) {
        $( `#${fromId}` ).val( oTable.context[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from );

        if ( oTable.context[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from !== '' ) {
          $( `#${fromId}` ).addClass( 'inuse' );
        }

        $( `#${toId}` ).val( oTable.context[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to );

        if ( oTable.context[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to !== '' ) {
          $( `#${toId}` ).addClass( 'inuse' );
        }
      }
    }

    if ( oTable.context[0].oFeatures.bServerSide !== true ) {
      Yadcf.addRangeDateFilterCapability( table_selector_jq_friendly, fromId, toId, column_number, date_format );
    }

    Yadcf.resetIApiIndex();
  }

  /**
   * @see getOptions
   * @see makeElement
   * @see stopPropagation
   * @see dateKeyUP
   * @see preventDefaultForEnter
   * @see stopPropagation
   * @see dateSelectSingle
   * @see eventTargetFixUp
   * @see dateSelect
   * @see getSettingsObjFromTable
   * @see addCustomFunctionFilterCapability
   * @see resetIApiIndex
   *
   * @param filter_selector_string
   * @param table_selector_jq_friendly
   * @param column_number
   * @param filter_reset_button_text
   * @param filter_default_label
   * @param date_format
   * @returns
   */
  private static addDateFilter(
      filter_selector_string: string,
      table_selector_jq_friendly: string,
      column_number: number,
      flter_reset_button_text: FilterResetButtonText,
      filter_default_label: FilterDefaultLabel<FilterType>,
      date_format: DateFormat
  ): void {
    let dateId: string = `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
        filter_selector_string_tmp: string,
        filter_wrapper_id: string,
        oTable: DataTableInstance,
        columnObj: any,
        datepickerObj: any = {},
        filterActionFn: ( arg?: any ) => any,
        settingsDt: DataTableSettings;

    filter_wrapper_id = `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}`;

    if ( $( `#${filter_wrapper_id}` ).length > 0 ) {
      return;
    }

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];
    oTable = Yadcf.oTables[ table_selector_jq_friendly ];
    columnObj = Yadcf.getOptions( oTable.selector )[ column_number ];

    // Add a wrapper to hold both filter and reset button.
    $( filter_selector_string ).append(
      Yadcf.makeElement( '<div />', {
        onmousedown: Yadcf.stopPropagation,
        onclick: Yadcf.stopPropagation,
        id: filter_wrapper_id,
        class: 'yadcf-filter-wrapper'
      })
    );

    filter_selector_string    += ' div.yadcf-filter-wrapper';
    filter_selector_string_tmp = filter_selector_string;

    filterActionFn = function( tableSel: string ) {
      return function( event: JQuery.KeyPressEvent & KeyboardEvent ) {
        Yadcf.dateKeyUP( table_selector_jq_friendly, date_format, event );
      };
    }( table_selector_jq_friendly );

    if ( columnObj.externally_triggered === true ) {
      filterActionFn = function() {};
    }

    $( filter_selector_string ).append(
      Yadcf.makeElement( '<input />', {
        onkeydown: Yadcf.preventDefaultForEnter,
        placeholder: filter_default_label as string,
        id: dateId,
        class: `yadcf-filter-date ${columnObj.style_class}`,
        onkeyup: filterActionFn
      })
    );

    if ( filter_reset_button_text !== false ) {
      $( filter_selector_string_tmp ).append(
        Yadcf.makeElement( '<button />', {
          type: 'button',
          id: dateId + '-reset',
          onmousedown: Yadcf.stopPropagation,
          onclick: function( tableSel: string ) {
            return function( event: JQuery.ClickEvent ) {
              Yadcf.stopPropagation( event );
              Yadcf.dateSelectSingle( tableSel, Yadcf.eventTargetFixUp( event ).target, 'clear' );
              return false;
            };
          }( table_selector_jq_friendly ),
          class: `yadcf-filter-reset-button ${columnObj.reset_button_style_class}`,
          text: filter_reset_button_text
        })
      );
    }

    if ( columnObj.datepicker_type === 'jquery-ui' ) {
      datepickerObj.dateFormat = date_format;
    } else if ( columnObj.datepicker_type.indexOf( 'bootstrap' ) !== -1 || columnObj.datepicker_type === 'dt-datetime' ) {
      datepickerObj.format = date_format;
    } else if ( columnObj.datepicker_type === 'daterangepicker' ) {
      datepickerObj.locale = {};
      datepickerObj.locale.format = date_format;
    }

    if ( columnObj.externally_triggered !== true ) {
      if ( columnObj.datepicker_type === 'jquery-ui' ) {
        datepickerObj.onSelect = dateSelectSingle;
      }
    }

    datepickerObj = $.extend( {}, datepickerObj, columnObj.filter_plugin_options );

    if ( columnObj.datepicker_type === 'jquery-ui' ) {
      if ( columnObj.jquery_ui_datepicker_locale ) {
        $.extend( datepickerObj, $.datepicker.regional[ columnObj.jquery_ui_datepicker_locale ] );
      }

      $( `#${dateId}` ).datepicker( datepickerObj );
    }
    else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' ) {
      datepickerObj.useCurrent = false;

      $( `#${dateId}` ).datetimepicker( datepickerObj );

      if ( columnObj.externally_triggered !== true ) {
        if ( datepickerObj.format.toLowerCase() !== 'hh:mm' ) {
          $( `#${dateId}` ).on( 'dp.change', Yadcf.dateSelectSingle );
        } else {
          $( `#${dateId}` ).on( 'dp.hide', Yadcf.dateSelectSingle );
        }
      }
    }
    else if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      $( `#${dateId}` ).datepicker( datepickerObj ).on( 'changeDate', function( e ) {
        // @ts-ignore
        Yadcf.dateSelectSingle( e );

        $( this ).datepicker( 'hide' );
      });
    }
    else if ( columnObj.datepicker_type === 'dt-datetime' ) {
      // @ts-ignore
      new $.fn.DataTable.Editor.DateTime(
        $( `#${dateId}` ), {
          format: date_format,
          onChange: Yadcf.dateSelectSingle
        }
      );
    }
    else if ( columnObj.datepicker_type === 'daterangepicker' ) {
      // @ts-ignore
      $( `#${dateId}` ).daterangepicker( datepickerObj );
      $( `#${dateId}` ).on( 'apply.daterangepicker, hide.daterangepicker', function( ev, picker ) {
        Yadcf.dateSelect( ev, picker );
      });
    }

    if ( oTable.settings()[0].aoPreSearchCols[ column_number ].sSearch !== '' ) {
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( oTable.settings()[0].aoPreSearchCols[ column_number ].sSearch ).addClass( 'inuse' );
    }

    if ( columnObj.filter_type === 'date_custom_func' ) {
      settingsDt = Yadcf.getSettingsObjFromTable( oTable );

      if ( oTable.settings()[0].oFeatures.bStateSave === true && oTable.settings()[0].oLoadedState ) {
        if ( oTable.settings()[0].oLoadedState.yadcfState && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
          $( `#${dateId}` ).val( oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from );

          if ( oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from !== '' ) {
            $( `#${dateId}` ).addClass( 'inuse' );
          }
        }
      }

      if ( settingsDt.oFeatures.bServerSide !== true ) {
        Yadcf.addCustomFunctionFilterCapability( table_selector_jq_friendly, `yadcf-filter-${table_selector_jq_friendly}-${column_number}`, column_number );
      }
    }

    if ( columnObj.datepicker_type === 'daterangepicker' && oTable.settings()[0].oFeatures.bServerSide !== true ) {
      Yadcf.addRangeDateFilterCapability( table_selector_jq_friendly, dateId, dateId, column_number, date_format );
    }

    Yadcf.resetIApiIndex();
  }
  private static rangeNumberSldierDrawTips(
      min_tip_val: number,
      max_tip_val: number,
      min_tip_id: string,
      max_tip_id: string,
      table_selector_jq_friendly: string,
      column_number: number | string
  ): void {
    let first_handle = $( `.yadcf-number-slider-filter-wrapper-inner.-${table_selector_jq_friendly}-${column_number}` ), // + ' .ui-slider-handle:first'),
        last_handle = $( `.yadcf-number-slider-filter-wrapper-inner.-${table_selector_jq_friendly}-${column_number}` ), // + ' .ui-slider-handle:last'),
        min_tip_inner,
        max_tip_inner;

    min_tip_inner = $( '<div>', {
      id: min_tip_id,
      class: 'yadcf-filter-range-number-slider-min-tip-inner',
      text: min_tip_val
    });

    max_tip_inner = $( '<div>', {
      id: max_tip_id,
      class: 'yadcf-filter-range-number-slider-max-tip-inner',
      text: max_tip_val
    });

    if ( first_handle.length === 1 ) {
      first_handle = $( `.yadcf-number-slider-filter-wrapper-inner.-${table_selector_jq_friendly}-${column_number} .ui-slider-handle:first` );
      $( first_handle ).addClass( 'yadcf-filter-range-number-slider-min-tip' ).html( min_tip_inner );

      last_handle = $( `.yadcf-number-slider-filter-wrapper-inner.-${table_selector_jq_friendly}-${column_number} .ui-slider-handle:last` );
      $( last_handle ).addClass( 'yadcf-filter-range-number-slider-max-tip' ).html( max_tip_inner );
    } else {
      // Might happen when scrollX is used or when filter row is being duplicated by DataTables.
      $( $( first_handle )[0] ).find( '.ui-slider-handle:first' ).addClass( 'yadcf-filter-range-number-slider-min-tip' ).html( min_tip_inner );
      $( $( last_handle )[0] ).find( '.ui-slider-handle:last' ).addClass( 'yadcf-filter-range-number-slider-max-tip' ).html( max_tip_inner );

      $( $( first_handle )[1] ).find( '.ui-slider-handle:first' ).addClass( 'yadcf-filter-range-number-slider-min-tip' ).html( min_tip_inner );
      $( $( last_handle )[1] ).find( '.ui-slider-handle:last' ).addClass( 'yadcf-filter-range-number-slider-max-tip' ).html( max_tip_inner );
    }
  }

  /**
   * @see eventTargetFixUp
   * @see getSettingsObjFromTable
   * @see calcColumnNumberFilter
   * @see getOptions
   * @see resetIApiIndex
   * @see yadcfDelay
   *
   * @param table_selector_jq_friendly
   * @param event
   * @param ui
   */
  private static rangeNumberSliderChange( table_selector_jq_friendly: string, event: InputEvent, ui: Record<'values', Array<any>> ): void {
    let oTable: DataTableInstance,
        min_val: number | string,
        max_val: number | string,
        slider_inuse,
        yadcfState,
        column_number,
        columnObj,
        keyUp,
        settingsDt,
        column_number_filter;

    event         = Yadcf.eventTargetFixUp( event );
    column_number = $( event.target ).attr( 'id' ).replace( 'yadcf-filter-', '' ).replace( table_selector_jq_friendly, '' ).replace( '-slider-', '' );

    oTable               = Yadcf.oTables[ table_selector_jq_friendly ];
    settingsDt           = Yadcf.getSettingsObjFromTable( oTable );
    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, column_number, table_selector_jq_friendly );

    columnObj = Yadcf.getOptions( oTable.selector )[ column_number ];

    keyUp = function() {
      $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

      if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
        oTable.fnDraw();
      } else {
        oTable.fnFilter( ui.values[0] + columnObj.custom_range_delimiter + ui.values[1], column_number_filter );
      }

      min_val = +$( $( event.target ).parent().find( '.yadcf-filter-range-number-slider-min-tip-hidden' ) ).text();
      max_val = +$( $( event.target ).parent().find( '.yadcf-filter-range-number-slider-max-tip-hidden' ) ).text();

      if ( min_val !== ui.values[0] ) {
        $( $( event.target ).find( '.ui-slider-handle' )[0] ).addClass( 'inuse' );
        slider_inuse = true;
      } else {
        $( $( event.target ).find( '.ui-slider-handle' )[0] ).removeClass( 'inuse' );
      }

      if ( max_val !== ui.values[1] ) {
        $( $( event.target ).find( '.ui-slider-handle' )[1] ).addClass( 'inuse' );
        slider_inuse = true;
      } else {
        $( $( event.target ).find( '.ui-slider-handle' )[1] ).removeClass( 'inuse' );
      }

      if ( slider_inuse === true ) {
        $( event.target ).find( '.ui-slider-range' ).addClass( 'inuse' );
      } else {
        $( event.target ).find( '.ui-slider-range' ).removeClass( 'inuse' );
      }

      if ( !oTable.settings()[0].oLoadedState ) {
        oTable.settings()[0].oLoadedState = {};
        oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
      }

      if ( oTable.settings()[0].oFeatures.bStateSave === true ) {
        if ( oTable.settings()[0].oLoadedState.yadcfState !== undefined && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
          oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
            from: ui.values[0],
            to: ui.values[1]
          };
        } else {
          yadcfState = {};
          yadcfState[ table_selector_jq_friendly ] = [];
          yadcfState[ table_selector_jq_friendly ][ column_number ] = {
            from: ui.values[0],
            to: ui.values[1]
          };

          oTable.settings()[0].oLoadedState.yadcfState = yadcfState;
        }

        oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
      }

      Yadcf.resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      keyUp();
    } else {
      Yadcf.yadcfDelay( function() {
        keyUp();
      }, columnObj.filter_delay );
    }
  }

  /**
   * @see generateTableSelectorJQFriendly2
   * @see getOptions
   * @see makeElement
   * @see stopPropagation
   * @see rangeNumberSldierDrawTips
   * @see rangeNumberSliderChange
   * @see rangeNumberSldierDrawTips
   * @see rangeNumberSliderClear
   * @see resetIApiIndex
   * @see addRangeNumberAndSliderFilterCapability
   *
   * @param filter_selector_string
   * @param table_selector_jq_friendly
   * @param column_number
   * @param filter_reset_button_text
   * @param min_val
   * @param max_val
   * @param ignore_char
   * @returns
   */
  private static addRangeNumberSliderFilter(
    filter_selector_string: string,
    table_selector_jq_friendly: string,
    column_number: number,
    filter_reset_button_text: FilterResetButtonText,
    min_val: number | string,
    max_val: number | string,
    ignore_char: IgnoreChar
  ): void {
    $.fn.slider = jQuery.ui.slider;

    let sliderId: string   = `yadcf-filter-${table_selector_jq_friendly}-slider-${column_number}`,
        min_tip_id: string = `yadcf-filter-${table_selector_jq_friendly}-min_tip-${column_number}`,
        max_tip_id: string = `yadcf-filter-${table_selector_jq_friendly}-max_tip-${column_number}`,
        min_state_val: any = min_val,
        max_state_val: any = max_val,
        currSliderMin      = $( `#${sliderId}` ).slider( 'option', 'min' ),
        currSliderMax      = $( `#${sliderId}` ).slider( 'option', 'max' ),
        filter_selector_string_tmp: string,
        filter_wrapper_id: string,
        oTable: DataTableInstance,
        columnObj: any,
        slideFunc: ( ...args: any ) => any,
        changeFunc: ( ...args: any ) => any,
        sliderObj: any,
        sliderMaxMin: Record<'min' | 'max', number | string> = {
          min: min_val,
          max: max_val
        },
        settingsDt: DataTableSettings,
        redrawTable: boolean;

    filter_wrapper_id = `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}`;

    if ( $( `#${filter_wrapper_id}` ).length > 0 && ( currSliderMin === min_val && currSliderMax === max_val ) ) {
      return;
    }

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];
    oTable     = Yadcf.oTables[ table_selector_jq_friendly ];
    settingsDt = Yadcf.settingsMap[ Yadcf.generateTableSelectorJQFriendly2( oTable ) ];

    if ( $( `#${filter_wrapper_id}` ).length > 0 ) {
      $( `#${sliderId}` ).slider( 'destroy' );
      $( `#${filter_wrapper_id}` ).remove();
      redrawTable = true;
    }

    columnObj = Yadcf.getOptions( oTable.selector )[ column_number ];

    if ( settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState ) {
      if ( settingsDt.oLoadedState.yadcfState && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
        if ( min_val !== settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from ) {
          min_state_val = settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from;
        }

        if ( max_val !== settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to ) {
          max_state_val = settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to;
        }
      }
    }

    if ( isFinite( min_val as number ) && isFinite( max_val as number ) && isFinite( min_state_val ) && isFinite( max_state_val ) ) {
      // Add a wrapper to hold both filter and reset button.
      $( filter_selector_string ).append( Yadcf.makeElement( '<div />', {
        onmousedown: Yadcf.stopPropagation,
        onclick: Yadcf.stopPropagation,
        id: filter_wrapper_id,
        class: `yadcf-filter-wrapper ${columnObj.style_class}`
      }) );

      filter_selector_string    += ' div.yadcf-filter-wrapper';
      filter_selector_string_tmp = filter_selector_string;

      $( filter_selector_string ).append( Yadcf.makeElement( '<div />', {
        id: `yadcf-filter-wrapper-inner-${table_selector_jq_friendly}-${column_number}`,
        class: `yadcf-number-slider-filter-wrapper-inner -${table_selector_jq_friendly}-${column_number}`
      }) );

      filter_selector_string += ' div.yadcf-number-slider-filter-wrapper-inner';

      $( filter_selector_string ).append( Yadcf.makeElement( '<div />', {
        id: sliderId,
        class: 'yadcf-filter-range-number-slider'
      }) );

      filter_selector_string += ' #' + sliderId;

      $( filter_selector_string ).append( Yadcf.makeElement( '<span />', {
        class: 'yadcf-filter-range-number-slider-min-tip-hidden hide',
        text: min_val as string
      }) );

      $( filter_selector_string ).append( Yadcf.makeElement( '<span />', {
        class: 'yadcf-filter-range-number-slider-max-tip-hidden hide',
        text: max_val as string
      }) );

      if ( columnObj.externally_triggered !== true ) {
        slideFunc = function( event: any, ui: { values: Array<any>; } ) {
          Yadcf.rangeNumberSldierDrawTips( ui.values[0], ui.values[1], min_tip_id, max_tip_id, table_selector_jq_friendly, column_number );
          Yadcf.rangeNumberSliderChange( table_selector_jq_friendly, event, ui );
        };

        changeFunc = function( event: any, ui: { values: Array<any>; } ) {
          Yadcf.rangeNumberSldierDrawTips( ui.values[0], ui.values[1], min_tip_id, max_tip_id, table_selector_jq_friendly, column_number );

          if ( event.originalEvent || $( event.target ).slider( 'option', 'yadcf-reset' ) === true ) {
            $( event.target ).slider( 'option', 'yadcf-reset', false );

            Yadcf.rangeNumberSliderChange( table_selector_jq_friendly, event, ui );
          }
        };
      } else {
        slideFunc = function( event: any, ui: { values: Array<any>; } ) {
          Yadcf.rangeNumberSldierDrawTips( ui.values[0], ui.values[1], min_tip_id, max_tip_id, table_selector_jq_friendly, column_number );
        };

        changeFunc = function( event: any, ui: { values: Array<any>; } ) {
          Yadcf.rangeNumberSldierDrawTips( ui.values[0], ui.values[1], min_tip_id, max_tip_id, table_selector_jq_friendly, column_number );
        };
      }

      sliderObj = {
        range: true,
        min: min_val,
        max: max_val,
        values: [ min_state_val, max_state_val ],
        create: function( event: any, ui: { values: Array<any>; } ) {
          Yadcf.rangeNumberSldierDrawTips( min_state_val, max_state_val, min_tip_id, max_tip_id, table_selector_jq_friendly, column_number );
        },
        slide: slideFunc,
        change: changeFunc
      };

      if ( columnObj.filter_plugin_options !== undefined ) {
        $.extend( sliderObj, columnObj.filter_plugin_options );
      }

      $( `#${sliderId}` ).slider( sliderObj );

      if ( filter_reset_button_text !== false ) {
        $( filter_selector_string_tmp ).append( Yadcf.makeElement( '<button />', {
          type: 'button',
          onmousedown: Yadcf.stopPropagation,
          onclick: function( tableSel: string ) {
            return function( event: any ) {
              Yadcf.stopPropagation( event );
              Yadcf.rangeNumberSliderClear( tableSel, event );
              return false;
            };
          }( table_selector_jq_friendly ),
          class: `yadcf-filter-reset-button range-number-slider-reset-button ${columnObj.reset_button_style_class}`,
          text: filter_reset_button_text
        }) );
      }
    }

    $.fn.dataTable.ext.iApiIndex = Yadcf.oTablesIndex[ table_selector_jq_friendly ];

    oTable = Yadcf.oTables[ table_selector_jq_friendly ];

    if ( settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState ) {
      if ( settingsDt.oLoadedState.yadcfState && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
        if ( isFinite( min_val as number ) && min_val !== settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from ) {
          $( $( filter_selector_string ).find( '.ui-slider-handle' )[0] ).addClass( 'inuse' );
        }

        if ( isFinite( max_val as number ) && max_val !== settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to ) {
          $( $( filter_selector_string ).find( '.ui-slider-handle' )[1] ).addClass( 'inuse' );
        }

        if ( ( isFinite( min_val as number ) && isFinite( max_val as number ) ) && ( min_val !== settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from || max_val !== settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to ) ) {
          $( $( filter_selector_string ).find( '.ui-slider-range' ) ).addClass( 'inuse' );
        }
      }
    }

    Yadcf.resetIApiIndex();

    if ( settingsDt.oFeatures.bServerSide !== true ) {
      Yadcf.addRangeNumberAndSliderFilterCapability( table_selector_jq_friendly, min_tip_id, max_tip_id, column_number, ignore_char, sliderMaxMin );
    }

    if ( redrawTable === true ) {
      oTable.fnDraw( false );
    }
  }

  /**
   * @see getOptions
   * @see generateTableSelectorJQFriendly2
   * @see selectElementCustomDestroyFunc
   *
   * @param table_arg
   */
  private static destroyThirdPartyPlugins( table_arg: DataTableInstance ): void {
    $.fn.slider = jQuery.ui.slider;

    let tableOptions: AllParameters,
        table_selector_jq_friendly: string,
        columnObjKey: string,
        column_number: number | string,
        optionsObj: AllParameters,
        fromId: string,
        toId: string;

    // Check if the table arg is from new datatables API (capital 'D').
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[0].oInstance;
    }

    tableOptions = Yadcf.getOptions( table_arg.selector );
    table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2( table_arg );

    for ( columnObjKey in tableOptions ) {
      if ( tableOptions.hasOwnProperty( columnObjKey ) ) {
        optionsObj = tableOptions[ columnObjKey ];
        column_number = optionsObj.column_number;

        switch ( optionsObj.filter_type ) {
          case 'multi_select':
          case 'multi_select_custom_func':
          case 'select':
          case 'custom_func':
            switch ( optionsObj.select_type ) {
              case 'chosen':
                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).chosen( 'destroy' );
                break;
              case 'select2':
                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).select2( 'destroy' );
                break;
              case 'custom_select':
                if ( Yadcf.selectElementCustomDestroyFunc !== undefined ) {
                  Yadcf.selectElementCustomDestroyFunc( $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ) );
                }
                break;
            }
            break;
          case 'auto_complete':
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).autocomplete( 'destroy' );
            break;
          case 'date':
            switch ( optionsObj.select_type ) {
              case 'jquery-ui':
                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).datepicker( 'destroy' );
                break;
              case 'bootstrap-datetimepicker':
                // @ts-ignore
                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).destroy();
                break;
            }
            break;
          case 'range_date':
            fromId = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`;
            toId = `yadcf-filter-${table_selector_jq_friendly}-to-date-${column_number}`;
            switch ( optionsObj.select_type ) {
              case 'jquery-ui':
                $( `#${fromId}` ).datepicker( 'destroy' );
                $( `#${toId}` ).datepicker( 'destroy' );
                break;
              case 'bootstrap-datetimepicker':
                // @ts-ignore
                $( `#${fromId}` ).destroy();
                // @ts-ignore
                $( `#${toId}` ).destroy();
                break;
            }
            break;
          case 'range_number_slider':
            $( '#yadcf-filter-' + table_selector_jq_friendly + '-slider-' + column_number ).slider( 'destroy' );
            break;
        }
      }
    }
  }

  /**
   * @see getTableId
   * @see yadcfVersionCheck
   * @see destroyThirdPartyPlugins
   *
   * @param oTable
   */
  private static removeFilters( oTable: DataTableInstance ): void {
    const tableId = Yadcf.getTableId( oTable );

    $( '#' + tableId + ' .yadcf-filter-wrapper' ).remove();

    if (
      Yadcf.yadcfVersionCheck( '1.10' ) ||
      Yadcf.yadcfVersionCheck( '1.11' ) ||
      Yadcf.yadcfVersionCheck( '1.12' ) ||
      Yadcf.yadcfVersionCheck( '1.13' )
    ) {
      $( document ).off( 'draw.dt', oTable.selector );
      $( document ).off( 'xhr.dt', oTable.selector );
      $( document ).off( 'column-visibility.dt', oTable.selector );
      $( document ).off( 'destroy.dt', oTable.selector );
      $( document ).off( 'stateLoaded.dt', oTable.selector );
    } else {
      $( document ).off( 'draw', oTable.selector );
      $( document ).off( 'destroy', oTable.selector );
    }

    if ( $.fn.dataTable.ext.afnFiltering.length > 0 ) {
      $.fn.dataTable.ext.afnFiltering.splice( 0, $.fn.dataTable.ext.afnFiltering.length );
    }

    Yadcf.destroyThirdPartyPlugins( oTable );
  }

  /**
   * alphanum.js (C) Brian Huisman
   *
   * Based on the Alphanum Algorithm by David Koelle
   *
   * The Alphanum Algorithm is discussed at http://www.DaveKoelle.com
   */
  private static sortAlphaNum( a: { label: string } | string, b: { label: string } | string ): number {
    function chunkify( t: string ): Array<string> {
      const tz = [];

      let x: number           = 0,
          y: number           = -1,
          n: boolean | number = 0,
          i: number,
          j: number;

      while ( i = ( j = t.charAt( x++ ) ).charCodeAt( 0 ) ) {
        var m: boolean | number = ( i == 46 || ( i >= 48 && i <= 57 ) );

        if ( m !== n ) {
          tz[ ++y ] = '';
          n = m;
        }

        tz[ y ] += j;
      }

      return tz;
    }

    if ( typeof a === 'object' && typeof a.label === 'string' ) {
      a = a.label;
    }
    if ( typeof b === 'object' && typeof b.label === 'string' ) {
      b = b.label;
    }

    const aa = chunkify( (a as string).toLowerCase() );
    const bb = chunkify( (b as string).toLowerCase() );

    for ( let x = 0; aa[ x ] && bb[ x ]; x++ ) {
      if ( aa[ x ] !== bb[ x ] ) {
        const c = Number( aa[ x ] ),
              d = Number( bb[ x ] );

        if ( c.toString() == aa[ x ] && d.toString() == bb[ x ] ) {
            return c - d;
        }

        return ( aa[ x ] > bb[ x ] ) ? 1 : -1;
      }
    }

    return aa.length - bb.length;
  }

  /**
   * @see sortNumAsc
   * @see sortNumDesc
   * @see sortAlphaNum
   *
   * @param column_data
   * @param columnObj
   * @returns
   */
  private static sortColumnData( column_data: Array<any>, columnObj: AllParameters<FilterType> ): Record<string, any> {
    if ( includes( ['select', 'auto_complete', 'multi_select', 'multi_select_custom_func', 'custom_func'], columnObj.filter_type ) ) {
      if ( columnObj.sort_as === 'alpha' ) {
        if ( columnObj.sort_order === 'asc' ) {
          column_data.sort();
        }
        else if ( columnObj.sort_order === 'desc' ) {
          column_data.sort();
          column_data.reverse();
        }
      }
      else if ( columnObj.sort_as === 'num' ) {
        if ( columnObj.sort_order === 'asc' ) {
          column_data.sort( Yadcf.sortNumAsc );
        }
        else if ( columnObj.sort_order === 'desc' ) {
          column_data.sort( Yadcf.sortNumDesc );
        }
      }
      else if ( columnObj.sort_as === 'alphaNum' ) {
        if ( columnObj.sort_order === 'asc' ) {
          column_data.sort( Yadcf.sortAlphaNum );
        }
        else if ( columnObj.sort_order === 'desc' ) {
          column_data.sort( Yadcf.sortAlphaNum );
          column_data.reverse();
        }
      }
      else if ( columnObj.sort_as === 'custom' ) {
        column_data.sort( columnObj.sort_as_custom_func );
      }
    }

    return column_data;
  }

  /**
   * @see yadcfVersionCheck
   *
   * @param table
   * @returns
   */
  private static getFilteredRows( table: DataTableInstance | globalThis.DataTables.Api ): any {
    let data: Array<any> = [],
        dataTmp: Array<any>,
        i: number;

    if ( table.rows || table._ ) {
      if (
        Yadcf.yadcfVersionCheck( '1.10' ) ||
        Yadcf.yadcfVersionCheck( '1.11' ) ||
        Yadcf.yadcfVersionCheck( '1.12' ) ||
        Yadcf.yadcfVersionCheck( '1.13' )
      ) {
        dataTmp = table.rows({ search: 'applied' }).data().toArray();
      } else { // v 1.9 and below
        dataTmp = table._( 'tr', { search: 'applied' });
      }
    }

    for ( i = 0; i < dataTmp.length; i++ ) {
      data.push({ _aData: dataTmp[ i ] });
    }

    return data;
  }

  /**
   * @see getSettingsObjFromTable
   * @see getFilteredRows
   * @see calcColumnNumberFilter
   * @see dot2obj
   *
   * @param pTable
   * @param columnObj
   * @param table_selector_jq_friendly
   * @param pSettings
   * @returns
   */
  private static parseTableColumn( pTable: DataTableInstance | globalThis.DataTables.Api, columnObj: any, table_selector_jq_friendly: string, pSettings?: Api<any> ): Array<ColumnParameters<number>> {
    let col_filter_array: Record<string, any> = {},
        column_data: Array<any> = [],
        col_inner_elements: Record<string, any> | Array<any> | InstSelector | Api<any>,
        col_inner_data: any,
        col_inner_data_helper: any,
        j: number,
        k: number,
        data: Record<string, any>,
        data_length: number,
        settingsDt: DataTableSettings,
        column_number_filter: number | string;

    if ( pSettings !== undefined ) {
      settingsDt = pSettings;
    } else {
      settingsDt = Yadcf.getSettingsObjFromTable( pTable );
    }

    if ( columnObj.cumulative_filtering !== true ) {
      data        = settingsDt.aoData;
      data_length = data.length;
    } else {
      data        = Yadcf.getFilteredRows( pTable );
      data_length = data.length;
    }

    if ( columnObj.col_filter_array !== undefined ) {
      col_filter_array = columnObj.col_filter_array;
    }

    column_number_filter = Yadcf.calcColumnNumberFilter( settingsDt, columnObj.column_number, table_selector_jq_friendly );

    if ( isNaN( settingsDt.aoColumns[ column_number_filter ].mData ) && typeof settingsDt.aoColumns[ column_number_filter ].mData !== 'object' ) {
      columnObj.column_number_data = settingsDt.aoColumns[ column_number_filter ].mData;
    }

    if ( isNaN( settingsDt.aoColumns[ column_number_filter ].mRender ) && typeof settingsDt.aoColumns[ column_number_filter ].mRender !== 'object' ) {
      columnObj.column_number_render = settingsDt.aoColumns[ column_number_filter ].mRender;
    }

    for ( j = 0; j < data_length; j++ ) {
      if ( columnObj.column_data_type === 'html' )
      {
        if ( columnObj.column_number_data === undefined ) {
          col_inner_elements = $( data[ j ]._aData[ column_number_filter ] );
        }
        else {
          col_inner_elements = Yadcf.dot2obj( data[ j ]._aData, columnObj.column_number_data );
          col_inner_elements = $( col_inner_elements );
        }

        if ( (col_inner_elements as Array<any>).length > 0 )
        {
          for ( k = 0; k < (col_inner_elements as Array<any>).length; k++ ) {
            col_inner_data        = null;
            col_inner_data_helper = null;

            switch ( columnObj.html_data_type ) {
              case 'text':
                col_inner_data = $( col_inner_elements[ k ] ).text();
                break;
              case 'value':
                col_inner_data = $( col_inner_elements[ k ] ).val();
                break;
              case 'id':
                col_inner_data = col_inner_elements[ k ].id;
                break;
              case 'selector':
                const len = $( col_inner_elements[ k ] ).find( columnObj.html_data_selector ).length;

                if ( len === 1 ) {
                  col_inner_data = $( col_inner_elements[ k ] ).find( columnObj.html_data_selector ).text();
                } else if ( len > 1 ) {
                  col_inner_data_helper = $( col_inner_elements[ k ] ).find( columnObj.html_data_selector );
                }
                break;
            }

            if ( col_inner_data || col_inner_data_helper )
            {
              if ( ! col_inner_data_helper )
              {
                if ( trim( col_inner_data ) !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
                  col_filter_array[ col_inner_data ] = col_inner_data;
                  column_data.push( col_inner_data );
                }
              }
              else
              {
                col_inner_data = col_inner_data_helper;
                col_inner_data_helper.each( ( index: number ) => {
                  const elm = $( col_inner_data[ index ] ).text();

                  if ( trim( elm ) !== '' && !( col_filter_array.hasOwnProperty( elm ) ) ) {
                    col_filter_array[ elm ] = elm;
                    column_data.push( elm );
                  }
                });
              }
            }
          }
        }
        else
        {
          if ( (col_inner_elements as Api<any>).selector ) {
            col_inner_data = (col_inner_elements as Api<any>).selector;
          }
          else {
            col_inner_data = data[ j ]._aData[ column_number_filter ];
          }

          if ( trim( col_inner_data ) !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
            col_filter_array[ col_inner_data ] = col_inner_data;
            column_data.push( col_inner_data );
          }
        }
      }
      else if ( columnObj.column_data_type === 'text' )
      {
        if ( columnObj.text_data_delimiter !== undefined )
        {
          if ( columnObj.column_number_data === undefined ) {
            col_inner_elements = data[ j ]._aData[ column_number_filter ].split( columnObj.text_data_delimiter );
          }
          else {
            col_inner_elements = Yadcf.dot2obj( data[ j ]._aData, columnObj.column_number_data );
            col_inner_elements = ( col_inner_elements + '' ).split( columnObj.text_data_delimiter );
          }

          for ( k = 0; k < (col_inner_elements as Array<any>).length; k++ ) {
            col_inner_data = col_inner_elements[ k ];

            if ( trim( col_inner_data ) !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
              col_filter_array[ col_inner_data ] = col_inner_data;
              column_data.push( col_inner_data );
            }
          }
        }
        else
        {
          if ( columnObj.column_number_data === undefined ) {
            col_inner_data = data[ j ]._aData[ column_number_filter ];

            if ( col_inner_data !== null && typeof col_inner_data === 'object' ) {
              if ( columnObj.html5_data !== undefined ) {
                col_inner_data = col_inner_data[`@${columnObj.html5_data}`];
              }
              else if ( col_inner_data && col_inner_data.display ) {
                col_inner_data = col_inner_data.display;
              }
              else {
                console.log( `Warning: Looks like you have forgot to define the html5_data attribute for the ${columnObj.column_number} column` );
                return [];
              }
            }
          }
          else if ( data[ j ]._aFilterData !== undefined && data[ j ]._aFilterData !== null ) {
            col_inner_data = data[ j ]._aFilterData[ column_number_filter ];
          }
          else {
            col_inner_data = Yadcf.dot2obj( data[ j ]._aData, columnObj.column_number_data );
          }

          if ( trim( col_inner_data ) !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
            col_filter_array[ col_inner_data ] = col_inner_data;
            column_data.push( col_inner_data );
          }
        }
      }
      else if ( columnObj.column_data_type === 'rendered_html' )
      {
        if ( data[ j ]._aFilterData ) {
          col_inner_elements = data[ j ]._aFilterData[ column_number_filter ];
        } else if ( columnObj.column_data_render ) {
          col_inner_elements = columnObj.column_data_render( data[ j ]._aData );
        } else {
          console.log( `Looks like you missing 'column_data_render' function for the column ${column_number_filter}` );
        }

        if ( typeof col_inner_elements !== 'string' ) {
          col_inner_elements = $( col_inner_elements );

          if ( (col_inner_elements as Array<any>).length > 0 ) {
            for ( k = 0; k < (col_inner_elements as Array<any>).length; k++ ) {
              switch ( columnObj.html_data_type ) {
                case 'text':
                  col_inner_data = $( col_inner_elements[ k ] ).text();
                  break;
                case 'value':
                  col_inner_data = $( col_inner_elements[ k ] ).val();
                  break;
                case 'id':
                  col_inner_data = col_inner_elements[ k ].id;
                  break;
                case 'selector':
                  col_inner_data = $( col_inner_elements[ k ] ).find( columnObj.html_data_selector ).text();
                  break;
              }
            }
          } else {
            col_inner_data = (col_inner_elements as Record<string, any>).selector;
          }
        } else {
          col_inner_data = col_inner_elements;
        }

        if ( columnObj.text_data_delimiter !== undefined ) {
          col_inner_elements = (col_inner_elements as string).split( columnObj.text_data_delimiter );

          for ( k = 0; k < col_inner_elements.length; k++ ) {
            col_inner_data = col_inner_elements[ k ];

            if ( trim( col_inner_data ) !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
              col_filter_array[ col_inner_data ] = col_inner_data;
              column_data.push( col_inner_data );
            }
          }
        } else {
          if ( trim( col_inner_data ) !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
            col_filter_array[ col_inner_data ] = col_inner_data;
            column_data.push( col_inner_data );
          }
        }
      }
      else if ( columnObj.column_data_type === 'html5_data_complex' )
      {
        col_inner_data        = data[ j ]._aData[ column_number_filter ];
        col_inner_data_helper = col_inner_data[ '@' + columnObj.html5_data ];

        if ( !col_filter_array.hasOwnProperty( col_inner_data_helper ) ) {
          col_filter_array[ col_inner_data_helper ] = col_inner_data_helper;
          column_data.push({
            value: col_inner_data_helper,
            label: col_inner_data.display
          });
        }
      }
    }

    columnObj.col_filter_array = col_filter_array;

    if ( column_data && columnObj.ignore_char !== undefined ) {
      column_data = column_data.map( element => element.toString().replace( columnObj.ignore_char, '' ) );
    }

    return column_data;
  }

  /**
   * Make element to add to DOM.
   *
   * @since 0.0.1
   * @static
   *
   * @param element
   * @param opts
   *
   * @returns jQuery node.
   */
  private static makeElement( element: string, opts: MakeElementAttrs ): JQuery | globalThis.JQuery {
    /* Wrap making an element so all event handlers are dynamically bound. */
    const onclick     = opts.onclick;
    const onkeyup     = opts.onkeyup;
    const onmousedown = opts.onmousedown;
    const onkeydown   = opts.onkeydown;
    const onchange    = opts.onchange;

    delete opts.onclick;
    delete opts.onkeyup;
    delete opts.onmousedown;
    delete opts.onkeydown;
    delete opts.onchange;

    const $el = $( element, opts );

    if ( onclick ) { $el.on( 'click', onclick ); }
    if ( onkeyup ) { $el.on( 'keyup', onkeyup ); }
    if ( onkeydown ) { $el.on( 'keydown', onkeydown ); }
    if ( onmousedown ) { $el.on( 'mousedown', onmousedown ); }
    if ( onchange ) { $el.on( 'change', onchange ); }

    return $el;
  }

  /**
   * @see addCustomFunctionFilterCapability
   * @see addDateFilter
   * @see addNullFilterCapability
   * @see addRangeNumberFilter
   * @see addRangeNumberSliderFilter
   * @see addRangeDateFilter
   * @see autocompleteKeyUP
   * @see autocompleteSelect
   * @see doFilter
   * @see doFilterAutocomplete
   * @see doFilterCustomDateFunc
   * @see doFilterMultiSelect
   * @see escapeRegExp
   * @see initColReorder2
   * @see findMaxInArray
   * @see findMinInArray
   * @see generateTableSelectorJQFriendlyNew
   * @see generateTableSelectorJQFriendly2
   * @see getOptions
   * @see getProp
   * @see getSettingsObjFromTable
   * @see getTableId
   * @see initializeSelectPlugin
   * @see loadFromStateSaveTextFilter
   * @see makeElement
   * @see nullChecked
   * @see parseTableColumn
   * @see preventDefaultForEnter
   * @see refreshSelectPlugin
   * @see scrollXYHandler
   * @see setProp
   * @see sortColumnData
   * @see stopPropagation
   * @see textKeyUP
   * @see yadcfParseMatchFilter
   * @see yadcfParseMatchFilterMultiSelect
   *
   * @param oTable
   * @param args
   * @param table_selector
   * @param pSettings
   * @returns
   */
  private static appendFilters( oTable: DataTableInstance, args: AllParameters<FilterType>, table_selector: DomSelector, pSettings?: Api<any> ) {
    let $filter_selector: JQuery,
        filter_selector_string: string,
        data: any,
        filter_container_id: string,
        column_number_data: any,
        column_number: number | string,
        column_position: number,
        filter_default_label: FilterDefaultLabel<FilterType>,
        filter_reset_button_text: FilterResetButtonText,
        enable_auto_complete: boolean,
        date_format: DateFormat,
        ignore_char: IgnoreChar,
        filter_match_mode: FilterMatchMode,
        column_data: any,
        column_data_temp: any,
        options_tmp: Record<string, any>,
        ii: number,
        table_selector_jq_friendly: string,
        min_val: number,
        max_val: number,
        col_num_visible: number | Array<number>,
        col_num_visible_iter: number,
        tmpStr: any,
        columnObjKey: string,
        columnObj: AllParameters<FilterType>,
        filters_position: string,
        unique_th: HTMLElement | undefined,
        settingsDt: DataTableSettings,
        filterActionFn: ( ...args: any ) => any,
        custom_func_filter_value_holder: any,
        exclude_str: JQuery,
        regex_str: JQuery,
        null_str: JQuery,
        externally_triggered_checkboxes_text: AllParameters<FilterType>['externally_triggered_checkboxes_text'],
        externally_triggered_checkboxes_function: AllParameters<FilterType>['externally_triggered_checkboxes_function'];

    if ( pSettings === undefined ) {
      const _settings = Yadcf.getSettingsObjFromTable( oTable );

      settingsDt = _settings;
      console.log( 'appendFilters', settingsDt );
    } else {
      settingsDt = pSettings;
      console.log( 'appendFilters.pSettings', settingsDt );
    }

    Yadcf.settingsMap[ Yadcf.generateTableSelectorJQFriendly2( oTable ) ] = settingsDt;

    table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2( oTable );

    Yadcf.initColReorder2( settingsDt, table_selector_jq_friendly );

    filters_position = $( document ).data( `${table_selector}_filters_position` ) as string;

    if ( settingsDt.oScroll.sX !== '' || settingsDt.oScroll.sY !== '' ) {
      table_selector = `.yadcf-datatables-table-${table_selector_jq_friendly}`;

      if ( $( table_selector ).length === 0 ) {
        Yadcf.scrollXYHandler( oTable, `#${Yadcf.getTableId( oTable )}` );
      }
    }

    if ( typeof settingsDt._fnGetUniqueThs === 'undefined' ) {
      /**
       * Get an array of unique th elements, one for each column.
       *
       * @param {object} oSettings DataTables settings object
       * @param {node}   nHeader   Automatically detect the layout from this node - optional
       * @param {array}  aLayout   THead/TFoot layout from _fnDetectHeader - optional
       * @returns array {node} aReturn list of unique th's
       */
      settingsDt._fnGetUniqueThs = function( oSettings: DataTableSettings, nHeader: HTMLTableCellElement, aLayout: Array<Array<any>> ) {
        var aReturn: Array<any> = [];

        if ( !aLayout ) {
          aLayout = oSettings.aoHeader;

          if ( nHeader ) {
            aLayout = [];
            _fnDetectHeader( aLayout, nHeader );
          }
        }

        for ( var i = 0, iLen = aLayout.length; i < iLen; i++ ) {
          for ( var j = 0, jLen = aLayout[i].length; j < jLen; j++ ) {
            if ( aLayout[i][j].unique && (!aReturn[j] || !oSettings.bSortCellsTop) ) {
              aReturn[j] = aLayout[i][j].cell;
            }
          }
        }

        return aReturn;
      };

      /**
       * Use the DOM source to create up an array of header cells. The idea here is to
       * create a layout grid (array) of rows x columns, which contains a reference
       * to the cell that that point in the grid (regardless of col/rowspan), such that
       * any column / row could be removed and the new grid constructed
       *  @param array {object} aLayout Array to store the calculated layout in
       *  @param {node} nThead The header/footer element for the table
       *  @memberof DataTable#oApi
       */
      function _fnDetectHeader ( aLayout: any, nThead: HTMLTableCellElement ) {
        var nTrs = $(nThead).children('tr');
        var nTr, nCell;
        var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
        var bUnique;
        var fnShiftCol = function ( a, i, j ) {
          var k = a[i];
                      while ( k[j] ) {
            j++;
          }
          return j;
        };

        aLayout.splice( 0, aLayout.length );

        /* We know how many rows there are in the layout - so prep it */
        for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
        {
          aLayout.push( [] );
        }

        /* Calculate a layout array */
        for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
        {
          nTr = nTrs[i];
          iColumn = 0;

          /* For every cell in the row... */
          nCell = nTr.firstChild;
          while ( nCell ) {
            if ( nCell.nodeName.toUpperCase() == "TD" ||
                nCell.nodeName.toUpperCase() == "TH" )
            {
              /* Get the col and rowspan attributes from the DOM and sanitise them */
              iColspan = nCell.getAttribute('colspan') * 1;
              iRowspan = nCell.getAttribute('rowspan') * 1;
              iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
              iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;

              /* There might be colspan cells already in this row, so shift our target
              * accordingly
              */
              iColShifted = fnShiftCol( aLayout, i, iColumn );

              /* Cache calculation for unique columns */
              bUnique = iColspan === 1 ? true : false;

              /* If there is col / rowspan, copy the information into the layout grid */
              for ( l=0 ; l<iColspan ; l++ )
              {
                for ( k=0 ; k<iRowspan ; k++ )
                {
                  aLayout[i+k][iColShifted+l] = {
                    "cell": nCell,
                    "unique": bUnique
                  };
                  aLayout[i+k].nTr = nTr;
                }
              }
            }
            nCell = nCell.nextSibling;
          }
        }
      }
    }

    unique_th = settingsDt._fnGetUniqueThs( settingsDt );

    for ( columnObjKey in args ) {
      if ( args.hasOwnProperty( columnObjKey ) ) {
        columnObj           = args[ columnObjKey ];
        options_tmp         = $();
        tmpStr              = '';
        data                = columnObj.data;
        column_data         = [];
        column_data_temp    = [];
        filter_container_id = columnObj.filter_container_id;
        column_number       = columnObj.column_number;
        column_number       = +column_number;
        column_position     = column_number;

        if (
          Yadcf.plugins[ table_selector_jq_friendly ] !== undefined &&
          (
            Yadcf.plugins[ table_selector_jq_friendly ] !== undefined &&
            Yadcf.plugins[ table_selector_jq_friendly ].ColReorder !== undefined
          )
        ) {
          column_position = Yadcf.plugins[ table_selector_jq_friendly ].ColReorder[ column_number ];
        }

        columnObj.column_number = column_number;
        column_number_data      = undefined;

        if (
          isNaN( settingsDt.aoColumns[ column_position ].mData ) &&
          ( typeof settingsDt.aoColumns[ column_position ].mData !== 'object' )
        ) {
          column_number_data           = settingsDt.aoColumns[ column_position ].mData;
          columnObj.column_number_data = column_number_data;
        } else if (
          settingsDt.aoColumns[ column_position ].mData &&
          settingsDt.aoColumns[ column_position ].mData.filter
        ) {
          column_number_data           = settingsDt.aoColumns[ column_position ].mData.filter;
          columnObj.column_number_data = column_number_data;
        }

        if (
          isNaN( settingsDt.aoColumns[ column_position ].mRender ) &&
          typeof settingsDt.aoColumns[ column_position ].mRender !== 'object'
        ) {
          columnObj.column_number_render = settingsDt.aoColumns[ column_position ].mRender;
        }

        filter_default_label                     = columnObj.filter_default_label;
        filter_reset_button_text                 = columnObj.filter_reset_button_text;
        externally_triggered_checkboxes_text     = columnObj.externally_triggered_checkboxes_text;
        externally_triggered_checkboxes_function = columnObj.externally_triggered_checkboxes_function;
        enable_auto_complete                     = columnObj.enable_auto_complete;
        date_format                              = columnObj.date_format;

        if ( columnObj.datepicker_type === 'jquery-ui' ) {
          date_format = ( date_format !== 'yyyy-mm-dd' ) ? date_format.replace( 'yyyy', 'yy' ) as DateFormat : date_format;
        }

        if (
          columnObj.datepicker_type === 'bootstrap-datetimepicker' &&
          columnObj.filter_plugin_options !== undefined &&
          columnObj.filter_plugin_options.format !== undefined
        ) {
          date_format = columnObj.filter_plugin_options.format;
        }

        columnObj.date_format = date_format;

        if ( columnObj.ignore_char !== undefined && !( columnObj.ignore_char instanceof RegExp ) ) {
          ignore_char           = new RegExp( columnObj.ignore_char, 'g' );
          columnObj.ignore_char = ignore_char;
        }

        filter_match_mode = columnObj.filter_match_mode;

        if ( column_number === undefined ) {
          alert( 'You must specify column number' );
          return;
        }

        if ( enable_auto_complete === true ) {
          columnObj.filter_type = 'auto_complete';
        }

        if ( filter_default_label === undefined ) {
          if ( columnObj.filter_type === 'select' || columnObj.filter_type === 'custom_func' ) {
            filter_default_label = Yadcf.default_options.language.select;
          } else if ( columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'multi_select_custom_func' ) {
            filter_default_label = Yadcf.default_options.language.select_multi;
          } else if ( columnObj.filter_type === 'auto_complete' || columnObj.filter_type === 'text' ) {
            filter_default_label = Yadcf.default_options.language.filter;
          } else if ( columnObj.filter_type === 'range_number' || columnObj.filter_type === 'range_date' ) {
            filter_default_label = Yadcf.default_options.language.range;
          } else if ( columnObj.filter_type === 'date' || columnObj.filter_type === 'date_custom_func' ) {
            filter_default_label = Yadcf.default_options.language.date;
          }
          columnObj.filter_default_label = filter_default_label;
        }

        if ( filter_reset_button_text === undefined ) {
          filter_reset_button_text = 'x';
        }

        if ( data !== undefined ) {
          for ( ii = 0; ii < data.length; ii++ ) {
            column_data.push( data[ ii ] );
          }
        }

        if ( data === undefined || columnObj.append_data_to_table_data !== undefined ) {
          columnObj.col_filter_array = undefined;
          column_data_temp           = Yadcf.parseTableColumn( oTable, columnObj, table_selector_jq_friendly, settingsDt );

          if ( columnObj.append_data_to_table_data !== 'before' ) {
            column_data = column_data.concat( column_data_temp );
          } else {
            column_data_temp = Yadcf.sortColumnData( column_data_temp, columnObj );
            column_data = column_data.concat( column_data_temp );
          }
        }

        if ( columnObj.append_data_to_table_data === undefined || columnObj.append_data_to_table_data === 'sorted' ) {
          column_data = Yadcf.sortColumnData( column_data, columnObj );
        }

        if ( columnObj.filter_type === 'range_number_slider' ) {
          let column_data_render: Array<ColumnDataRender>;

          if ( columnObj.column_number_render ) {
            column_data_render = $.extend( true, [], column_data );

            column_data_render.forEach( ( data, index ) => {
              const meta = {
                row: index,
                col: columnObj.column_number,
                settings: settingsDt
              };

              const indexData = columnObj.column_number_data ? columnObj.column_number_data : index;

              if ( typeof indexData === 'string' && typeof column_data_render === 'object' ) {
                const cellDataRender = columnObj.column_number_render( Yadcf.getProp( column_data_render, indexData ), 'filter', column_data, meta );
                Yadcf.setProp( column_data_render, indexData, ( cellDataRender !== undefined && cellDataRender !== null ) ? cellDataRender : Yadcf.getProp( column_data, indexData ) );
              } else {
                const cellDataRender = columnObj.column_number_render( column_data_render[ indexData ], 'filter', column_data, meta );
                column_data_render[ indexData ] = ( cellDataRender !== undefined && cellDataRender !== null ) ? cellDataRender : column_data[ indexData ];
              }
            });
          }

          min_val = Yadcf.findMinInArray( column_data_render ? column_data_render : column_data, columnObj );
          max_val = Yadcf.findMaxInArray( column_data_render ? column_data_render : column_data, columnObj );
        }

        if ( filter_container_id === undefined && columnObj.filter_container_selector === undefined ) {
          // Can't show filter inside a column for a hidden one (place it outside using filter_container_id)
          if ( settingsDt.aoColumns[ column_position ].bVisible === false ) {
            // console.log('Yadcf warning: Can\'t show filter inside a column N#' + column_number + ' for a hidden one (place it outside using filter_container_id)');
            continue;
          }

          if ( filters_position !== 'thead' ) {
            if ( unique_th === undefined ) {
              // Handle hidden columns.
              col_num_visible = column_position;

              for ( col_num_visible_iter = 0; col_num_visible_iter < settingsDt.aoColumns.length && col_num_visible_iter < column_position; col_num_visible_iter++ ) {
                if ( settingsDt.aoColumns[ col_num_visible_iter ].bVisible === false ) {
                  col_num_visible--;
                }
              }

              column_position        = col_num_visible;
              filter_selector_string = table_selector + ' ' + filters_position + ' th:eq(' + column_position + ')';
            } else {
              filter_selector_string = table_selector + ' ' + filters_position + ' th:eq(' + $( unique_th[ column_position ] ).index() + ')';
            }
          } else {
            if ( columnObj.filters_tr_index === undefined ) {
              filter_selector_string = table_selector + ' ' + filters_position + ' tr:eq(' + $( unique_th[ column_position ] ).parent().index() + ') th:eq(' + $( unique_th[ column_position ] ).index() + ')';
            } else {
              filter_selector_string = table_selector + ' ' + filters_position + ' tr:eq(' + columnObj.filters_tr_index + ') th:eq(' + $( unique_th[ column_position ] ).index() + ')';
            }
          }

          $filter_selector = $( filter_selector_string ).find( '.yadcf-filter' );

          if ( columnObj.select_type === 'select2' || columnObj.select_type === 'custom_select' ) {
            $filter_selector = $( filter_selector_string ).find( 'select.yadcf-filter' );
          }
        } else {
          if ( filter_container_id !== undefined ) {
            columnObj.filter_container_selector = '#' + filter_container_id;
          }

          if ( $( columnObj.filter_container_selector ).length === 0 ) {
            console.log( 'ERROR: Filter container could not be found, columnObj.filter_container_selector: ' + columnObj.filter_container_selector );
            continue;
          }

          filter_selector_string = columnObj.filter_container_selector;

          $filter_selector = $( filter_selector_string ).find( '.yadcf-filter' );

          if ( columnObj.select_type === 'select2' || columnObj.select_type === 'custom_select' ) {
            $filter_selector = $( filter_selector_string ).find( 'select.yadcf-filter' );
          }
        }

        if ( includes( ['select', 'custom_func', 'multi_select', 'multi_select_custom_func'], columnObj.filter_type ) ) {
          if ( columnObj.data_as_is !== true ) {
            if ( columnObj.omit_default_label !== true ) {
              if ( columnObj.filter_type === 'select' || columnObj.filter_type === 'custom_func' ) {
                options_tmp = $( '<option>', {
                  value: '-1',
                  text: filter_default_label
                });

                if ( columnObj.select_type === 'select2' && (columnObj.select_type_options as Select2.Options).placeholder !== undefined && (columnObj.select_type_options as Select2.Options).allowClear === true ) {
                  options_tmp = $( '<option>', {
                    value: ''
                  });
                }
              } else if ( columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'multi_select_custom_func' ) {
                if ( columnObj.select_type === undefined ) {
                  options_tmp = $( '<option>', {
                    'data-placeholder': 'true',
                    value: '-1',
                    text: filter_default_label
                  });
                } else {
                  options_tmp = $();
                }
              }
            }

            if ( columnObj.append_data_to_table_data === undefined ) {
              if ( typeof column_data[0] === 'object' ) {
                for ( ii = 0; ii < column_data.length; ii++ ) {
                  options_tmp = options_tmp.add( $( '<option>', {
                    value: column_data[ ii ].value,
                    text: column_data[ ii ].label
                  }) );
                }
              } else {
                for ( ii = 0; ii < column_data.length; ii++ ) {
                  options_tmp = options_tmp.add( $( '<option>', {
                    value: column_data[ ii ],
                    text: column_data[ ii ]
                  }) );
                }
              }
            } else {
              for ( ii = 0; ii < column_data.length; ii++ ) {
                if ( typeof column_data[ ii ] === 'object' ) {
                  options_tmp = options_tmp.add(
                    $( '<option>', {
                      value: column_data[ ii ].value,
                      text: column_data[ ii ].label
                    })
                  );
                } else {
                  options_tmp = options_tmp.add(
                    $( '<option>', {
                      value: column_data[ ii ],
                      text: column_data[ ii ]
                    })
                  );
                }
              }
            }
          } else {
            options_tmp = columnObj.data;
          }

          column_data = options_tmp;
        }

        if ( $filter_selector.length === 1 ) {
          if ( includes( ['select', 'custom_func', 'multi_select', 'multi_select_custom_func'], columnObj.filter_type ) ) {
            if ( columnObj.filter_type === 'custom_func' || columnObj.filter_type === 'multi_select_custom_func' ) {
              custom_func_filter_value_holder = $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val();
            }

            if ( !columnObj.select_type_options || !columnObj.select_type_options.ajax ) {
              $filter_selector.empty();
              $filter_selector.append( column_data );

              if ( settingsDt.aoPreSearchCols[ column_position ].sSearch !== '' ) {
                tmpStr = settingsDt.aoPreSearchCols[ column_position ].sSearch;

                if ( columnObj.filter_type === 'select' ) {
                  tmpStr = Yadcf.yadcfParseMatchFilter( tmpStr, Yadcf.getOptions( oTable.selector )[ column_number ].filter_match_mode );

                  let foundEntry = $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + ' option' ).filter( function() {
                    return $( this ).val() === tmpStr;
                  }).prop( 'selected', true );

                  if ( foundEntry && foundEntry.length > 0 ) {
                    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );
                  }
                } else if ( columnObj.filter_type === 'multi_select' ) {
                  tmpStr = Yadcf.yadcfParseMatchFilterMultiSelect( tmpStr, Yadcf.getOptions( oTable.selector )[ column_number ].filter_match_mode );
                  tmpStr = (tmpStr as string).replace( /\\/g, '' );
                  tmpStr = (tmpStr as string).split( '|' );

                  $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr );
                }
              }
            }

            if ( columnObj.filter_type === 'custom_func' || columnObj.filter_type === 'multi_select_custom_func' ) {
              tmpStr = custom_func_filter_value_holder;

              if ( tmpStr === '-1' || tmpStr === undefined ) {
                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr );
              } else {
                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr ).addClass( 'inuse' );
              }
            }

            Yadcf.initializeSelectPlugin( columnObj.select_type, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), columnObj.select_type_options );

            if ( columnObj.cumulative_filtering === true && columnObj.select_type === 'chosen' ) {
              Yadcf.refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ) );
            }
          } else if ( columnObj.filter_type === 'auto_complete' ) {
            $( document ).data( `yadcf-filter-${table_selector_jq_friendly}-${column_number}`, column_data );
          }
        } else {
          if ( filter_container_id === undefined && columnObj.filter_container_selector === undefined ) {
            if ( $( filter_selector_string + ' div.DataTables_sort_wrapper' ).length > 0 ) {
              $( filter_selector_string + ' div.DataTables_sort_wrapper' ).css( 'display', 'inline-block' );
            }
          } else {
            if ( filter_container_id !== undefined ) {
              columnObj.filter_container_selector = '#' + filter_container_id;
            }

            if ( $( '#yadcf-filter-wrapper-' + Yadcf.generateTableSelectorJQFriendlyNew( columnObj.filter_container_selector ) ).length === 0 ) {
              $( columnObj.filter_container_selector ).append( Yadcf.makeElement( '<div />', {
                id: 'yadcf-filter-wrapper-' + Yadcf.generateTableSelectorJQFriendlyNew( columnObj.filter_container_selector )
              }) );
            }

            filter_selector_string = '#yadcf-filter-wrapper-' + Yadcf.generateTableSelectorJQFriendlyNew( columnObj.filter_container_selector );
          }

          if ( columnObj.filter_type === 'select' || columnObj.filter_type === 'custom_func' ) {
            // Add a wrapper to hold both filter and reset button.
            $( filter_selector_string ).append(
              Yadcf.makeElement( '<div />', {
                id: `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}`,
                class: 'yadcf-filter-wrapper'
              })
            );

            filter_selector_string += ' div.yadcf-filter-wrapper';

            if ( columnObj.filter_type === 'select' ) {
              filterActionFn = function( colNo: number, tableSel: string ) {
                return function( event ) {
                  Yadcf.doFilter( this, tableSel, colNo, filter_match_mode );
                };
              }( column_number, table_selector_jq_friendly );

              if ( columnObj.externally_triggered === true ) {
                filterActionFn = function() {};
              }

              $( filter_selector_string ).append(
                Yadcf.makeElement( '<select>', {
                  id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
                  class: `yadcf-filter ${columnObj.style_class}`,
                  onchange: filterActionFn,
                  onkeydown: Yadcf.preventDefaultForEnter,
                  onmousedown: Yadcf.stopPropagation,
                  onclick: Yadcf.stopPropagation,
                  html: column_data
                })
              );

              if ( filter_reset_button_text !== false ) {
                $( filter_selector_string ).find( '.yadcf-filter' ).after(
                  Yadcf.makeElement( '<button />', {
                    type: 'button',
                    id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '-reset',
                    onmousedown: Yadcf.stopPropagation,
                    onclick: function( colNo, tableSel ) {
                      return function( event ) {
                        Yadcf.doFilter( 'clear', tableSel, colNo );
                        return false;
                      }
                    }( column_number, table_selector_jq_friendly ),
                    class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                    text: filter_reset_button_text
                  })
                );
              }

              if (
                columnObj.externally_triggered_checkboxes_text &&
                typeof columnObj.externally_triggered_checkboxes_function === 'function'
              ) {
                $( filter_selector_string ).append(
                  Yadcf.makeElement( '<button />', {
                    type: 'button',
                    id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '-externally_triggered_checkboxes-button',
                    onmousedown: Yadcf.stopPropagation,
                    onclick: Yadcf.stopPropagation,
                    class: `yadcf-filter-externally_triggered_checkboxes-button ${columnObj.externally_triggered_checkboxes_button_style_class}`,
                    text: columnObj.externally_triggered_checkboxes_text
                  })
                );

                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}-externally_triggered_checkboxes-button` ).on( 'click', columnObj.externally_triggered_checkboxes_function );
              }

              exclude_str = $();

              if ( columnObj.exclude === true ) {
                exclude_str = Yadcf.makeElement( '<div />', {
                  class: 'yadcf-exclude-wrapper',
                  onmousedown: Yadcf.stopPropagation,
                  onclick: Yadcf.stopPropagation
                })
                .append(
                  Yadcf.makeElement( '<span />', {
                    class: 'yadcf-label small',
                    text: columnObj.exclude_label
                  })
                )
                .append(
                  Yadcf.makeElement( '<input />', {
                    type: 'checkbox',
                    title: columnObj.exclude_label,
                    onclick: function( colNo, tableSel ) {
                      return function( event ) {
                        Yadcf.stopPropagation( event );
                        Yadcf.doFilter( 'exclude', tableSel, colNo, filter_match_mode );
                      };
                    }( column_number, table_selector_jq_friendly )
                  })
                );
              }

              if ( columnObj.checkbox_position_after ) {
                exclude_str.addClass( 'after' );

                $( filter_selector_string ).append( exclude_str );
              } else {
                $( filter_selector_string ).prepend( exclude_str );
              }

              // Hide on load.
              if (
                columnObj.externally_triggered_checkboxes_text &&
                typeof columnObj.externally_triggered_checkboxes_function === 'function'
              ) {
                const sel = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` );

                sel.find( '.yadcf-exclude-wrapper' ).hide();
              }
            } else {
              filterActionFn = function( colNo: number, tableSel: string ) {
                return function( event: JQuery.Event ) {
                  Yadcf.doFilterCustomDateFunc( this, tableSel, colNo );
                }
              }( column_number, table_selector_jq_friendly );

              if ( columnObj.externally_triggered === true ) {
                filterActionFn = function() {};
              }

              $( filter_selector_string ).append(
                Yadcf.makeElement( '<select>', {
                  id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
                  class: `yadcf-filter ${columnObj.style_class}`,
                  onchange: filterActionFn,
                  onkeydown: Yadcf.preventDefaultForEnter,
                  onmousedown: Yadcf.stopPropagation,
                  onclick: Yadcf.stopPropagation,
                  html: column_data
                })
              );

              if ( filter_reset_button_text !== false ) {
                $( filter_selector_string ).find( '.yadcf-filter' ).after(
                  Yadcf.makeElement( '<button />', {
                    type: 'button',
                    onmousedown: Yadcf.stopPropagation,
                    onclick: function( colNo: number, tableSel: string ) {
                      return function( event: JQuery.Event ) {
                        Yadcf.stopPropagation( event );
                        Yadcf.doFilterCustomDateFunc( 'clear', tableSel, colNo );
                        return false;
                      };
                    }( column_number, table_selector_jq_friendly ),
                    class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                    text: filter_reset_button_text
                  })
                );
              }

              if (
                settingsDt.oFeatures.bStateSave === true &&
                settingsDt.oLoadedState
              ) {
                if (
                  settingsDt.oLoadedState.yadcfState &&
                  settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] &&
                  settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ]
                ) {
                  tmpStr = settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from;

                  if ( tmpStr === '-1' || tmpStr === undefined ) {
                    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr );
                  } else {
                    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr ).addClass( 'inuse' );
                  }
                }
              }

              if ( settingsDt.oFeatures.bServerSide !== true ) {
                Yadcf.addCustomFunctionFilterCapability( table_selector_jq_friendly, `yadcf-filter-${table_selector_jq_friendly}-${column_number}`, column_number );
              }
            }

            if ( settingsDt.aoPreSearchCols[ column_position ].sSearch !== '' ) {
              tmpStr = settingsDt.aoPreSearchCols[ column_position ].sSearch;
              tmpStr = Yadcf.yadcfParseMatchFilter( tmpStr, Yadcf.getOptions( oTable.selector )[ column_number ].filter_match_mode );

              const match_mode = Yadcf.getOptions( oTable.selector )[ column_number ].filter_match_mode;

              let null_str        = columnObj.select_null_option;
              let excludeStrStart = '^((?!';
              let excludeStrEnd   = ').)*$';

              switch ( match_mode ) {
                case 'exact':
                  null_str        = '^' + Yadcf.escapeRegExp( null_str ) + '$';
                  excludeStrStart = '((?!^';
                  excludeStrEnd   = '$).)*';
                  break;
                case 'startsWith':
                  null_str        = '^' + Yadcf.escapeRegExp( null_str );
                  excludeStrStart = '((?!^';
                  excludeStrEnd   = ').)*$';
                  break;
                default:
                  break;
              }

              null_str = '^((?!' + null_str + ').)*$';
              null_str = Yadcf.yadcfParseMatchFilter( null_str, Yadcf.getOptions( oTable.selector )[ column_number ].filter_match_mode );

              let exclude = false;

              // Null with exclude selected.
              if ( null_str === tmpStr ) {
                exclude = true;
                tmpStr  = columnObj.select_null_option;
              } else if ( tmpStr && tmpStr.includes( excludeStrStart ) && tmpStr.includes( excludeStrEnd ) ) {
                exclude = true;
                tmpStr  = tmpStr.replace( excludeStrStart, '' );
                tmpStr  = tmpStr.replace( excludeStrEnd, '' );
              }

              let filter = $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` );

              tmpStr = Yadcf.escapeRegExp( tmpStr );

              let optionExists = filter.find( `option[value="${tmpStr}"]` ).length === 1;

              // Set the state preselected value only if the option exists in the select dropdown.
              if ( optionExists ) {
                filter.val( tmpStr ).addClass( 'inuse' );

                if ( exclude ) {
                  $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-exclude-wrapper' ).find( ':checkbox' ).prop( 'checked', true );
                  $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val`, tmpStr );
                  Yadcf.refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), tmpStr );
                }

                if (
                  tmpStr === columnObj.select_null_option &&
                  settingsDt.oFeatures.bServerSide === false
                ) {
                  oTable.fnFilter( '', column_number );

                  Yadcf.addNullFilterCapability( table_selector_jq_friendly, column_number, true );

                  oTable.fnDraw();

                  $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val`, tmpStr );

                  Yadcf.refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), tmpStr );
                }
              }
            }

            if ( columnObj.select_type !== undefined ) {
              Yadcf.initializeSelectPlugin( columnObj.select_type, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), columnObj.select_type_options );

              if ( columnObj.cumulative_filtering === true && columnObj.select_type === 'chosen' ) {
                Yadcf.refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ) );
              }
            }
          } else if ( columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'multi_select_custom_func' ) {
            // Add a wrapper to hold both filter and reset button.
            $( filter_selector_string ).append(
              Yadcf.makeElement( '<div />', {
                id: `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}`,
                class: 'yadcf-filter-wrapper'
              })
            );

            filter_selector_string += ' div.yadcf-filter-wrapper';

            if ( columnObj.filter_type === 'multi_select' ) {
              filterActionFn = function( colNo: number, tableSel: string ) {
                return function( event: JQuery.Event ) {
                  Yadcf.doFilterMultiSelect( this, tableSel, colNo, filter_match_mode );
                };
              }( column_number, table_selector_jq_friendly );

              if ( columnObj.externally_triggered === true ) {
                filterActionFn = function() {};
              }

              $( filter_selector_string ).append(
                Yadcf.makeElement( '<select>', {
                  multiple: true,
                  'data-placeholder': filter_default_label,
                  id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
                  class: `yadcf-filter ${columnObj.style_class}`,
                  onchange: filterActionFn,
                  onkeydown: Yadcf.preventDefaultForEnter,
                  onmousedown: Yadcf.stopPropagation,
                  onclick: Yadcf.stopPropagation,
                  html: column_data
                })
              );

              if ( filter_reset_button_text !== false ) {
                $( filter_selector_string ).find( '.yadcf-filter' ).after(
                  Yadcf.makeElement( '<button />', {
                    type: 'button',
                    onmousedown: Yadcf.stopPropagation,
                    onclick: function( colNo: number, tableSel: string ) {
                      return function( event: JQuery.Event ): boolean {
                        Yadcf.stopPropagation( event );
                        Yadcf.doFilter( 'clear', tableSel, colNo );
                        return false;
                      }
                    }( column_number, table_selector_jq_friendly ),
                    class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                    text: filter_reset_button_text
                  })
                );
              }

              if ( settingsDt.aoPreSearchCols[ column_position ].sSearch !== '' ) {
                tmpStr = settingsDt.aoPreSearchCols[ column_position ].sSearch;
                tmpStr = Yadcf.yadcfParseMatchFilterMultiSelect( tmpStr, Yadcf.getOptions( oTable.selector )[ column_number ].filter_match_mode );
                tmpStr = tmpStr.replace( /\\/g, '' );
                tmpStr = tmpStr.split( '|' );

                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr );
              }
            } else {
              filterActionFn = function( colNo: number, tableSel: string ) {
                return function( event: JQuery.Event ) {
                  Yadcf.doFilterCustomDateFunc( this, tableSel, colNo );
                };
              }( column_number, table_selector_jq_friendly );

              if ( columnObj.externally_triggered === true ) {
                filterActionFn = function() {};
              }

              $( filter_selector_string ).append(
                Yadcf.makeElement( '<select>', {
                  multiple: true,
                  'data-placeholder': filter_default_label,
                  id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
                  class: `yadcf-filter ${columnObj.style_class}`,
                  onchange: filterActionFn,
                  onkeydown: Yadcf.preventDefaultForEnter,
                  onmousedown: Yadcf.stopPropagation,
                  onclick: Yadcf.stopPropagation,
                  html: column_data
                })
              );

              if ( filter_reset_button_text !== false ) {
                $( filter_selector_string ).find( '.yadcf-filter' ).after(
                  Yadcf.makeElement( '<button />', {
                    type: 'button',
                    onmousedown: Yadcf.stopPropagation,
                    onclick: function( colNo: number, tableSel: string ) {
                      return function( event: JQuery.Event ): boolean {
                        Yadcf.stopPropagation( event );
                        Yadcf.doFilterCustomDateFunc( 'clear', tableSel, colNo );
                        return false;
                      };
                    }( column_number, table_selector_jq_friendly ),
                    class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                    text: filter_reset_button_text
                  })
                );
              }

              if ( settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState ) {
                if (
                  settingsDt.oLoadedState.yadcfState &&
                  settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] &&
                  settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ]
                ) {
                  tmpStr = settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from;

                  if ( tmpStr === '-1' || tmpStr === undefined ) {
                    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr );
                  } else {
                    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr ).addClass( 'inuse' );
                  }
                }
              }

              if ( settingsDt.oFeatures.bServerSide !== true ) {
                Yadcf.addCustomFunctionFilterCapability( table_selector_jq_friendly, `yadcf-filter-${table_selector_jq_friendly}-${column_number}`, column_number );
              }
            }

            if ( columnObj.filter_container_selector === undefined && columnObj.select_type_options.width === undefined ) {
              columnObj.select_type_options = $.extend( columnObj.select_type_options, { width: $( filter_selector_string ).closest( 'th' ).width() + 'px' });
            }

            if ( columnObj.filter_container_selector !== undefined && columnObj.select_type_options.width === undefined ) {
              columnObj.select_type_options = $.extend( columnObj.select_type_options, { width: $( filter_selector_string ).closest( columnObj.filter_container_selector ).width() + 'px' });
            }

            if ( columnObj.select_type !== undefined ) {
              Yadcf.initializeSelectPlugin( columnObj.select_type, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), columnObj.select_type_options );

              if ( columnObj.cumulative_filtering === true && columnObj.select_type === 'chosen' ) {
                Yadcf.refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ) );
              }
            }
          } else if ( columnObj.filter_type === 'auto_complete' ) {
            // Add a wrapper to hold both filter and reset button.
            $( filter_selector_string ).append(
              Yadcf.makeElement( '<div />', {
                id: `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}`,
                class: 'yadcf-filter-wrapper'
              })
            );

            filter_selector_string += ' div.yadcf-filter-wrapper';

            filterActionFn = function( tableSel: string ) {
              return function( event: KeyboardEvent ) {
                Yadcf.autocompleteKeyUP( tableSel, event );
              };
            }( table_selector_jq_friendly );

            if ( columnObj.externally_triggered === true ) {
              filterActionFn = function() {};
            }

            $( filter_selector_string ).append(
              Yadcf.makeElement( '<input />', {
                onkeydown: Yadcf.preventDefaultForEnter,
                id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
                class: 'yadcf-filter',
                onmousedown: Yadcf.stopPropagation,
                onclick: Yadcf.stopPropagation,
                placeholder: filter_default_label,
                filter_match_mode: filter_match_mode,
                onkeyup: filterActionFn
              })
            );

            $( document ).data( `yadcf-filter-${table_selector_jq_friendly}-${column_number}`, column_data );

            if ( filter_reset_button_text !== false ) {
              $( filter_selector_string ).find( '.yadcf-filter' ).after(
                Yadcf.makeElement( '<button />', {
                  type: 'button',
                  onmousedown: Yadcf.stopPropagation,
                  onclick: function( colNo, tableSel ) {
                    return function( event ) {
                      Yadcf.stopPropagation( event );
                      Yadcf.doFilterAutocomplete( 'clear', tableSel, colNo );
                      return false;
                    };
                  }( column_number, table_selector_jq_friendly ),
                  class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                  text: filter_reset_button_text
                })
              );
            }
          } else if ( columnObj.filter_type === 'text' ) {
            // Add a wrapper to hold both filter and reset button.
            $( filter_selector_string ).append(
              Yadcf.makeElement( '<div />', {
                id: `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}`,
                class: 'yadcf-filter-wrapper'
              })
            );

            filter_selector_string += ' div.yadcf-filter-wrapper';

            filterActionFn = function( colNo: number, tableSel: string ) {
              /* IIFE closure to preserve column number. */
              return function( event: JQuery.Event ) {
                Yadcf.textKeyUP( event, tableSel, colNo );
              };
            }( column_number, table_selector_jq_friendly );

            if ( columnObj.externally_triggered === true ) {
              filterActionFn = function() {};
            }

            exclude_str = $();

            if ( columnObj.exclude === true ) {
              if ( columnObj.externally_triggered !== true ) {
                exclude_str = Yadcf.makeElement( '<div />', {
                  class: 'yadcf-exclude-wrapper',
                  onmousedown: Yadcf.stopPropagation,
                  onclick: Yadcf.stopPropagation
                })
                .append(
                  Yadcf.makeElement( '<span />', {
                    class: 'yadcf-label small',
                    text: columnObj.exclude_label
                  })
                )
                .append(
                  Yadcf.makeElement( '<input />', {
                    type: 'checkbox',
                    title: columnObj.exclude_label,
                    onclick: function( colNo: number, tableSel: string ) {
                      return function( event: JQuery.Event ) {
                        Yadcf.stopPropagation( event );
                        Yadcf.textKeyUP( event, tableSel, colNo );
                      };
                    }( column_number, table_selector_jq_friendly )
                  })
                );
              } else {
                exclude_str = Yadcf.makeElement( '<div />', {
                  class: 'yadcf-exclude-wrapper',
                  onmousedown: Yadcf.stopPropagation,
                  onclick: Yadcf.stopPropagation
                })
                .append(
                  Yadcf.makeElement( '<span />', {
                    class: 'yadcf-label small',
                    text: columnObj.exclude_label
                  })
                )
                .append(
                  Yadcf.makeElement( '<input />', {
                    type: 'checkbox',
                    title: columnObj.exclude_label,
                    onclick: Yadcf.stopPropagation
                  })
                );
              }
            }

            regex_str = $();

            if ( columnObj.regex_check_box === true ) {
              if ( columnObj.externally_triggered !== true ) {
                regex_str = Yadcf.makeElement( '<div />', {
                  class: 'yadcf-regex-wrapper',
                  onmousedown: Yadcf.stopPropagation,
                  onclick: Yadcf.stopPropagation
                })
                .append(
                  Yadcf.makeElement( '<span />', {
                    class: 'yadcf-label small',
                    text: columnObj.regex_label
                  })
                )
                .append(
                  Yadcf.makeElement( '<input />', {
                    type: 'checkbox',
                    title: columnObj.regex_label,
                    onclick: function( colNo: number, tableSel: string ) {
                      return function( event: JQuery.Event ) {
                        Yadcf.stopPropagation( event );
                        Yadcf.textKeyUP( event, tableSel, colNo );
                      };
                    }( column_number, table_selector_jq_friendly )
                  })
                );
              } else {
                regex_str = Yadcf.makeElement( '<div />', {
                  class: 'yadcf-regex-wrapper',
                  onmousedown: Yadcf.stopPropagation,
                  onclick: Yadcf.stopPropagation
                })
                .append(
                  Yadcf.makeElement( '<span />', {
                    class: 'yadcf-label small',
                    text: columnObj.regex_label
                  })
                )
                .append(
                  Yadcf.makeElement( '<input />', {
                    type: 'checkbox',
                    title: columnObj.regex_label,
                    onclick: Yadcf.stopPropagation
                  })
                );
              }
            }

            null_str = $();

            if ( columnObj.null_check_box === true ) {
              null_str = Yadcf.makeElement( '<div />', {
                class: 'yadcf-null-wrapper',
                onmousedown: Yadcf.stopPropagation,
                onclick: Yadcf.stopPropagation
              })
              .append(
                Yadcf.makeElement( '<span />', {
                  class: 'yadcf-label small',
                  text: columnObj.null_label
                })
              )
              .append(
                Yadcf.makeElement( '<input />', {
                  type: 'checkbox',
                  title: columnObj.null_label,
                  onclick: function( colNo: number, tableSel: string ) {
                    return function( event: JQuery.Event ) {
                      Yadcf.stopPropagation( event );
                      Yadcf.nullChecked( event, tableSel, colNo );
                    };
                  }( column_number, table_selector_jq_friendly )
                })
              );

              if ( oTable.settings()[0].oFeatures.bServerSide !== true ) {
                Yadcf.addNullFilterCapability( table_selector_jq_friendly, column_number, false );
              }
            }

            let append_input = Yadcf.makeElement( '<input />', {
              type: 'text',
              onkeydown: Yadcf.preventDefaultForEnter,
              id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
              class: `yadcf-filter ${columnObj.style_class}`,
              onmousedown: Yadcf.stopPropagation,
              onclick: Yadcf.stopPropagation,
              placeholder: filter_default_label,
              filter_match_mode: filter_match_mode,
              onkeyup: filterActionFn
            });

            if ( columnObj.checkbox_position_after ) {
              exclude_str.addClass( 'after' );
              regex_str.addClass( 'after' );
              null_str.addClass( 'after' );

              $( filter_selector_string ).append( append_input, exclude_str, regex_str, null_str );
            } else {
              $( filter_selector_string ).append( exclude_str, regex_str, null_str, append_input );
            }

            if ( externally_triggered_checkboxes_text && typeof externally_triggered_checkboxes_function === 'function' ) {
              const sel = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` );

              // Hide on load.
              sel.find( '.yadcf-exclude-wrapper' ).hide();
              sel.find( '.yadcf-regex-wrapper' ).hide();
              sel.find( '.yadcf-null-wrapper' ).hide();

              $( filter_selector_string ).find( '.yadcf-filter' ).after(
                Yadcf.makeElement( '<button />', {
                  type: 'button',
                  id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}-externally_triggered_checkboxes-button`,
                  onmousedown: Yadcf.stopPropagation,
                  onclick: Yadcf.stopPropagation,
                  class: `yadcf-filter-externally_triggered_checkboxes-button ${columnObj.externally_triggered_checkboxes_button_style_class}`,
                  text: externally_triggered_checkboxes_text
                })
              );

              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}-externally_triggered_checkboxes-button` ).on( 'click', externally_triggered_checkboxes_function );
            }

            if ( filter_reset_button_text !== false ) {
              $( filter_selector_string ).find( '.yadcf-filter' ).after(
                Yadcf.makeElement( '<button />', {
                  type: 'button',
                  id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '-reset',
                  onmousedown: Yadcf.stopPropagation,
                  onclick: function( colNo: number, tableSel: string ) {
                    /* IIFE closure to preserve column_number */
                    return function( event: JQuery.Event ): boolean {
                      Yadcf.stopPropagation( event );
                      Yadcf.textKeyUP( event, tableSel, colNo, 'clear' );
                      return false;
                    }
                  }( column_number, table_selector_jq_friendly ),
                  class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                  text: filter_reset_button_text
                })
              );
            }

            Yadcf.loadFromStateSaveTextFilter( oTable, settingsDt, columnObj, table_selector_jq_friendly, column_position, column_number );

          } else if ( columnObj.filter_type === 'date' || columnObj.filter_type === 'date_custom_func' ) {

            Yadcf.addDateFilter( filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, filter_default_label, date_format );

          } else if ( columnObj.filter_type === 'range_number' ) {

            Yadcf.addRangeNumberFilter( filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, filter_default_label, ignore_char );

          } else if ( columnObj.filter_type === 'range_number_slider' ) {

            Yadcf.addRangeNumberSliderFilter( filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, min_val, max_val, ignore_char );

          } else if ( columnObj.filter_type === 'range_date' ) {

            Yadcf.addRangeDateFilter( filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, filter_default_label, date_format );
          }
        }

        if (
          $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val` ) !== undefined &&
          $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val` ) !== '-1'
        ) {
          $( filter_selector_string ).find( '.yadcf-filter' ).val( $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}_val` ) );
        }

        if ( columnObj.filter_type === 'auto_complete' ) {
          let autocompleteObj: JQueryUI.AutocompleteOptions = {
            source: $( document ).data( `yadcf-filter-${table_selector_jq_friendly}-${column_number}` ),
            select: Yadcf.autocompleteSelect
          };

          if ( columnObj.externally_triggered === true ) {
            delete autocompleteObj.select;
          }

          if ( columnObj.filter_plugin_options !== undefined ) {
            $.extend( autocompleteObj, columnObj.filter_plugin_options );
          }

          $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).autocomplete( autocompleteObj );

          if ( settingsDt.aoPreSearchCols[ column_position ].sSearch !== '' ) {
            tmpStr = settingsDt.aoPreSearchCols[ column_position ].sSearch;
            tmpStr = Yadcf.yadcfParseMatchFilter( tmpStr, Yadcf.getOptions( oTable.selector )[ column_number ].filter_match_mode );
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr ).addClass( 'inuse' );
          }
        }
      }
    }

    if ( Yadcf.exFilterColumnQueue.length > 0 ) {
      ( Yadcf.exFilterColumnQueue.shift() )();
    }
  }

  /**
   * @see yadcfParseMatchFilter
   * @see getOptions
   */
  private static loadFromStateSaveTextFilter( oTable: DataTableInstance, settingsDt: DataTableSettings, columnObj: AllParameters, table_selector_jq_friendly: string, column_position: number, column_number: number | string ) {
    if ( columnObj.null_check_box === true ) {
      if ( settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState ) {
        if (
          settingsDt.oLoadedState.yadcfState &&
          settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] &&
          settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ]
        ) {
          if ( settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].null_checked ) {
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).prop( 'disabled', true );
            $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-null-wrapper' ).find( ':checkbox' ).prop( 'checked', true );
          }

          if ( settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].exclude_checked ) {
            $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-exclude-wrapper' ).find( ':checkbox' ).prop( 'checked', true );
          }

          if ( settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].null_checked ) {
            return;
          }
        }
      }
    }

    if ( settingsDt.aoPreSearchCols[ column_position ].sSearch !== '' ) {
      let tmpStr = settingsDt.aoPreSearchCols[ column_position ].sSearch;

      if ( columnObj.exclude === true ) {
        if ( tmpStr.indexOf( '^((?!' ) !== -1 ) {
          $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-exclude-wrapper' ).find( ':checkbox' ).prop( 'checked', true );
          $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse-exclude' );
        }

        if ( tmpStr.indexOf( ').)' ) !== -1 ) {
          tmpStr = tmpStr.substring( 5, tmpStr.indexOf( ').)' ) );
        }
      }

      // Load saved regex_checkbox state.
      if ( columnObj.regex_check_box === true ) {
        if ( settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState ) {
          if (
            settingsDt.oLoadedState.yadcfState &&
            settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] &&
            settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ]
          ) {
            if ( settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].regex_check_box ) {
              $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-regex-wrapper' ).find( ':checkbox' ).prop( 'checked', true );
              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse-regex' );
            }
          }
        }
      }

      tmpStr = Yadcf.yadcfParseMatchFilter( tmpStr, Yadcf.getOptions( oTable.selector )[ column_number ].filter_match_mode );

      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr ).addClass( 'inuse' );
    }
  }

  private static saveTextKeyUpState(
      oTable: DataTableInstance,
      table_selector_jq_friendly: string,
      column_number: number | string,
      regex_check_box: AllParameters<FilterType>['regex_check_box'],
      null_checked: boolean,
      exclude: boolean
  ): void {
    let yadcfState;

    if (
      oTable.settings()[0].oFeatures.bStateSave === true &&
      oTable.settings()[0].oLoadedState &&
      oTable.settings()[0].oLoadedState.yadcfState
    ) {
      if ( oTable.settings()[0].oLoadedState.yadcfState !== undefined && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
          regex_check_box: regex_check_box,
          null_checked: null_checked,
          exclude_checked: exclude
        };
      } else {
        yadcfState = {};
        yadcfState[ table_selector_jq_friendly ] = [];
        yadcfState[ table_selector_jq_friendly ][ column_number ] = {
          regex_check_box: regex_check_box,
          exclude_checked: exclude,
          null_checked: null_checked
        };

        oTable.settings()[0].oLoadedState.yadcfState = yadcfState;
      }

      oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
    }
  }

  /**
   * @see getSettingsObjFromTable
   *
   * @param tableVar
   * @returns
   */
  private static isDOMSource( tableVar: DataTableInstance | globalThis.DataTables.JQueryDataTables ): boolean {
    const settingsDt: DataTableSettings = Yadcf.getSettingsObjFromTable( tableVar );
    console.log( 'isDOMSource', settingsDt );

    if ( !settingsDt && !settingsDt.sAjaxSource && !settingsDt.ajax && settingsDt.oFeatures.bServerSide !== true ) {
      return true;
    }

    return false;
  }

  /**
   * @see generateTableSelectorJQFriendly2
   */
  private static scrollXYHandler( oTable: DataTableInstance, table_selector: string ): void {
    let $tmpSelector: JQuery,
        filters_position = $( document ).data( `${table_selector}_filters_position` ),
        table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2( oTable );

    if ( filters_position === 'thead' ) {
      filters_position = '.dataTables_scrollHead';
    } else {
      filters_position = '.dataTables_scrollFoot';
    }

    if ( oTable.api().context[0].oScroll.sX !== '' || oTable.api().context[0].oScroll.sY !== '' ) {
      $tmpSelector = $( table_selector ).closest( '.dataTables_scroll' ).find( filters_position + ' table' );
      $tmpSelector.addClass( `yadcf-datatables-table-${table_selector_jq_friendly}` );
    }
  }

  private static firstFromObject( obj: Record<string, any> ): string {
    for ( const key in obj ) {
      if ( obj.hasOwnProperty( key ) ) {
        return key;
      }
    }
  }

  /**
   * // Methods
   * @see generateTableSelectorJQFriendly2
   * @see scrollXYHandler
   * @see isDOMSource
   * @see appendFilters
   * @see getOptions
   * @see firstFromObject
   * @see yadcfVersionCheck
   * @see initColReorder2
   * @see dTXhrComplete
   * @see yadcfDelay
   * @see loadFromStateSaveTextFilter
   * @see initColReorderFromEvent
   * @see removeFilters
   *
   * // Properties
   * @see oTables
   * @see tablesDT
   * @see oTablesIndex
   *
   * @param oTable
   * @param table_selector
   * @param index
   * @param pTableDT
   */
  private static initAndBindTable( oTable: DataTableInstance, table_selector: string, index: number, pTableDT?: DataTableInstance ): void {
    const table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2( oTable );

    let table_selector_tmp: string;

    Yadcf.oTables[ table_selector_jq_friendly ] = oTable;
    Yadcf.tablesDT[ table_selector_jq_friendly ] = pTableDT;
    Yadcf.oTablesIndex[ table_selector_jq_friendly ] = index;

    Yadcf.scrollXYHandler( oTable, table_selector );

    if ( Yadcf.isDOMSource( oTable ) )
    {
      table_selector_tmp = table_selector;

      if ( table_selector.indexOf( ':eq' ) !== -1 ) {
        table_selector_tmp = table_selector.substring( 0, table_selector.lastIndexOf( ':eq' ) );
      }

      Yadcf.appendFilters( oTable, Yadcf.getOptions( table_selector_tmp ), table_selector );

      if ( Yadcf.getOptions( table_selector_tmp )[ Yadcf.firstFromObject( Yadcf.getOptions( table_selector_tmp ) ) ].cumulative_filtering === true ) {
        // When filters should be populated only from visible rows (non filtered).
        // @ts-ignore
        $( document ).off( 'search.dt', oTable.selector ).on( 'search.dt', oTable.selector, ( e: Event, settings: DataTableSettings, json: Record<string, any> ) => {
          let table_selector_tmp = oTable.selector;

          if ( table_selector.indexOf( ':eq' ) !== -1 ) {
            table_selector_tmp = table_selector.substring( 0, table_selector.lastIndexOf( ':eq' ) );
          }

          Yadcf.appendFilters( oTable, Yadcf.getOptions( table_selector_tmp ), oTable.selector, settings );
        });
      }
    }
    else
    {
      Yadcf.appendFilters( oTable, Yadcf.getOptions( table_selector ), table_selector );

      if (
        Yadcf.yadcfVersionCheck( '1.10' ) ||
        Yadcf.yadcfVersionCheck( '1.11' ) ||
        Yadcf.yadcfVersionCheck( '1.12' ) ||
        Yadcf.yadcfVersionCheck( '1.13' )
      ) {
        $( document ).off( 'xhr.dt', oTable.selector ).on( 'xhr.dt', oTable.selector, ( e: any, settings: DataTableSettings, json: Record<string, any> ) => {
          let col_num: string,
              column_number_filter: any,
              table_selector_jq_friendly: string = Yadcf.generateTableSelectorJQFriendly2( oTable );

          if ( !json ) {
            console.log( 'datatables `xhr.dt` event came back with null as data (nothing for yadcf to do with it).' );
            return;
          }

          if ( settings.oSavedState !== null ) {
            Yadcf.initColReorder2( settings, table_selector_jq_friendly );
          }

          for ( col_num in Yadcf.getOptions( settings.oInstance.selector ) ) {
            if ( Yadcf.getOptions( settings.oInstance.selector ).hasOwnProperty( col_num ) ) {
              if ( json[`yadcf_data_${col_num}`] !== undefined ) {
                column_number_filter = col_num;

                if ( settings.oSavedState !== null && Yadcf.plugins[ table_selector_jq_friendly ] !== undefined ) {
                  column_number_filter = Yadcf.plugins[ table_selector_jq_friendly ].ColReorder[ col_num ];
                }

                Yadcf.getOptions( settings.oInstance.selector )[ col_num ].data = json[`yadcf_data_${column_number_filter}`];
              }
            }
          }

          if ( Yadcf.dTXhrComplete !== undefined ) {
            Yadcf.yadcfDelay( () => {
              Yadcf.dTXhrComplete();
              Yadcf.dTXhrComplete = undefined;
            }, 100 );
          }
        });
      }
    }

    // Events that affects both DOM and Ajax.
    if (
      Yadcf.yadcfVersionCheck( '1.10' ) ||
      Yadcf.yadcfVersionCheck( '1.11' ) ||
      Yadcf.yadcfVersionCheck( '1.12' ) ||
      Yadcf.yadcfVersionCheck( '1.13' )
    ) {
      $( document ).off( 'stateLoaded.dt', oTable.selector ).on( 'stateLoaded.dt', oTable.selector, ( event: any, settings: DataTableSettings ) => {
        let args = Yadcf.getOptions( settings.oInstance.selector );
        let columnObjKey: string;

        for ( columnObjKey in args ) {
          if ( args.hasOwnProperty( columnObjKey ) ) {
            let columnObj     = args[ columnObjKey ];
            let column_number = columnObj.column_number;

            column_number = +column_number;

            let column_position            = column_number;
            let table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2( oTable );

            Yadcf.loadFromStateSaveTextFilter( oTable, settings, columnObj, table_selector_jq_friendly, column_position, column_number );
          }
        }
      });

      $( document ).off( 'draw.dt', oTable.selector ).on( 'draw.dt', oTable.selector, ( event: any, settings: DataTableSettings ) => {
        Yadcf.appendFilters( oTable, Yadcf.getOptions( settings.oInstance.selector ), settings.oInstance.selector, settings );
      });

      $( document ).off( 'column-visibility.dt', oTable.selector ).on( 'column-visibility.dt', oTable.selector, ( e: any, settings: DataTableSettings, col_num: number, state: any ) => {
        const obj: Partial<AllParameters<FilterType>> = {},
              columnsObj = Yadcf.getOptions( settings.oInstance.selector );

        if ( state === true && settings._oFixedColumns === undefined ) {
          if (
            Yadcf.plugins[ table_selector_jq_friendly ] !== undefined &&
            Yadcf.plugins[ table_selector_jq_friendly ].ColReorder !== undefined
          ) {
            col_num = Yadcf.plugins[ table_selector_jq_friendly ].ColReorder[ col_num ];
          } else if ( settings.oSavedState && settings.oSavedState.ColReorder !== undefined ) {
            col_num = settings.oSavedState.ColReorder[ col_num ];
          }

          obj[ col_num ] = Yadcf.getOptions( settings.oInstance.selector )[ col_num ];

          if ( obj[ col_num ] !== undefined ) {
            obj[ col_num ].column_number = col_num;

            if ( obj[ col_num ] !== undefined ) {
              Yadcf.appendFilters( Yadcf.oTables[ Yadcf.generateTableSelectorJQFriendly2( settings ) ], obj, settings.oInstance.selector, settings );
            }
          }
        }
        else if ( settings._oFixedColumns !== undefined ) {
          Yadcf.appendFilters(
            Yadcf.oTables[ Yadcf.generateTableSelectorJQFriendly2( settings ) ],
            columnsObj,
            settings.oInstance.selector,
            settings
          );
        }
      });

      $( document ).off( 'column-reorder.dt', oTable.selector ).on( 'column-reorder.dt', oTable.selector, ( e: any, settings: DataTableSettings, json: Record<string, any> ) => {
        const table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2( oTable );
        Yadcf.initColReorderFromEvent( table_selector_jq_friendly );
      });

      $( document ).off( 'destroy.dt', oTable.selector ).on( 'destroy.dt', oTable.selector, ( e: any, ui: Record<string, any> ) => {
        Yadcf.removeFilters( oTable );
        Yadcf.removeFilters( ui.oInstance )
      });
    }
    else
    {
      $( document ).off( 'draw', oTable.selector ).on( 'draw', oTable.selector, ( e: any, settings: DataTableSettings ) => {
        Yadcf.appendFilters( oTable, Yadcf.getOptions( settings.oInstance.selector ), settings.oInstance.selector, settings );
      });

      $( document ).off( 'destroy', oTable.selector ).on( 'destroy', oTable.selector, ( e: any, ui: Record<string, any> ) => {
        Yadcf.removeFilters( oTable );
        Yadcf.removeFilters( ui.oInstance.selector );
      });
    }

    if ( oTable.settings()[0].oFeatures.bStateSave === true )
    {
      if (
        Yadcf.yadcfVersionCheck( '1.10' ) ||
        Yadcf.yadcfVersionCheck( '1.11' ) ||
        Yadcf.yadcfVersionCheck( '1.12' ) ||
        Yadcf.yadcfVersionCheck( '1.13' )
      ) {
        $( oTable.selector as string ).off( 'stateSaveParams.dt' ).on( 'stateSaveParams.dt', ( e: any, settings: DataTableSettings, data: Record<string, any> ) => {
          if ( settings.oLoadedState && settings.oLoadedState.yadcfState !== undefined ) {
            data.yadcfState = settings.oLoadedState.yadcfState;
          } else {
            data.naruto = 'kurama';
          }
        });
      }
      else
      {
        $( oTable.selector as string ).off( 'stateSaveParams' ).on( 'stateSaveParams', ( e: any, settings: DataTableSettings, data: Record<string, any> ) => {
          if ( settings.oLoadedState && settings.oLoadedState.yadcfState !== undefined ) {
            data.yadcfState = settings.oLoadedState.yadcfState;
          } else {
            data.naruto = 'kurama';
          }
        });
      }

      // When using DOM source.
      if ( Yadcf.isDOMSource( oTable ) ) {
        // We need to make sure that the yadcf state will be saved after page reload.
        oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
        // Redraw the table in order to apply the filters.
        oTable.fnDraw( false );
      }
    }
  }

  /**
   * @see generateTableSelectorJQFriendlyNew
   * @see columnsArrayToString
   * @see getOptions
   * @see makeElement
   * @see stopPropagation
   * @see textKeyUpMultiTables
   * @see getSettingsObjFromTable
   * @see yadcfParseMatchFilter
   * @see isDOMSource
   * @see parseTableColumn
   * @see sortColumnData
   * @see initializeSelectPlugin
   * @see refreshSelectPlugin
   * @see doFilterMultiTables
   * @see doFilterMultiTablesMultiSelect
   * @see yadcfParseMatchFilterMultiSelect
   *
   * @param tablesArray
   * @param tablesSelectors
   * @param colObjDummy
   */
  private static appendFiltersMultipleTables( tablesArray: Array<DataTableInstance>, tablesSelectors: string, colObjDummy: AllParameters<FilterType> ): void {
    let filter_selector_string: string = '#' + colObjDummy.filter_container_id,
        table_selector_jq_friendly: string = Yadcf.generateTableSelectorJQFriendlyNew( tablesSelectors ),
        column_number_str: string = Yadcf.columnsArrayToString( colObjDummy.column_number ).column_number_str.toString(),
        filterOptions: AllParameters<FilterType> = Yadcf.getOptions( tablesSelectors + '_' + column_number_str )[ column_number_str ],
        options_tmp: JQuery<HTMLOptionElement>,
        ii: number,
        tableTmp: any,
        tableTmpArr: Array<string>,
        tableTmpArrIndex: number,
        column_number_index: number,
        columnsTmpArr: number | Array<number>,
        settingsDt: DataTableSettings,
        tmpStr: string | Array<string>,
        columnForStateSaving: string;

    //add a wrapper to hold both filter and reset button
    $( filter_selector_string ).append(
      Yadcf.makeElement( '<div />', {
        id: `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number_str}`,
        class: 'yadcf-filter-wrapper'
      })
    );

    filter_selector_string += ' div.yadcf-filter-wrapper';

    if ( column_number_str.indexOf( '_' ) !== -1 ) {
      columnForStateSaving = column_number_str.split( '_' )[0];
    } else {
      columnForStateSaving = column_number_str;
    }

    switch ( filterOptions.filter_type ) {
      case 'text':
        $( filter_selector_string ).append(
          Yadcf.makeElement( '<input />', {
            type: 'text',
            id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}`,
            class: 'yadcf-filter',
            onmousedown: Yadcf.stopPropagation,
            onclick: Yadcf.stopPropagation,
            placeholder: filterOptions.filter_default_label as string,
            onkeyup: function( colNo: string ) {
              return function( event: JQuery.KeyUpEvent ) {
                Yadcf.stopPropagation( event );
                Yadcf.textKeyUpMultiTables( tablesSelectors, event, colNo );
                return false;
              };
            }( column_number_str ),
          })
        );

        if ( filterOptions.filter_reset_button_text !== false ) {
          $( filter_selector_string ).find( '.yadcf-filter' ).after(
            Yadcf.makeElement( '<button />', {
              type: 'button',
              id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}-reset`,
              onmousedown: Yadcf.stopPropagation,
              onclick: function( colNo: string ) {
                return function( event: JQuery.Event ) {
                  Yadcf.stopPropagation( event );
                  Yadcf.textKeyUpMultiTables( tablesSelectors, event, colNo, 'clear' );
                  return false;
                };
              }( column_number_str ),
              class: `yadcf-filter-reset-button ${filterOptions.reset_button_style_class}`,
              text: filterOptions.filter_reset_button_text
            })
          );
        }

        if ( tablesArray[0].table !== undefined ) {
          tableTmp = $( '#' + (tablesArray[0].table().node() as HTMLElement).id ).dataTable();
        } else {
          tableTmp = tablesArray[0];
        }

        settingsDt = Yadcf.getSettingsObjFromTable( tableTmp );

        if (
          settingsDt.aoPreSearchCols[ columnForStateSaving ] &&
          settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch !== ''
        ) {
          tmpStr = settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch;
          tmpStr = Yadcf.yadcfParseMatchFilter( tmpStr as string, filterOptions.filter_match_mode );

          $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number_str}` ).val( tmpStr ).addClass( 'inuse' );
        }
        break;

      case 'select':
      case 'multi_select':
        if ( filterOptions.select_type === undefined ) {
          options_tmp = $( '<option>', {
            'data-placeholder': 'true',
            value: '-1',
            text: filterOptions.filter_default_label
          });
        } else {
          options_tmp = $();
        }

        if (
          filterOptions.select_type === 'select2' &&
          filterOptions.select_type_options.placeholder !== undefined &&
          filterOptions.select_type_options.allowClear === true
        ) {
          options_tmp = $( '<option>', { value: '' });
        }

        if ( filterOptions.data === undefined ) {
          filterOptions.data = [];
          tableTmpArr        = tablesSelectors.split( ',' );

          for ( tableTmpArrIndex = 0; tableTmpArrIndex < tableTmpArr.length; tableTmpArrIndex++ ) {
            if ( tablesArray[ tableTmpArrIndex ].table !== undefined ) {
              tableTmp = $( '#' + (tablesArray[ tableTmpArrIndex ].table().node() as HTMLElement).id ).dataTable();
            } else {
              tableTmp = tablesArray[ tableTmpArrIndex ];
            }

            if ( Yadcf.isDOMSource( tableTmp ) ) {
              // Check if ajax source, if so, listen for dt.draw.
              columnsTmpArr = filterOptions.column_number;

              for ( column_number_index = 0; column_number_index < [ columnsTmpArr ].length; column_number_index++ ) {
                filterOptions.column_number = columnsTmpArr[ column_number_index ];
                filterOptions.data          = filterOptions.data.concat( Yadcf.parseTableColumn( tableTmp, filterOptions, table_selector_jq_friendly ) );
              }

              filterOptions.column_number = columnsTmpArr;
            } else {
              $( document ).off( 'draw.dt', '#' + (tablesArray[ tableTmpArrIndex ].table().node() as HTMLElement).id ).on( 'draw.dt', '#' + (tablesArray[ tableTmpArrIndex ].table().node() as HTMLElement).id, ( event: any, ui: any ) => {
                let options_tmp = $(),
                    ii;

                columnsTmpArr = filterOptions.column_number;

                for ( column_number_index = 0; column_number_index < [ columnsTmpArr ].length; column_number_index++ ) {
                  filterOptions.column_number = columnsTmpArr[ column_number_index ];
                  filterOptions.data          = filterOptions.data.concat( Yadcf.parseTableColumn( tableTmp, filterOptions, table_selector_jq_friendly, ui ) );
                }

                filterOptions.column_number = columnsTmpArr;
                filterOptions.data          = Yadcf.sortColumnData( filterOptions.data, filterOptions );

                for ( ii = 0; ii < filterOptions.data.length; ii++ ) {
                  options_tmp = options_tmp.add(
                    $( '<option>', {
                      value: filterOptions.data[ ii ],
                      text: filterOptions.data[ ii ]
                    })
                  );
                }

                $( '#' + filterOptions.filter_container_id + ' select' ).empty().append( options_tmp );

                if ( filterOptions.select_type !== undefined ) {
                  Yadcf.initializeSelectPlugin( filterOptions.select_type, $( '#' + filterOptions.filter_container_id + ' select' ), filterOptions.select_type_options );

                  if ( filterOptions.cumulative_filtering === true && filterOptions.select_type === 'chosen' ) {
                    Yadcf.refreshSelectPlugin( filterOptions, $( '#' + filterOptions.filter_container_id + ' select' ) );
                  }
                }
              });
            }
          }
        }

        filterOptions.data = Yadcf.sortColumnData( filterOptions.data, filterOptions );

        if ( tablesArray[0].table !== undefined ) {
          tableTmp = $( '#' + (tablesArray[0].table().node() as HTMLElement).id ).dataTable();
        } else {
          tableTmp = tablesArray[0];
        }

        settingsDt = Yadcf.getSettingsObjFromTable( tableTmp );

        if ( typeof filterOptions.data[0] === 'object' ) {
          for ( ii = 0; ii < filterOptions.data.length; ii++ ) {
            options_tmp = options_tmp.add(
              $( '<option>', {
                value: filterOptions.data[ ii ].value,
                text: filterOptions.data[ ii ].label
              })
            );
          }
        } else {
          for ( ii = 0; ii < filterOptions.data.length; ii++ ) {
            options_tmp = options_tmp.add(
              $( '<option>', {
                value: filterOptions.data[ ii ],
                text: filterOptions.data[ ii ]
              })
            );
          }
        }

        if ( filterOptions.filter_type === 'select' ) {
          $( filter_selector_string ).append(
            Yadcf.makeElement( '<select>', {
              id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}`,
              class: 'yadcf-filter',
              onchange: function( colNo: string ) {
                return function( event: JQuery.ChangeEvent ) {
                  Yadcf.stopPropagation( event );
                  Yadcf.doFilterMultiTables( tablesSelectors, event, colNo );
                }
              }( column_number_str ),
              onmousedown: Yadcf.stopPropagation,
              onclick: Yadcf.stopPropagation,
              html: options_tmp
            })
          );

          if ( settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch !== '' ) {
            tmpStr = settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch;
            tmpStr = Yadcf.yadcfParseMatchFilter( tmpStr as string, filterOptions.filter_match_mode );
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number_str}` ).val( tmpStr ).addClass( 'inuse' );
          }
        } else if ( filterOptions.filter_type === 'multi_select' ) {
          $( filter_selector_string ).append(
            Yadcf.makeElement( '<select>', {
              multiple: true,
              'data-placeholder': filterOptions.filter_default_label,
              id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}`,
              class: 'yadcf-filter',
              onchange: function( colNo ) {
                return function( event ) {
                  Yadcf.stopPropagation( event );
                  Yadcf.doFilterMultiTablesMultiSelect( tablesSelectors, event, colNo );
                };
              }( column_number_str ),
              onmousedown: Yadcf.stopPropagation,
              onclick: Yadcf.stopPropagation,
              html: options_tmp
            })
          );

          if ( settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch !== '' ) {
            tmpStr = settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch;
            tmpStr = Yadcf.yadcfParseMatchFilterMultiSelect( tmpStr as string, filterOptions.filter_match_mode );
            tmpStr = tmpStr.replace( /\\/g, '' );
            tmpStr = tmpStr.split( '|' );

            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number_str}` ).val( tmpStr );
          }
        }

        if ( filterOptions.filter_type === 'select' ) {
          if ( filterOptions.filter_reset_button_text !== false ) {
            $( filter_selector_string ).find( '.yadcf-filter' ).after(
              Yadcf.makeElement( '<button />', {
                type: 'button',
                id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}-reset`,
                onmousedown: Yadcf.stopPropagation,
                onclick: function( colNo ) {
                  return function( event ) {
                    Yadcf.stopPropagation( event );
                    Yadcf.doFilterMultiTables( tablesSelectors, event, colNo, true );
                    return false;
                  }
                }( column_number_str ),
                class: 'yadcf-filter-reset-button ' + filterOptions.reset_button_style_class,
                text: filterOptions.filter_reset_button_text
              })
            );
          }
        } else if ( filterOptions.filter_type === 'multi_select' ) {
          if ( filterOptions.filter_reset_button_text !== false ) {
            $( filter_selector_string ).find( '.yadcf-filter' ).after(
              Yadcf.makeElement( '<button />', {
                type: 'button',
                id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}-reset`,
                onmousedown: Yadcf.stopPropagation,
                onclick: function( colNo ) {
                  return function( event ) {
                    Yadcf.stopPropagation( event );
                    Yadcf.doFilterMultiTablesMultiSelect( tablesSelectors, event, colNo, true );
                    return false;
                  };
                }( column_number_str ),
                class: `yadcf-filter-reset-button ${filterOptions.reset_button_style_class}`,
                text: filterOptions.filter_reset_button_text
              })
            );
          }
        }

        if ( filterOptions.select_type !== undefined ) {
          Yadcf.initializeSelectPlugin( filterOptions.select_type, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number_str}` ), filterOptions.select_type_options );

          if ( filterOptions.cumulative_filtering === true && filterOptions.select_type === 'chosen' ) {
            Yadcf.refreshSelectPlugin( filterOptions, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number_str}` ) );
          }
        }
        break;

      default:
        alert( 'Filters Multiple Tables does not support ' + filterOptions.filter_type );
    }
  }

  /**
   * // Properties from plugins
   * @see closeBootstrapDatepickerRange
   * @see closeBootstrapDatepicker
   * @see closeSelect2
   *
   * @param evt
   */
  private static close3rdPPluginsNeededClose( evt: any ) {
    if ( Yadcf.closeBootstrapDatepickerRange ) {
      $( '.yadcf-filter-range-date' ).not( $( evt.target ) ).datepicker( 'hide' );
    }

    if ( Yadcf.closeBootstrapDatepicker ) {
      $( '.yadcf-filter-date' ).not( $( evt.target ) ).datepicker( 'hide' );
    }

    if ( Yadcf.closeSelect2 ) {
      let currentSelect2;

      if ( evt.target.className.indexOf( 'yadcf-filter-reset-button' ) !== -1 ) {
        $( 'select.yadcf-filter' ).each( function( index ) {
          if ( $( this ).data( 'select2' ) ) {
            $( this ).select2( 'close' );
          }
        });
      } else {
        currentSelect2 = $( $( evt.target ).closest( '.yadcf-filter-wrapper' ).find( 'select' ) );

        $( 'select.yadcf-filter' ).each( function( index ) {
          if ( !$( this ).is( currentSelect2 ) && $( this ).data( 'select2' ) ) {
            $( this ).select2( 'close' );
          }
        });
      }
    }
  }

  /**
   * @see exFilterColumn
   *
   * @param table_arg
   * @param col_filter_arr
   * @returns
   */
  private static exInternalFilterColumnAJAXQueue( table_arg: DataTableInstance, col_filter_arr: Array<ExFilterColArgs> ) {
    return function() {
      Yadcf.exFilterColumn( table_arg, col_filter_arr, true );
    };
  }

  private static clearStateSave( oTable: DataTableInstance, column_number: Array<number> | number | string, table_selector_jq_friendly: string ) {
    let yadcfState: Record<string, any>;

    if ( oTable.settings()[0].oFeatures.bStateSave === true ) {
      if ( !oTable.settings()[0].oLoadedState ) {
        oTable.settings()[0].oLoadedState = {};
        oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
      }

      if ( oTable.settings()[0].oLoadedState.yadcfState !== undefined && oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number as number ] = undefined;
      } else {
        yadcfState = {};
        yadcfState[ table_selector_jq_friendly ] = [];
        yadcfState[ table_selector_jq_friendly ][ column_number as number ] = undefined;
        oTable.settings()[0].oLoadedState.yadcfState = yadcfState;
      }

      oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
    }
  }

  private static saveStateSave(
    oTable: DataTableInstance,
    column_number: number | string,
    table_selector_jq_friendly: string,
    from: number | string,
    to: number | string
  ) {
    let yadcfState;

    if ( oTable.settings()[0].oFeatures.bStateSave === true ) {
      if ( !oTable.settings()[0].oLoadedState ) {
        oTable.settings()[0].oLoadedState = {};
      }

      if (
        oTable.settings()[0].oLoadedState.yadcfState !== undefined &&
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined
      ) {
        oTable.settings()[0].oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
          from: from,
          to: to
        };
      } else {
        yadcfState = {};
        yadcfState[ table_selector_jq_friendly ] = [];
        yadcfState[ table_selector_jq_friendly ][ column_number ] = {
          from: from,
          to: to
        };

        oTable.settings()[0].oLoadedState.yadcfState = yadcfState;
      }

      oTable.settings()[0].oApi._fnSaveState( oTable.settings()[0] );
    }
  }

  private static resetExcludeRegexCheckboxes( selector: string | JQuery | globalThis.JQuery ) {
    const $selector = typeof selector === 'string' ? $( selector ) : selector;

    $selector.find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked', false );
    $selector.find( '.yadcf-regex-wrapper :checkbox' ).prop( 'checked', false );
    $selector.find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked', false );
  }
}

$.fn.yadcf = function( options_arg: ArrayObjects, params: any ) {
  const tableSelector: string = '#' + this.settings()[0].sTableId;

  let i: number = 0,
      tmpParams: any,
      selector: string;

  // In case that instance.selector will be undefined (jQuery 3).
  if ( this.selector === undefined ) {
    this.selector = tableSelector;
  }

  if ( params === undefined ) {
    params = {};
  }

  if ( typeof params === 'string' ) {
    tmpParams               = params;
    params                  = {};
    params.filters_position = tmpParams;
  }

  if ( params.filters_position === undefined || params.filters_position === 'header' ) {
    params.filters_position = 'thead';
  } else {
    params.filters_position = 'tfoot';
  }

  $( document ).data( `${this.selector}_filters_position`, params.filters_position );

  if ( $( this.selector ).length === 1 ) {
    Yadcf.setOptions( this.selector, options_arg, params );
    Yadcf.initAndBindTable( this, this.selector, 0 );
  } else {
    for ( i; i < $( this.selector ).length; i++ ) {
      $.fn.dataTable.ext.iApiIndex = i;

      selector = `${this.selector}:eq(${i})`;

      Yadcf.setOptions( this.selector, options_arg, params );
      Yadcf.initAndBindTable( this, selector, i );
    }

    $.fn.dataTable.ext.iApiIndex = 0;
  }

  if ( params.onInitComplete !== undefined ) {
    params.onInitComplete();
  }

  return this;
};

const yadcf = Yadcf.instance();
export default yadcf;

const oTable = new DataTable( '#example', { stateSave: true });

console.log( oTable );
// console.log( 'settingsDt', $.fn.dataTable( oTable.context, oTable.data() ) );

//----------------------------------------------
//notice the new yadcf API for init the filters:
//----------------------------------------------

yadcf.init(
  oTable,
  [
    {
      column_number: 0
    },
    {
      column_number: 1,
      filter_type: 'range_number_slider'
    },
    {
      column_number: 2,
      filter_type: 'date'
    },
    {
      column_number: 3,
      filter_type: 'auto_complete',
      text_data_delimiter: ','
    },
    {
      column_number: 4,
      column_data_type: 'html',
      html_data_type: 'text',
      filter_default_label: 'Select tag'
    }
  ]
);

const oTable2 = new DataTable( '#entrys_table', {
  responsive: true,
  processing: true,
  data: [
    {
      "engine": "Trident",
      "browser": "Internet Explorer 4.0",
      "platform": {
        "inner": "Win 95+",
        "details": [
          "4",
          "X"
        ]
      }
    },
    {
      "engine": "Trident",
      "browser": "Internet Explorer 5.0",
      "platform": {
        "inner": "Win 95+",
        "details": [
          "5",
          "C"
        ]
      }
    },
    {
      "engine": "Trident",
      "browser": "Internet Explorer 5.5",
      "platform": {
        "inner": "Win 95+",
        "details": [
          "5.5",
          "A"
        ]
      }
    },
    {
      "engine": "Trident",
      "browser": "Internet Explorer 6",
      "platform": {
        "inner": "Win 98+",
        "details": [
          "6",
          "A"
        ]
      }
    },
    {
      "engine": "Trident",
      "browser": "Internet Explorer 7",
      "platform": {
        "inner": "Win XP SP2+",
        "details": [
          "7",
          "A"
        ]
      }
    },
    {
      "engine": "Trident",
      "browser": "AOL browser (AOL desktop)",
      "platform": {
        "inner": "Win XP",
        "details": [
          "6",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Firefox 1.0",
      "platform": {
        "inner": "Win 98+ / OSX.2+",
        "details": [
          "1.7",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Firefox 1.5",
      "platform": {
        "inner": "Win 98+ / OSX.2+",
        "details": [
          "1.8",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Firefox 2.0",
      "platform": {
        "inner": "Win 98+ / OSX.2+",
        "details": [
          "1.8",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Firefox 3.0",
      "platform": {
        "inner": "Win 2k+ / OSX.3+",
        "details": [
          "1.9",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Camino 1.0",
      "platform": {
        "inner": "OSX.2+",
        "details": [
          "1.8",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Camino 1.5",
      "platform": {
        "inner": "OSX.3+",
        "details": [
          "1.8",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Netscape 7.2",
      "platform": {
        "inner": "Win 95+ / Mac OS 8.6-9.2",
        "details": [
          "1.7",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Netscape Browser 8",
      "platform": {
        "inner": "Win 98SE+",
        "details": [
          "1.7",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Netscape Navigator 9",
      "platform": {
        "inner": "Win 98+ / OSX.2+",
        "details": [
          "1.8",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Mozilla 1.0",
      "platform": {
        "inner": "Win 95+ / OSX.1+",
        "details": [
          1,
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Mozilla 1.1",
      "platform": {
        "inner": "Win 95+ / OSX.1+",
        "details": [
          1.1,
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Mozilla 1.2",
      "platform": {
        "inner": "Win 95+ / OSX.1+",
        "details": [
          1.2,
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Mozilla 1.3",
      "platform": {
        "inner": "Win 95+ / OSX.1+",
        "details": [
          1.3,
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Mozilla 1.4",
      "platform": {
        "inner": "Win 95+ / OSX.1+",
        "details": [
          1.4,
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Mozilla 1.5",
      "platform": {
        "inner": "Win 95+ / OSX.1+",
        "details": [
          1.5,
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Mozilla 1.6",
      "platform": {
        "inner": "Win 95+ / OSX.1+",
        "details": [
          1.6,
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Mozilla 1.7",
      "platform": {
        "inner": "Win 98+ / OSX.1+",
        "details": [
          1.7,
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Mozilla 1.8",
      "platform": {
        "inner": "Win 98+ / OSX.1+",
        "details": [
          1.8,
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Seamonkey 1.1",
      "platform": {
        "inner": "Win 98+ / OSX.2+",
        "details": [
          "1.8",
          "A"
        ]
      }
    },
    {
      "engine": "Gecko",
      "browser": "Epiphany 2.20",
      "platform": {
        "inner": "Gnome",
        "details": [
          "1.8",
          "A"
        ]
      }
    },
    {
      "engine": "Webkit",
      "browser": "Safari 1.2",
      "platform": {
        "inner": "OSX.3",
        "details": [
          "125.5",
          "A"
        ]
      }
    },
    {
      "engine": "Webkit",
      "browser": "Safari 1.3",
      "platform": {
        "inner": "OSX.3",
        "details": [
          "312.8",
          "A"
        ]
      }
    },
    {
      "engine": "Webkit",
      "browser": "Safari 2.0",
      "platform": {
        "inner": "OSX.4+",
        "details": [
          "419.3",
          "A"
        ]
      }
    },
    {
      "engine": "Webkit",
      "browser": "Safari 3.0",
      "platform": {
        "inner": "OSX.4+",
        "details": [
          "522.1",
          "A"
        ]
      }
    },
    {
      "engine": "Webkit",
      "browser": "OmniWeb 5.5",
      "platform": {
        "inner": "OSX.4+",
        "details": [
          "420",
          "A"
        ]
      }
    },
    {
      "engine": "Webkit",
      "browser": "iPod Touch / iPhone",
      "platform": {
        "inner": "iPod",
        "details": [
          "420.1",
          "A"
        ]
      }
    },
    {
      "engine": "Webkit",
      "browser": "S60",
      "platform": {
        "inner": "S60",
        "details": [
          "413",
          "A"
        ]
      }
    },
    {
      "engine": "Presto",
      "browser": "Opera 7.0",
      "platform": {
        "inner": "Win 95+ / OSX.1+",
        "details": [
          "-",
          "A"
        ]
      }
    },
    {
      "engine": "Presto",
      "browser": "Opera 7.5",
      "platform": {
        "inner": "Win 95+ / OSX.2+",
        "details": [
          "-",
          "A"
        ]
      }
    },
    {
      "engine": "Presto",
      "browser": "Opera 8.0",
      "platform": {
        "inner": "Win 95+ / OSX.2+",
        "details": [
          "-",
          "A"
        ]
      }
    },
    {
      "engine": "Presto",
      "browser": "Opera 8.5",
      "platform": {
        "inner": "Win 95+ / OSX.2+",
        "details": [
          "-",
          "A"
        ]
      }
    },
    {
      "engine": "Presto",
      "browser": "Opera 9.0",
      "platform": {
        "inner": "Win 95+ / OSX.3+",
        "details": [
          "-",
          "A"
        ]
      }
    },
    {
      "engine": "Presto",
      "browser": "Opera 9.2",
      "platform": {
        "inner": "Win 88+ / OSX.3+",
        "details": [
          "-",
          "A"
        ]
      }
    },
    {
      "engine": "Presto",
      "browser": "Opera 9.5",
      "platform": {
        "inner": "Win 88+ / OSX.3+",
        "details": [
          "-",
          "A"
        ]
      }
    },
    {
      "engine": "Presto",
      "browser": "Opera for Wii",
      "platform": {
        "inner": "Wii",
        "details": [
          "-",
          "A"
        ]
      }
    },
    {
      "engine": "Presto",
      "browser": "Nokia N800",
      "platform": {
        "inner": "N800",
        "details": [
          "-",
          "A"
        ]
      }
    },
    {
      "engine": "Presto",
      "browser": "Nintendo DS browser",
      "platform": {
        "inner": "Nintendo DS",
        "details": [
          "8.5",
          "C/A"
        ]
      }
    },
    {
      "engine": "KHTML",
      "browser": "Konqureror 3.1",
      "platform": {
        "inner": "KDE 3.1",
        "details": [
          "3.1",
          "C"
        ]
      }
    },
    {
      "engine": "KHTML",
      "browser": "Konqureror 3.3",
      "platform": {
        "inner": "KDE 3.3",
        "details": [
          "3.3",
          "A"
        ]
      }
    },
    {
      "engine": "KHTML",
      "browser": "Konqureror 3.5",
      "platform": {
        "inner": "KDE 3.5",
        "details": [
          "3.5",
          "A"
        ]
      }
    },
    {
      "engine": "Tasman",
      "browser": "Internet Explorer 4.5",
      "platform": {
        "inner": "Mac OS 8-9",
        "details": [
          "-",
          "X"
        ]
      }
    },
    {
      "engine": "Tasman",
      "browser": "Internet Explorer 5.1",
      "platform": {
        "inner": "Mac OS 7.6-9",
        "details": [
          "1",
          "C"
        ]
      }
    },
    {
      "engine": "Tasman",
      "browser": "Internet Explorer 5.2",
      "platform": {
        "inner": "Mac OS 8-X",
        "details": [
          "1",
          "C"
        ]
      }
    },
    {
      "engine": "Misc",
      "browser": "NetFront 3.1",
      "platform": {
        "inner": "Embedded devices",
        "details": [
          "-",
          "C"
        ]
      }
    },
    {
      "engine": "Misc",
      "browser": "NetFront 3.4",
      "platform": {
        "inner": "Embedded devices",
        "details": [
          "-",
          "A"
        ]
      }
    },
    {
      "engine": "Misc",
      "browser": "Dillo 0.8",
      "platform": {
        "inner": "Embedded devices",
        "details": [
          "-",
          "X"
        ]
      }
    },
    {
      "engine": "Misc",
      "browser": "Links",
      "platform": {
        "inner": "Text only",
        "details": [
          "-",
          "X"
        ]
      }
    },
    {
      "engine": "Misc",
      "browser": "Lynx",
      "platform": {
        "inner": "Text only",
        "details": [
          "-",
          "X"
        ]
      }
    },
    {
      "engine": "Misc",
      "browser": "IE Mobile",
      "platform": {
        "inner": "Windows Mobile 6",
        "details": [
          "-",
          "C"
        ]
      }
    },
    {
      "engine": "Misc",
      "browser": "PSP browser",
      "platform": {
        "inner": "PSP",
        "details": [
          "-",
          "C"
        ]
      }
    },
    {
      "engine": "Other browsers",
      "browser": "All others",
      "platform": {
        "inner": "-",
        "details": [
          "-",
          "U"
        ]
      }
    }
  ],
  columns: [
    {
      data: 'engine'
    },
    {
      data: 'browser'
    },
    {
      data: 'platform.inner'
    },
    {
      data: 'platform.details.0'
    },
    {
      data: 'platform.details.1'
    }
  ]
});

console.log( oTable2 );

//----------------------------------------------
//notice the new yadcf API for init the filters:
//----------------------------------------------

yadcf.init(
  oTable2,
  [
    {
      column_number: 0
    },
    {
      column_number: 1,
      filter_type: 'text',
      exclude: true,
      exclude_label: '!(not)'
    },
    {
      column_number: 2,
      filter_type: 'auto_complete'
    },
    {
      column_number: 3,
      filter_type: 'range_number_slider',
      ignore_char: '-'
    },
    {
      column_number: 4
    }
  ]
);

yadcf.exFilterColumn( oTable2, [
  [ 0, 'Misc' ]
] );

yadcf.initMultipleTables(
  [ oTable, oTable2 ],
  [ {
    filter_container_id: 'multi-table-filter',
    filter_default_label: 'Filter all tables!'
  } ]
);