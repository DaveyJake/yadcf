/*!
* Yet Another DataTables Column Filter - (yadcf)
*
* File:        jquery.dataTables.Yadcf.js
* Version:     0.9.6.beta.1
*
* Author:      Davey Jacobson
* Info:        https://github.com/DaveyJake/yadcf
* Contact:     daveyjake21[at]geemail[dot]com
* Q&A          http://stackoverflow.com/questions/tagged/yadcf
*
* Copyright 2015 Daniel Reznick, all rights reserved.
* Copyright 2015 Released under the MIT License
* Copyright 2024 Released under the MIT License
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
                                    Bootstrap datepicker depends moment library. This plugin depends on moment too.

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
* Usage example Yadcf.init(oTable,[{column_number : 0}, {column_number: 3}],{cumulative_filtering: true});
* -------------

* externally_triggered
                Required:           false
                Type:               boolean
                Default value:      false
                Description:        Filters will filter only when Yadcf.exFilterExternallyTriggered(table_arg) is called
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
                Usage example:      Yadcf.exFilterColumn(oTable, [[0, 'Some Data 2']]); //pre filter one column
                                    Yadcf.exFilterColumn(oTable, [[0, 'Some Data 1'], [1, {from: 111, to: 1110}], [2, {from: '', to: '11/25/2014'}]]); //pre filter several columns
                                    Yadcf.exFilterColumn(oTable, [[0, ['Some Data 1','Some Data 2']]]); // for pre filtering multi select filter you should use array with values (or an array with single value)

* exGetColumnFilterVal
                Description:        Allows to retrieve  column current filtered value (support ALL filter types!!!)
                Arguments:          table_arg: (variable of the datatable),
                                    column number:  column number from which we want the value
                Usage example:      Yadcf.exGetColumnFilterVal(oTable,1);
                Return value:       String (for simple filter) / Object (for range filter) with from and to properties / Array of strings for multi_select filter

* exResetAllFilters
                Description:        Allows to reset all filters externally/programmatically (support ALL filter types!!!) , perfect for adding a 'reset all' button to your page!
                Arguments:          table_arg: (variable of the datatable)
                                    noRedraw:   (boolean) , use it if you don't want your table to be reloaded after the filter reset,
                                                for example if you planning to call exFilterColumn function right after the exResetAllFilters (to avoid two AJAX requests)
                Usage example:      Yadcf.exResetAllFilters(oTable);

* exResetFilters
                Description:        Allows to reset specific filters externally/programmatically (support ALL filter types!!!) , can be used for resetting one or more filters
                Arguments:          table_arg: (variable of the datatable)
                                    array with columns numbers
                                    noRedraw:   (boolean) , use it if you don't want your table to be reloaded after the filter reset,
                                                for example if you planning to call exFilterColumn function right after the exResetFilters (to avoid two AJAX requests)
                Usage example:      Yadcf.exResetFilters(oTable, [1,2]);

* initSelectPluginCustomTriggers
                Description:        Allows to set any select jquery plugin initialize and refresh functions. jQuery selector will be passed to the user defined function to initialize and refresh the plugin.
                                    Great for integrating any jquery select plugin  (Selectize / MultiSelect / etc)
                Arguments:          initFunc  : function which will initialize the plugin
                                    refreshFunc : function that will refresh the plugin.
                                    destroyFunc : function that will destroy the plugin (upon table destroy even trigger).
                Usage example:      Yadcf.initSelectPluginCustomTriggers(function ($filterSelector){$filterSelector.multiselect({});}, function ($filterSelector){$filterSelector.multiselect('refresh')}, , function ($filterSelector){$filterSelector.multiselect('destroy')});

* exFilterExternallyTriggered
                Description:        Triggers all the available filters, should be used only when the externally_triggered option used
                Arguments:          table_arg: (variable of the datatable)
                Usage example:      Yadcf.exFilterExternallyTriggered(table_arg);

* exRefreshColumnFilterWithDataProp
                Description:        Updates column filter with new data, when data property was used in initialization for this filter
                                    e.g. select filter, when we used data property and we want to update it
                Arguments:          table_arg: variable of the datatable
                                    col_num: number index of column filter
                                    updatedData: array of new data (use same data structure as was used in Yadcf.init options)
                Usage example:      Yadcf.exRefreshColumnFilterWithDataProp(table_arg, 5, ['One', 'Two', 'Three']);

* initOnDtXhrComplete
                Description:        Allows to set a callback function to be called after dt xhr finishes
                Arguments:          function to do some logic
                Usage example:      Yadcf.initOnDtXhrComplete(function() { $('#yadcf-filter--example-0').multiselect('refresh'); });

* initDefaults
                Description:        Init global defaults for all yadcf instances.
                Arguments:          Object consisting of anything defined inside default_options variable
                Usage example:      Yadcf.initDefaults({language: {select: 'Pick some'}});

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
                Usage example:      Yadcf.initMultipleTables([oTable, oTable2], [{
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
                Usage example:      Yadcf.initMultipleColumns(oTable, [{
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jquery_1 = require("jquery");
require("chosen-js");
var includes_1 = require("lodash/includes");
var trim_1 = require("lodash/trim");
require("./polyfills");
var moment_1 = require("moment");
var Yadcf = /** @class */ (function () {
    function Yadcf() {
        this.yadcfDelay = (function () {
            var timer = 0;
            return function (callback, ms, param) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    callback(param);
                }, ms);
                return timer;
            };
        }());
    }
    /**
     * Primary constructor.
     *
     * @returns yadcf
     */
    Yadcf.instance = function () {
        if (Yadcf._instance === null) {
            Yadcf._instance = {
                init: Yadcf.init,
                doFilter: Yadcf.doFilter,
                doFilterMultiSelect: Yadcf.doFilterMultiSelect,
                doFilterAutocomplete: Yadcf.doFilterAutocomplete,
                autocompleteKeyUP: Yadcf.autocompleteKeyUP,
                getOptions: Yadcf.getOptions,
                initDefaults: Yadcf.initDefaults,
                rangeNumberKeyUP: Yadcf.rangeNumberKeyUP,
                rangeDateKeyUP: Yadcf.rangeDateKeyUP,
                rangeClear: Yadcf.rangeClear,
                rangeNumberSliderClear: Yadcf.rangeNumberSliderClear,
                stopPropagation: Yadcf.stopPropagation,
                exFilterColumn: Yadcf.exFilterColumn,
                exGetColumnFilterVal: Yadcf.exGetColumnFilterVal,
                exResetAllFilters: Yadcf.exResetAllFilters,
                dateKeyUP: Yadcf.dateKeyUP,
                dateSelectSingle: Yadcf.dateSelectSingle,
                textKeyUP: Yadcf.textKeyUP,
                nullChecked: Yadcf.nullChecked,
                doFilterCustomDateFunc: Yadcf.doFilterCustomDateFunc,
                eventTargetFixUp: Yadcf.eventTargetFixUp,
                initMultipleTables: Yadcf.initMultipleTables,
                initMultipleColumns: Yadcf.initMultipleColumns,
                textKeyUpMultiTables: Yadcf.textKeyUpMultiTables,
                doFilterMultiTables: Yadcf.doFilterMultiTables,
                doFilterMultiTablesMultiSelect: Yadcf.doFilterMultiTablesMultiSelect,
                generateTableSelectorJQFriendlyNew: Yadcf.generateTableSelectorJQFriendlyNew,
                exFilterExternallyTriggered: Yadcf.exFilterExternallyTriggered,
                exResetFilters: Yadcf.exResetFilters,
                initSelectPluginCustomTriggers: Yadcf.initSelectPluginCustomTriggers,
                preventDefaultForEnter: Yadcf.preventDefaultForEnter,
                generateTableSelectorJQFriendly2: Yadcf.generateTableSelectorJQFriendly2,
                exRefreshColumnFilterWithDataProp: Yadcf.exRefreshColumnFilterWithDataProp,
                initOnDtXhrComplete: Yadcf.initOnDtXhrComplete
            };
        }
        return Yadcf._instance;
    };
    // From ColReorder (SpryMedia Ltd (www.sprymedia.co.uk)).
    Yadcf.getSettingsObjFromTable = function (dt) {
        var oConfig;
        if (jquery_1.default.fn.dataTable.Api) {
            oConfig = new jquery_1.default.fn.dataTable.Api(dt).settings()[0];
        }
        else if (dt.fnSettings) { // 1.9 compatibility
            // DataTables object, convert to the settings object
            oConfig = dt.fnSettings();
        }
        else if (typeof dt === 'string') { // jQuery selector
            if (jquery_1.default.fn.dataTable.isDataTable((0, jquery_1.default)(dt)[0])) {
                // @ts-ignore
                oConfig = (0, jquery_1.default)(dt).eq(0).dataTable().fnSettings();
            }
        }
        else if (dt.nodeName && dt.nodeName.toLowerCase() === 'table') {
            // Table node
            if (jquery_1.default.fn.dataTable.isDataTable(dt.nodeName)) {
                // @ts-ignore
                oConfig = (0, jquery_1.default)(dt.nodeName).dataTable().fnSettings();
            }
        }
        else if (dt instanceof jQuery) {
            // jQuery object
            if (jquery_1.default.fn.dataTable.isDataTable(dt[0])) {
                oConfig = dt[0].dataTable().fnSettings();
            }
        }
        else {
            // DataTables settings object
            oConfig = dt;
        }
        return oConfig;
    };
    Yadcf.arraySwapValueWithIndex = function (pArray) {
        var tmp = [], i;
        for (i = 0; i < pArray.length; i++) {
            tmp[pArray[i]] = i;
        }
        return tmp;
    };
    Yadcf.arraySwapValueWithIndex2 = function (pArray) {
        var tmp = [], i;
        for (i = 0; i < pArray.length; i++) {
            tmp[pArray[i]._ColReorder_iOrigCol] = i;
        }
        return tmp;
    };
    Yadcf.initColReorder2 = function (settingsDt, table_selector_jq_friendly) {
        if (settingsDt.oSavedState && settingsDt.oSavedState.ColReorder !== undefined) {
            if (this.plugins[table_selector_jq_friendly] === undefined) {
                this.plugins[table_selector_jq_friendly] = {};
                this.plugins[table_selector_jq_friendly].ColReorder = this.arraySwapValueWithIndex(settingsDt.oSavedState.ColReorder);
            }
        }
        else if (settingsDt.aoColumns[0]._ColReorder_iOrigCol !== undefined) {
            if (this.plugins[table_selector_jq_friendly] === undefined) {
                this.plugins[table_selector_jq_friendly] = {};
                this.plugins[table_selector_jq_friendly].ColReorder = this.arraySwapValueWithIndex2(settingsDt.aoColumns);
            }
        }
    };
    Yadcf.initColReorderFromEvent = function (table_selector_jq_friendly) {
        this.plugins[table_selector_jq_friendly] = undefined;
    };
    Yadcf.columnsArrayToString = function (column_number) {
        var column_number_obj = {
            column_number_str: '',
            column_number: []
        };
        if (column_number !== undefined) {
            if (column_number instanceof Array) {
                column_number_obj.column_number_str = column_number.join('_');
            }
            else {
                column_number_obj.column_number_str = column_number.toString();
                column_number = [];
                column_number.push(column_number_obj.column_number_str);
            }
        }
        else {
            column_number_obj.column_number_str = 'global';
        }
        column_number_obj.column_number = column_number;
        return column_number_obj;
    };
    Yadcf.initDefaults = function (params) {
        return jquery_1.default.extend(true, this.default_options, params);
    };
    Yadcf.getOptions = function (selector) {
        return this.options[selector];
    };
    Yadcf.getAllOptions = function () {
        return this.options;
    };
    Yadcf.eventTargetFixUp = function (pEvent) {
        if (pEvent.target === undefined) {
            jquery_1.default.extend(pEvent, { target: pEvent.srcElement });
        }
        return pEvent;
    };
    Yadcf.dot2obj = function (tmpObj, dot_refs) {
        var i = 0;
        dot_refs = dot_refs.split('.');
        for (i = 0; i < dot_refs.length; i++) {
            if (tmpObj[dot_refs[i]] !== undefined && tmpObj[dot_refs[i]] !== null) {
                tmpObj = tmpObj[dot_refs[i]];
            }
            else {
                return '';
            }
        }
        return tmpObj;
    };
    Yadcf.setOptions = function (selector_arg, options_arg, params, table) {
        var tmpOptions = {}, i, col_num_as_int;
        //adaptContainerCssClassImpl = function (dummy) { return ''; };
        this.default_options = jquery_1.default.extend(true, this.default_options, params);
        if (options_arg.length === undefined) {
            this.options[selector_arg] = options_arg;
            return;
        }
        for (i = 0; i < options_arg.length; i++) {
            if (options_arg[i].date_format !== undefined && options_arg[i].moment_date_format === undefined) {
                options_arg[i].moment_date_format = options_arg[i].date_format;
            }
            if (options_arg[i].select_type === 'select2') {
                this.default_options.select_type_options = {
                //adaptContainerCssClass: adaptContainerCssClassImpl
                };
            }
            // No individual reset button for `externally_triggered` mode.
            if (this.default_options.externally_triggered === true) {
                options_arg[i].filter_reset_button_text = false;
            }
            // Validate custom function required attributes.
            if (options_arg[i].filter_type !== undefined && options_arg[i].filter_type.indexOf('custom_func') !== -1) {
                if (options_arg[i].custom_func === undefined) {
                    console.log("Error: You are trying to use filter_type: \"custom_func / multi_select_custom_func\" for column ".concat(options_arg[i].column_number, " but there is no such custom_func attribute provided (custom_func: \"function reference goes here...\")"));
                    return;
                }
            }
            if (!options_arg[i].column_selector) {
                col_num_as_int = +options_arg[i].column_number;
                if (isNaN(col_num_as_int)) {
                    tmpOptions[options_arg[i].column_number_str] = jquery_1.default.extend(true, {}, this.default_options, options_arg[i]);
                }
                else {
                    tmpOptions[col_num_as_int] = jquery_1.default.extend(true, {}, this.default_options, options_arg[i]);
                }
            }
            else {
                if (table && table.column) {
                    // Translate from `column_selector` to `column_number`.
                    var columnNumber = table.column(options_arg[i].column_selector);
                    if (columnNumber.index() >= 0) {
                        options_arg[i].column_number = columnNumber.index();
                        tmpOptions[options_arg[i].column_number] = jquery_1.default.extend(true, {}, this.default_options, options_arg[i]);
                    }
                }
            }
        }
        this.options[selector_arg] = tmpOptions;
        this.check3rdPPluginsNeededClose();
    };
    Yadcf.check3rdPPluginsNeededClose = function () {
        var _this = this;
        Object.entries(this.getAllOptions()).forEach(function (tableEntry) {
            Object.entries(tableEntry[1]).forEach(function (columnEntry) {
                if (columnEntry[1].datepicker_type === 'bootstrap-datepicker') {
                    if (columnEntry[1].filter_type === 'range_date') {
                        _this.closeBootstrapDatepickerRange = true;
                    }
                    else {
                        _this.closeBootstrapDatepicker = true;
                    }
                }
                else if (columnEntry[1].select_type === 'select2') {
                    _this.closeSelect2 = true;
                }
            });
        });
    };
    // Taken and modified from DataTables 1.10.0-beta.2 source.
    Yadcf.yadcfVersionCheck = function (version) {
        // @ts-ignore
        var aThis = jquery_1.default.fn.dataTable.ext.sVersion.split('.'), aThat = version.split('.'), iThis, iThat, i, iLen;
        for (i = 0, iLen = aThat.length; i < iLen; i++) {
            iThis = parseInt(aThis[i], 10) || 0;
            iThat = parseInt(aThat[i], 10) || 0;
            // Parts are the same, keep comparing.
            if (iThis === iThat) {
                continue;
            }
            // Parts are different, return immediately
            return iThis > iThat;
        }
        return true;
    };
    Yadcf.resetIApiIndex = function () {
        jquery_1.default.fn.dataTable.ext.iApiIndex = 0;
    };
    Yadcf.escapeRegExp = function (string) {
        return string.replace(/([.*+?^=!:${}()|'\[\]\/\\])/g, '\\$1');
    };
    Yadcf.escapeRegExpInArray = function (arr) {
        var i;
        for (i = 0; i < arr.length; i++) {
            arr[i] = arr[i].replace(/([.*+?^=!:${}()|'\[\]\/\\])/g, '\\$1');
        }
        return arr;
    };
    Yadcf.replaceAll = function (string, find, replace) {
        return string.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    };
    Yadcf.getTableId = function (obj) {
        var tableId;
        if (obj.table !== undefined) {
            var node = obj.table().node();
            if (typeof node.id !== 'undefined') {
                tableId = node.id;
            }
        }
        else {
            tableId = this.getSettingsObjFromTable(obj).sTableId;
        }
        return tableId;
    };
    Yadcf.generateTableSelectorJQFriendly2 = function (obj) {
        var tmpStr;
        if (obj.oInstance !== undefined && obj.oInstance.selector !== undefined) {
            tmpStr = obj.oInstance.selector;
        }
        else if (obj.selector !== undefined) {
            tmpStr = obj.selector;
        }
        else if (obj.table !== undefined) {
            tmpStr = obj.table().node().id;
        }
        else {
            return '';
        }
        tmpStr = this.replaceAll(tmpStr, '.', '-');
        tmpStr = this.replaceAll(tmpStr, ' ', '');
        return tmpStr.replace(':', '-').replace('(', '').replace(')', '').replace('#', '-');
    };
    Yadcf.generateTableSelectorJQFriendlyNew = function (tmpStr) {
        tmpStr = this.replaceAll(tmpStr, ':', '-');
        tmpStr = this.replaceAll(tmpStr, '(', '');
        tmpStr = this.replaceAll(tmpStr, ')', '');
        tmpStr = this.replaceAll(tmpStr, ',', '');
        tmpStr = this.replaceAll(tmpStr, '.', '-');
        tmpStr = this.replaceAll(tmpStr, '#', '-');
        tmpStr = this.replaceAll(tmpStr, ' ', '');
        return tmpStr;
    };
    Yadcf.initializeSelectPlugin = function (select_type, selectObject, select_type_options) {
        var $selectObject = typeof selectObject === 'string' ? (0, jquery_1.default)(selectObject) : selectObject;
        if (select_type === 'chosen' && typeof jquery_1.default.fn.chosen === 'function') {
            $selectObject.chosen(select_type_options);
            $selectObject.next().on('click mousedown', this.stopPropagation);
            this.refreshSelectPlugin({ select_type: select_type, select_type_options: select_type_options }, $selectObject);
        }
        else if (select_type === 'select2') {
            if (!$selectObject.data('select2')) {
                $selectObject.select2(select_type_options);
            }
            if ($selectObject.next().hasClass('select2-container')) {
                $selectObject.next().on('click mousedown', this.stopPropagation);
            }
        }
        else if (select_type === 'custom_select') {
            this.selectElementCustomInitFunc($selectObject);
            $selectObject.next().on('click mousedown', this.stopPropagation);
        }
    };
    Yadcf.refreshSelectPlugin = function (columnObj, selectObject, val) {
        var $selectObject = typeof selectObject === 'string' ? (0, jquery_1.default)(selectObject) : selectObject;
        var select_type = columnObj.select_type, select_type_options = columnObj.select_type_options;
        if (select_type === 'chosen') {
            $selectObject.trigger('chosen:updated');
        }
        else if (select_type === 'select2') {
            if (!$selectObject.data('select2')) {
                $selectObject.select2(select_type_options);
            }
            if (val !== undefined) {
                $selectObject.val(val);
            }
            $selectObject.trigger('change');
        }
        else if (select_type === 'custom_select') {
            this.selectElementCustomRefreshFunc($selectObject);
        }
    };
    Yadcf.initSelectPluginCustomTriggers = function (initFunc, refreshFunc, destroyFunc) {
        this.selectElementCustomInitFunc = initFunc;
        this.selectElementCustomRefreshFunc = refreshFunc;
        this.selectElementCustomDestroyFunc = destroyFunc;
    };
    Yadcf.initOnDtXhrComplete = function (initFunc) {
        this.dTXhrComplete = initFunc;
    };
    // Used by `exFilterColumn` for translating readable search value into proper search string for datatables filtering.
    Yadcf.yadcfMatchFilterString = function (table_arg, column_number, selected_value, filter_match_mode, multiple, exclude) {
        var case_insensitive = Yadcf.getOptions(table_arg.selector)[column_number].case_insensitive, ret_val;
        if (!selected_value) {
            return '';
        }
        table_arg.fnSettings().aoPreSearchCols[column_number].bSmart = false;
        table_arg.fnSettings().aoPreSearchCols[column_number].bRegex = true;
        table_arg.fnSettings().aoPreSearchCols[column_number].bCaseInsensitive = case_insensitive;
        if (multiple === undefined || multiple === false) {
            if (exclude !== true) {
                if (filter_match_mode === 'contains') {
                    table_arg.fnSettings().aoPreSearchCols[column_number].bSmart = true;
                    table_arg.fnSettings().aoPreSearchCols[column_number].bRegex = false;
                    ret_val = selected_value;
                }
                else if (filter_match_mode === 'exact') {
                    ret_val = '^' + selected_value + '$';
                }
                else if (filter_match_mode === 'startsWith') {
                    ret_val = '^' + selected_value;
                }
                else if (filter_match_mode === 'regex') {
                    ret_val = selected_value;
                }
            }
            else {
                ret_val = '^((?!' + selected_value + ').)*$';
            }
        }
        else {
            if (filter_match_mode !== 'regex') {
                if (!(selected_value instanceof Array)) {
                    selected_value = [selected_value];
                }
                selected_value = this.escapeRegExpInArray(selected_value);
            }
            if (filter_match_mode === 'contains') {
                ret_val = selected_value.join('|');
            }
            else if (filter_match_mode === 'exact') {
                ret_val = '^(' + selected_value.join('|') + ')$';
            }
            else if (filter_match_mode === 'startsWith') {
                ret_val = '^(' + selected_value.join('|') + ')';
            }
            else if (filter_match_mode === 'regex') {
                ret_val = selected_value;
            }
        }
        return ret_val;
    };
    Yadcf.yadcfMatchFilter = function (oTable, selected_value, filter_match_mode, column_number, exclude, original_column_number) {
        var columnObj = this.getOptions(oTable.selector)[original_column_number], case_insensitive = columnObj.case_insensitive;
        if (exclude !== true) {
            if (filter_match_mode === 'contains') {
                oTable.fnFilter(selected_value, column_number, false, false, true, case_insensitive);
            }
            else if (filter_match_mode === 'exact') {
                var prefix = '^';
                var suffix = '$';
                if (columnObj.text_data_delimiter !== undefined) {
                    var text_data_delimiter = this.escapeRegExp(columnObj.text_data_delimiter);
                    prefix = '(' + prefix + '|' + text_data_delimiter + ')';
                    suffix = '(' + suffix + '|' + text_data_delimiter + ')';
                }
                selected_value = this.escapeRegExp(selected_value);
                oTable.fnFilter(prefix + selected_value + suffix, column_number, true, false, true, case_insensitive);
            }
            else if (filter_match_mode === 'startsWith') {
                selected_value = this.escapeRegExp(selected_value);
                oTable.fnFilter('^' + selected_value, column_number, true, false, true, case_insensitive);
            }
            else if (filter_match_mode === 'regex') {
                try {
                    //validate regex, only call fnFilter if valid
                    new RegExp(selected_value);
                }
                catch (error) {
                    return;
                }
                oTable.fnFilter(selected_value, column_number, true, false, true, case_insensitive);
            }
        }
        else {
            if (filter_match_mode === 'exact') {
                selected_value = '^' + this.escapeRegExp(selected_value) + '$';
            }
            else if (filter_match_mode === 'startsWith') {
                selected_value = '^' + this.escapeRegExp(selected_value);
            }
            oTable.fnFilter('^((?!' + selected_value + ').)*$', column_number, true, false, true, case_insensitive);
        }
    };
    Yadcf.yadcfParseMatchFilter = function (tmpStr, filter_match_mode) {
        var retVal;
        if (filter_match_mode === 'contains') {
            retVal = tmpStr;
        }
        else if (filter_match_mode === 'exact') {
            retVal = tmpStr.substring(1, tmpStr.length - 1);
            retVal = retVal.replace(/([\\])/g, '');
        }
        else if (filter_match_mode === 'startsWith') {
            retVal = tmpStr.substring(1, tmpStr.length);
            retVal = retVal.replace(/([\\])/g, '');
        }
        else if (filter_match_mode === 'regex') {
            retVal = tmpStr;
        }
        return retVal;
    };
    Yadcf.doFilterCustomDateFunc = function (arg, table_selector_jq_friendly, column_number) {
        var oTable = this.oTables[table_selector_jq_friendly], columnObj = this.getOptions(oTable.selector)[column_number], yadcfState;
        if (arg === 'clear' && this.exGetColumnFilterVal(oTable, column_number) === '') {
            return;
        }
        if (typeof arg === 'object' && arg.value !== undefined && arg.value !== '-1') {
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse');
        }
        else {
            //when arg === 'clear' or arg.value === '-1'
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val('-1').trigger('focus');
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse');
            this.refreshSelectPlugin(columnObj, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)), '-1');
        }
        if (!oTable.fnSettings().oLoadedState) {
            oTable.fnSettings().oLoadedState = {};
            oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
        }
        if (oTable.fnSettings().oFeatures.bStateSave === true && typeof arg === 'object') {
            if (oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number] = { from: arg.value };
            }
            else {
                yadcfState = {};
                yadcfState[table_selector_jq_friendly] = [];
                yadcfState[table_selector_jq_friendly][column_number] = { from: arg.value };
                oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
            }
            oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
        }
        oTable.fnDraw();
    };
    Yadcf.calcColumnNumberFilter = function (settingsDt, column_number, table_selector_jq_friendly) {
        var column_number_filter;
        if ((settingsDt.oSavedState && settingsDt.oSavedState.ColReorder !== undefined) ||
            settingsDt.colReorder ||
            (this.plugins[table_selector_jq_friendly] !== undefined && this.plugins[table_selector_jq_friendly].ColReorder !== undefined)) {
            this.initColReorder2(settingsDt, table_selector_jq_friendly);
            column_number_filter = this.plugins[table_selector_jq_friendly].ColReorder[column_number];
        }
        else {
            column_number_filter = column_number;
        }
        return column_number_filter;
    };
    Yadcf.doFilter = function (arg, table_selector_jq_friendly, column_number, filter_match_mode) {
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        var oTable = this.oTables[table_selector_jq_friendly], exclude_checked = false, settingsDt = this.getSettingsObjFromTable(oTable), selected_value, selector, data_value, column_number_filter, columnObj;
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        columnObj = this.getOptions(oTable.selector)[column_number];
        if (columnObj.exclude) {
            exclude_checked = (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('.yadcf-exclude-wrapper :checkbox').prop('checked');
        }
        if (arg === 'clear') {
            this.clearStateSave(oTable, column_number, table_selector_jq_friendly);
            if (exclude_checked) {
                var elId = "#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number);
                this.resetExcludeRegexCheckboxes((0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)));
                this.clearStateSave(oTable, column_number, table_selector_jq_friendly);
            }
            if (this.exGetColumnFilterVal(oTable, column_number) === '') {
                return;
            }
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val('-1').trigger('focus');
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse');
            (0, jquery_1.default)(document).data("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val"), '-1');
            oTable.fnFilter('', column_number_filter);
            this.resetIApiIndex();
            this.refreshSelectPlugin(columnObj, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)), '-1');
            return;
        }
        if (arg === 'exclude' && (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('option:selected').val().trim() === '-1') {
            return;
        }
        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse');
        selector = arg === 'exclude' ? "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number) : arg;
        selected_value = (0, jquery_1.default)(selector).find('option:selected').val().trim();
        data_value = ((typeof arg !== 'object' && arg === 'exclude') || exclude_checked) ? selected_value : arg.value;
        (0, jquery_1.default)(document).data("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val"), data_value);
        if ((typeof arg === 'object' && arg.value !== '-1') && selected_value !== columnObj.select_null_option) {
            if (oTable.fnSettings().oFeatures.bServerSide === false) {
                oTable.fnDraw();
            }
            this.yadcfMatchFilter(oTable, selected_value, filter_match_mode, column_number_filter, exclude_checked, column_number);
        }
        else if (selected_value === columnObj.select_null_option) {
            if (oTable.fnSettings().oFeatures.bServerSide === false) {
                oTable.fnFilter('', column_number_filter);
                this.addNullFilterCapability(table_selector_jq_friendly, column_number, true);
                oTable.fnDraw();
            }
            else {
                this.yadcfMatchFilter(oTable, selected_value, filter_match_mode, column_number_filter, exclude_checked, column_number);
            }
            if (oTable.fnSettings().oFeatures.bStateSave === true) {
                this.stateSaveNullSelect(oTable, columnObj, table_selector_jq_friendly, column_number, filter_match_mode, exclude_checked);
                oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
            }
        }
        else {
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse');
            oTable.fnFilter('', column_number_filter);
        }
        this.resetIApiIndex();
    };
    Yadcf.stateSaveNullSelect = function (oTable, columnObj, table_selector_jq_friendly, column_number, filter_match_mode, exclude_checked) {
        var null_str = columnObj.select_null_option;
        switch (filter_match_mode) {
            case 'exact':
                null_str = '^' + this.escapeRegExp(null_str) + '$';
                break;
            case 'startsWith':
                null_str = '^' + this.escapeRegExp(null_str);
                break;
            default:
                break;
        }
        var excludeStrStart = '^((?!';
        var excludeStrEnd = ').)*$';
        null_str = exclude_checked ? (excludeStrStart + null_str + excludeStrEnd) : null_str;
        if (oTable.fnSettings().oLoadedState) {
            if (oTable.fnSettings().oLoadedState.yadcfState !== undefined &&
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                oTable.fnSettings().aoPreSearchCols[column_number].sSearch = null_str;
            }
        }
    };
    Yadcf.doFilterMultiSelect = function (arg, table_selector_jq_friendly, column_number, filter_match_mode) {
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        var oTable = this.oTables[table_selector_jq_friendly], selected_values = (0, jquery_1.default)(arg).val(), selected_values_trimmed = [], i, stringForSearch, column_number_filter, settingsDt = this.getSettingsObjFromTable(oTable);
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        (0, jquery_1.default)(document).data("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val"), selected_values);
        if (selected_values !== null) {
            for (i = selected_values.length - 1; i >= 0; i--) {
                if (selected_values[i] === '-1') {
                    selected_values.splice(i, 1);
                    break;
                }
            }
            for (i = 0; i < selected_values.length; i++) {
                selected_values_trimmed.push((0, trim_1.default)(selected_values[i]));
            }
            if (selected_values_trimmed.length !== 0) {
                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse');
                if (filter_match_mode !== 'regex') {
                    stringForSearch = selected_values_trimmed.join('narutouzomaki');
                    stringForSearch = stringForSearch.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
                    stringForSearch = stringForSearch.split('narutouzomaki').join('|');
                    if (filter_match_mode === 'contains') {
                        oTable.fnFilter(stringForSearch, column_number_filter, true, false, true); //'^((?!' + stringForSearch + ').)*$'
                    }
                    else if (filter_match_mode === 'exact') {
                        oTable.fnFilter('^(' + stringForSearch + ')$', column_number_filter, true, false, true);
                    }
                    else if (filter_match_mode === 'startsWith') {
                        oTable.fnFilter('^(' + stringForSearch + ')', column_number_filter, true, false, true);
                    }
                }
                else {
                    stringForSearch = selected_values_trimmed.join('|');
                    oTable.fnFilter(stringForSearch, column_number_filter, true, false, true);
                }
            }
            else {
                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse');
                oTable.fnFilter('', column_number_filter);
            }
        }
        else {
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse');
            oTable.fnFilter('', column_number_filter);
        }
        this.resetIApiIndex();
    };
    Yadcf.yadcfParseMatchFilterMultiSelect = function (tmpStr, filter_match_mode) {
        var retVal;
        if (filter_match_mode === 'contains') {
            retVal = tmpStr;
        }
        else if (filter_match_mode === 'exact') {
            retVal = tmpStr.substring(1, tmpStr.length - 1);
            retVal = retVal.substring(1, retVal.length - 1);
        }
        else if (filter_match_mode === 'startsWith') {
            retVal = tmpStr.substring(1, tmpStr.length);
            retVal = retVal.substring(1, retVal.length - 1);
        }
        else if (filter_match_mode === 'regex') {
            retVal = tmpStr;
        }
        return retVal;
    };
    Yadcf.doFilterAutocomplete = function (arg, table_selector_jq_friendly, column_number, filter_match_mode) {
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        var oTable = this.oTables[table_selector_jq_friendly], settingsDt = this.getSettingsObjFromTable(oTable), column_number_filter;
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        if (arg === 'clear') {
            if (this.exGetColumnFilterVal(oTable, column_number) === '') {
                return;
            }
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val('').trigger('focus');
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse');
            (0, jquery_1.default)(document).removeData("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val"));
            oTable.fnFilter('', column_number_filter);
            this.resetIApiIndex();
            return;
        }
        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse');
        (0, jquery_1.default)(document).data("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val"), arg.value);
        this.yadcfMatchFilter(oTable, arg.value, filter_match_mode, column_number_filter, false, column_number);
        this.resetIApiIndex();
    };
    Yadcf.autocompleteSelect = function (event, ui) {
        var table_column, dashIndex, table_selector_jq_friendly, col_num, filter_match_mode;
        event = this.eventTargetFixUp(event);
        table_column = event.target.id.replace('yadcf-filter-', '');
        dashIndex = table_column.lastIndexOf('-');
        table_selector_jq_friendly = table_column.substring(0, dashIndex);
        col_num = parseInt(table_column.substring(dashIndex + 1), 10);
        filter_match_mode = (0, jquery_1.default)(event.target).attr('filter_match_mode');
        this.doFilterAutocomplete(ui.item, table_selector_jq_friendly, col_num, filter_match_mode);
    };
    Yadcf.sortNumAsc = function (a, b) {
        return a - b;
    };
    Yadcf.sortNumDesc = function (a, b) {
        return b - a;
    };
    Yadcf.findMinInArray = function (array, columnObj) {
        var narray = [], i, num, min;
        for (i = 0; i < array.length; i++) {
            if (array[i] !== null) {
                if (columnObj.ignore_char !== undefined) {
                    array[i] = array[i].toString().replace(columnObj.ignore_char, '');
                }
                if (columnObj.range_data_type !== 'range') {
                    num = +array[i];
                }
                else {
                    num = array[i].split(columnObj.range_data_type_delim);
                    num = num[0];
                }
                if (!isNaN(num)) {
                    narray.push(num);
                }
            }
        }
        min = Math.min.apply(Math, narray);
        if (!isFinite(min)) {
            min = 0;
        }
        else if (min !== 0) {
            if (min > 0) {
                min = Math.floor(min);
            }
            else {
                min = -1 * Math.ceil(min * -1);
            }
        }
        return min;
    };
    Yadcf.findMaxInArray = function (array, columnObj) {
        var narray = [], i, num, max;
        for (i = 0; i < array.length; i++) {
            if (array[i] !== null) {
                if (columnObj.ignore_char !== undefined) {
                    array[i] = array[i].toString().replace(columnObj.ignore_char, '');
                }
                if (columnObj.range_data_type !== 'range') {
                    num = +array[i];
                }
                else {
                    num = array[i].split(columnObj.range_data_type_delim);
                    num = num[1];
                }
                if (!isNaN(num)) {
                    narray.push(num);
                }
            }
        }
        max = Math.max.apply(Math, narray);
        if (!isFinite(max)) {
            max = 0;
        }
        else {
            max = Math.ceil(max);
        }
        return max;
    };
    Yadcf.addRangeNumberAndSliderFilterCapability = function (table_selector_jq_friendly, fromId, toId, col_num, ignore_char, sliderMaxMin) {
        jquery_1.default.fn.dataTable.ext.afnFiltering.push(function (settingsDt, aData, iDataIndex, rowData) {
            var min, max, val, retVal = false, table_selector_jq_friendly_local = table_selector_jq_friendly, current_table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2(settingsDt), ignore_char_local = ignore_char, column_data_type, html_data_type, columnObj, column_number_filter, valFrom, valTo, exclude_checked = false;
            if (table_selector_jq_friendly_local !== current_table_selector_jq_friendly) {
                return true;
            }
            columnObj = Yadcf.getOptions(settingsDt.oInstance.selector)[col_num];
            if (columnObj.filter_type === 'range_number_slider') {
                min = (0, jquery_1.default)('#' + fromId).text();
                max = (0, jquery_1.default)('#' + toId).text();
            }
            else {
                min = (0, jquery_1.default)('#' + fromId).val();
                max = (0, jquery_1.default)('#' + toId).val();
            }
            if (columnObj.exclude) {
                exclude_checked = (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(col_num)).find('.yadcf-exclude-wrapper :checkbox').prop('checked');
            }
            column_number_filter = Yadcf.calcColumnNumberFilter(settingsDt, col_num, table_selector_jq_friendly);
            if (rowData !== undefined) {
                var rowDataRender = void 0;
                if (columnObj.column_number_render) {
                    rowDataRender = jquery_1.default.extend(true, [], rowData);
                    var index = columnObj.column_number_data ? columnObj.column_number_data : column_number_filter;
                    var meta = {
                        row: iDataIndex,
                        col: columnObj.column_number,
                        settings: settingsDt
                    };
                    if (typeof index === 'string' && typeof rowDataRender === 'object') {
                        var cellDataRender = columnObj.column_number_render(Yadcf.getProp(rowDataRender, index), 'filter', rowData, meta);
                        Yadcf.setProp(rowDataRender, index, (cellDataRender !== undefined && cellDataRender !== null) ? cellDataRender : Yadcf.getProp(rowData, index));
                    }
                    else {
                        var cellDataRender = columnObj.column_number_render(rowDataRender[index], 'filter', rowData, meta);
                        rowDataRender[index] = (cellDataRender !== undefined && cellDataRender !== null) ? cellDataRender : rowData[index];
                    }
                }
                aData = rowDataRender ? rowDataRender : rowData;
                if (columnObj.column_number_data !== undefined) {
                    column_number_filter = columnObj.column_number_data;
                    val = Yadcf.dot2obj(aData, column_number_filter);
                }
                else {
                    val = aData[column_number_filter];
                }
            }
            else {
                val = aData[column_number_filter];
            }
            if (!isFinite(min) || !isFinite(max)) {
                return true;
            }
            column_data_type = columnObj.column_data_type;
            html_data_type = columnObj.html_data_type;
            if (column_data_type === 'html' || column_data_type === 'rendered_html') {
                if (html_data_type === undefined) {
                    html_data_type = 'text';
                }
                if ((0, jquery_1.default)(val).length !== 0) {
                    switch (html_data_type) {
                        case 'text':
                            val = (0, jquery_1.default)(val).text();
                            break;
                        case 'value':
                            val = (0, jquery_1.default)(val).val();
                            break;
                        case 'id':
                            val = val.id;
                            break;
                        case 'selector':
                            val = (0, jquery_1.default)(val).find(columnObj.html_data_selector).text();
                            break;
                    }
                }
            }
            else {
                if (typeof val === 'object' && columnObj.html5_data !== undefined) {
                    val = val['@' + columnObj.html5_data];
                }
            }
            if (ignore_char_local !== undefined) {
                min = min.replace(ignore_char_local, '');
                max = max.replace(ignore_char_local, '');
                if (val) {
                    val = val.toString().replace(ignore_char_local, '');
                }
                else {
                    val = '';
                }
            }
            // Omit empty rows when filtering.
            if (columnObj.filter_type === 'range_number_slider') {
                if (val === '' && ((+min) !== sliderMaxMin.min || (+max) !== sliderMaxMin.max)) {
                    return false;
                }
            }
            else {
                if (val === '' && (min !== '' || max !== '')) {
                    return false;
                }
            }
            min = (min !== '') ? (+min) : min;
            max = (max !== '') ? (+max) : max;
            if (!exclude_checked) {
                if (columnObj.range_data_type === 'single') {
                    val = (val !== '') ? (+val) : val;
                    if (min === '' && max === '') {
                        retVal = true;
                    }
                    else if (min === '' && val <= max) {
                        retVal = true;
                    }
                    else if (min <= val && '' === max) {
                        retVal = true;
                    }
                    else if (min <= val && val <= max) {
                        retVal = true;
                    }
                    else if (val === '' || isNaN(val)) {
                        retVal = true;
                    }
                }
                else if (columnObj.range_data_type === 'range') {
                    val = val.split(columnObj.range_data_type_delim);
                    valFrom = (val[0] !== '') ? (+val[0]) : val[0];
                    valTo = (val[1] !== '') ? (+val[1]) : val[1];
                    // @ts-expect-error
                    if (!columnObj.range_data_operator) {
                        if (min === '' && max === '') {
                            retVal = true;
                        }
                        else if (min === '' && valTo <= max) {
                            retVal = true;
                        }
                        else if (min <= valFrom && '' === max) {
                            retVal = true;
                        }
                        else if (min <= valFrom && valTo <= max) {
                            retVal = true;
                        }
                        else if ((valFrom === '' || isNaN(valFrom)) && (valTo === '' || isNaN(valTo))) {
                            retVal = true;
                        }
                    }
                }
                else if (columnObj.range_data_type === 'delimeter') {
                    if (columnObj.text_data_delimiter !== undefined) {
                        var valSplitted = val.split(columnObj.text_data_delimiter);
                        var anyNumberInRange = function (fromToObj) {
                            return function (element, index, array) {
                                return element >= fromToObj.from && element <= fromToObj.to;
                            };
                        };
                        retVal = valSplitted.some(anyNumberInRange({ from: min, to: max }));
                    }
                }
                return retVal;
            }
            else {
                if (columnObj.range_data_type === 'single') {
                    val = (val !== '') ? (+val) : val;
                    if (min === '' && max === '') {
                        retVal = true;
                    }
                    else if (min === '' && val > max) {
                        retVal = true;
                    }
                    else if (min > val && '' === max) {
                        retVal = true;
                    }
                    else if (!(min <= val && val <= max) && ('' !== max && '' !== min)) {
                        retVal = true;
                    }
                    else if (val === '' || isNaN(val)) {
                        retVal = true;
                    }
                }
                else if (columnObj.range_data_type === 'range') {
                    val = val.split(columnObj.range_data_type_delim);
                    valFrom = (val[0] !== '') ? (+val[0]) : val[0];
                    valTo = (val[1] !== '') ? (+val[1]) : val[1];
                    if (min === '' && max === '') {
                        retVal = true;
                    }
                    else if (min === '' && valTo > max) {
                        retVal = true;
                    }
                    else if (min > valFrom && '' === max) {
                        retVal = true;
                    }
                    else if (!(min <= valFrom && valTo <= max) && ('' !== max && '' !== min)) {
                        retVal = true;
                    }
                    else if ((valFrom === '' || isNaN(valFrom)) && (valTo === '' || isNaN(valTo))) {
                        retVal = true;
                    }
                }
                return retVal;
            }
        });
    };
    Yadcf.addCustomFunctionFilterCapability = function (table_selector_jq_friendly, filterId, col_num) {
        jquery_1.default.fn.dataTable.ext.afnFiltering.push(function (settingsDt, aData, iDataIndex, stateVal) {
            var filterVal = (0, jquery_1.default)('#' + filterId).val(), columnVal, retVal = false, table_selector_jq_friendly_local = table_selector_jq_friendly, current_table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2(settingsDt), custom_func, column_number_filter;
            if (table_selector_jq_friendly_local !== current_table_selector_jq_friendly || filterVal === '-1') {
                return true;
            }
            column_number_filter = Yadcf.calcColumnNumberFilter(settingsDt, col_num, table_selector_jq_friendly);
            columnVal = aData[column_number_filter] === '-' ? 0 : aData[column_number_filter];
            custom_func = Yadcf.getOptions(settingsDt.oInstance.selector)[col_num].custom_func;
            retVal = custom_func(filterVal, columnVal, aData, stateVal);
            return retVal;
        });
    };
    Yadcf.addRangeDateFilterCapability = function (table_selector_jq_friendly, fromId, toId, col_num, date_format) {
        jquery_1.default.fn.dataTable.ext.afnFiltering.push(function (settingsDt, aData, iDataIndex, rowData) {
            var min = document.getElementById(fromId) !== null ? document.getElementById(fromId).value : '', max = document.getElementById(toId) !== null ? document.getElementById(toId).value : '', val, retVal = false, table_selector_jq_friendly_local = table_selector_jq_friendly, current_table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2(settingsDt), column_data_type, html_data_type, columnObj, column_number_filter, min_time, max_time, dataRenderFunc, dpg;
            //'2019/01/30 - 2019/01/30'
            if (table_selector_jq_friendly_local !== current_table_selector_jq_friendly) {
                return true;
            }
            columnObj = Yadcf.getOptions(settingsDt.oInstance.selector)[col_num];
            if (columnObj.filters_position === 'tfoot' && settingsDt.oScroll.sX) {
                var selectorePrefix = '.dataTables_scrollFoot ';
                min = document.querySelector(selectorePrefix + '#' + fromId) ? document.querySelector(selectorePrefix + '#' + fromId).value : '';
                max = document.querySelector(selectorePrefix + '#' + toId) ? document.querySelector(selectorePrefix + '#' + toId).value : '';
            }
            if (columnObj.datepicker_type === 'daterangepicker') {
                min = (0, trim_1.default)(min.substring(0, min.indexOf('-')));
                max = (0, trim_1.default)(max.substring(max.indexOf('-') + 1));
            }
            if (columnObj.datepicker_type === 'bootstrap-datepicker' && typeof jquery_1.default.fn.datepicker !== 'undefined') {
                // @ts-expect-error
                dpg = jquery_1.default.fn.datepicker.DPGlobal;
            }
            column_number_filter = Yadcf.calcColumnNumberFilter(settingsDt, col_num, table_selector_jq_friendly);
            if (typeof columnObj.column_number_data === 'function' || typeof columnObj.column_number_render === 'function') {
                dataRenderFunc = true;
            }
            if (rowData !== undefined && dataRenderFunc !== true) {
                if (columnObj.column_number_data !== undefined) {
                    column_number_filter = columnObj.column_number_data;
                    val = Yadcf.dot2obj(rowData, column_number_filter);
                }
                else {
                    val = rowData[column_number_filter];
                }
            }
            else {
                val = aData[column_number_filter];
            }
            column_data_type = columnObj.column_data_type;
            html_data_type = columnObj.html_data_type;
            if (column_data_type === 'html' || column_data_type === 'rendered_html') {
                if (html_data_type === undefined) {
                    html_data_type = 'text';
                }
                if ((0, jquery_1.default)(val).length !== 0) {
                    switch (html_data_type) {
                        case 'text':
                            val = (0, jquery_1.default)(val).text();
                            break;
                        case 'value':
                            val = (0, jquery_1.default)(val).val();
                            break;
                        case 'id':
                            val = val.id;
                            break;
                        case 'selector':
                            val = (0, jquery_1.default)(val).find(columnObj.html_data_selector).text();
                            break;
                    }
                }
            }
            else if (typeof val === 'object') {
                if (columnObj.html5_data !== undefined) {
                    val = val['@' + columnObj.html5_data];
                }
            }
            // Omit empty rows when filtering.
            if (val === '' && (min !== '' || max !== '')) {
                return false;
            }
            try {
                if (min.length === (date_format.length + 2) || columnObj.datepicker_type.indexOf('bootstrap') !== -1 || columnObj.datepicker_type === 'daterangepicker') {
                    if (columnObj.datepicker_type === 'jquery-ui') {
                        min = (min !== '') ? jquery_1.default.datepicker.parseDate(date_format, min) : min;
                    }
                    else if (columnObj.datepicker_type === 'bootstrap-datetimepicker' || columnObj.datepicker_type === 'daterangepicker') {
                        min = (min !== '') ? (0, moment_1.default)(min, columnObj.date_format).toDate() : min;
                    }
                    else if (columnObj.datepicker_type === 'bootstrap-datepicker') {
                        min = (min !== '') ? dpg.parseDate(min, dpg.parseFormat(columnObj.date_format)) : min;
                    }
                }
            }
            catch (err1) { }
            try {
                if (max.length === (date_format.length + 2) || columnObj.datepicker_type.indexOf('bootstrap') !== -1 || columnObj.datepicker_type === 'daterangepicker') {
                    if (columnObj.datepicker_type === 'jquery-ui') {
                        max = (max !== '') ? jquery_1.default.datepicker.parseDate(date_format, max) : max;
                    }
                    else if (columnObj.datepicker_type === 'bootstrap-datetimepicker' || columnObj.datepicker_type === 'daterangepicker') {
                        max = (max !== '') ? (0, moment_1.default)(max, columnObj.date_format).toDate() : max;
                    }
                    else if (columnObj.datepicker_type === 'bootstrap-datepicker') {
                        max = (max !== '') ? dpg.parseDate(max, dpg.parseFormat(columnObj.date_format)) : max;
                    }
                }
            }
            catch (err2) { }
            try {
                if (columnObj.datepicker_type === 'jquery-ui') {
                    val = (val !== '') ? jquery_1.default.datepicker.parseDate(date_format, val) : val;
                }
                else if (columnObj.datepicker_type === 'bootstrap-datetimepicker') {
                    val = (val !== '') ? (0, moment_1.default)(val, columnObj.moment_date_format).toDate() : val;
                }
                else if (columnObj.datepicker_type === 'bootstrap-datepicker') {
                    val = (val !== '') ? dpg.parseDate(val, dpg.parseFormat(columnObj.date_format)) : val;
                }
                else if (columnObj.datepicker_type === 'daterangepicker') {
                    val = (val !== '') ? (0, moment_1.default)(val, columnObj.date_format).toDate() : val;
                }
            }
            catch (err3) { }
            if (date_format.toLowerCase() !== 'hh:mm') {
                if ((min === '' || !(min instanceof Date)) && (max === '' || !(max instanceof Date))) {
                    retVal = true;
                }
                else if (min === '' && val <= max) {
                    retVal = true;
                }
                else if (min <= val && '' === max) {
                    retVal = true;
                }
                else if (min <= val && val <= max) {
                    retVal = true;
                }
            }
            else {
                min_time = (0, moment_1.default)(min);
                min_time = min_time.minutes() + min_time.hours() * 60;
                if (isNaN(min_time)) {
                    min_time = '';
                }
                max_time = (0, moment_1.default)(max);
                max_time = (max_time).minutes() + max_time.hours() * 60;
                if (isNaN(max_time)) {
                    max_time = '';
                }
                val = (0, moment_1.default)(val);
                val = val.minutes() + val.hours() * 60;
                if ((min === '' || !((0, moment_1.default)(min, date_format).isValid())) && (max === '' || !((0, moment_1.default)(max, date_format).isValid()))) {
                    retVal = true;
                }
                else if (min_time === '' && val <= max_time) {
                    retVal = true;
                }
                else if (min_time <= val && '' === max_time) {
                    retVal = true;
                }
                else if (min_time <= val && val <= max_time) {
                    retVal = true;
                }
            }
            return retVal;
        });
    };
    Yadcf.addNullFilterCapability = function (table_selector_jq_friendly, col_num, isSelect) {
        jquery_1.default.fn.dataTable.ext.afnFiltering.push(function (settingsDt, aData, iDataIndex, rowData) {
            var val, retVal = false, table_selector_jq_friendly_local = table_selector_jq_friendly, current_table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2(settingsDt), columnObj, column_number_filter, null_checked, exclude_checked;
            if (table_selector_jq_friendly_local !== current_table_selector_jq_friendly) {
                return true;
            }
            columnObj = Yadcf.getOptions(settingsDt.oInstance.selector)[col_num];
            column_number_filter = Yadcf.calcColumnNumberFilter(settingsDt, col_num, table_selector_jq_friendly);
            var fixedPrefix = '';
            if (settingsDt.fixedHeader !== undefined && (0, jquery_1.default)('.fixedHeader-floating').is(':visible')) {
                fixedPrefix = '.fixedHeader-floating ';
            }
            if (columnObj.filters_position === 'tfoot' && settingsDt.nScrollFoot) {
                fixedPrefix = ".".concat(settingsDt.nScrollFoot.className, " ");
            }
            null_checked = (0, jquery_1.default)("".concat(fixedPrefix, "#yadcf-filter-wrapper-").concat(table_selector_jq_friendly, "-").concat(col_num)).find('.yadcf-null-wrapper :checkbox').prop('checked');
            null_checked = isSelect ? ((0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(col_num)).find('option:selected').val().trim() === columnObj.select_null_option) : null_checked;
            if (!null_checked) {
                return true;
            }
            if (columnObj.exclude) {
                exclude_checked = (0, jquery_1.default)("".concat(fixedPrefix, "#yadcf-filter-wrapper-").concat(table_selector_jq_friendly, "-").concat(col_num)).find('.yadcf-exclude-wrapper :checkbox').prop('checked');
            }
            if (rowData !== undefined) {
                /**
                 * Support dt render fn, usecase structured data when top is null inner property will return undefined.
                 * e.g data = person.cat.name && person.cat = null
                 */
                var rowDataRender = void 0;
                if (columnObj.column_number_render) {
                    rowDataRender = jquery_1.default.extend(true, [], rowData);
                    var index = columnObj.column_number_data ? columnObj.column_number_data : column_number_filter;
                    var meta = {
                        row: iDataIndex,
                        col: columnObj.column_number,
                        settings: settingsDt
                    };
                    if (typeof index === 'string' && typeof rowDataRender === 'object') {
                        var cellDataRender = columnObj.column_number_render(Yadcf.getProp(rowDataRender, index), 'filter', rowData, meta);
                        Yadcf.setProp(rowDataRender, index, (cellDataRender !== undefined) ? cellDataRender : Yadcf.getProp(rowData, index));
                    }
                    else {
                        var cellDataRender = columnObj.column_number_render(rowDataRender[index], 'filter', rowData, meta);
                        rowDataRender[index] = (cellDataRender !== undefined) ? cellDataRender : rowData[index];
                    }
                }
                aData = rowDataRender ? rowDataRender : rowData;
                if (columnObj.column_number_data !== undefined) {
                    column_number_filter = columnObj.column_number_data;
                    val = Yadcf.getProp(aData, column_number_filter.toString());
                }
                else {
                    val = aData[column_number_filter];
                }
            }
            else {
                val = aData[column_number_filter];
            }
            if (columnObj.exclude && exclude_checked) {
                retVal = val === null ? false : true;
            }
            else {
                retVal = val === null ? true : false;
            }
            return retVal;
        });
    };
    Yadcf.addRangeNumberFilter = function (filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, filter_default_label, ignore_char) {
        var fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-").concat(column_number), toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-to-").concat(column_number), filter_selector_string_tmp, filter_wrapper_id, oTable, columnObj, filterActionFn, null_str, exclude_str;
        filter_wrapper_id = "yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number);
        if ((0, jquery_1.default)("#".concat(filter_wrapper_id)).length > 0) {
            return;
        }
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        oTable = this.oTables[table_selector_jq_friendly];
        columnObj = this.getOptions(oTable.selector)[column_number];
        // Add a wrapper to hold both filter and reset button.
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<div />', {
            onmousedown: this.stopPropagation,
            onclick: this.stopPropagation,
            id: filter_wrapper_id,
            class: "yadcf-filter-wrapper ".concat(columnObj.style_class)
        }));
        filter_selector_string += ' div.yadcf-filter-wrapper';
        filter_selector_string_tmp = filter_selector_string;
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<div>', {
            id: "yadcf-filter-wrapper-inner-".concat(table_selector_jq_friendly, "-").concat(column_number),
            class: "yadcf-filter-wrapper-inner -".concat(table_selector_jq_friendly, "-").concat(column_number)
        }));
        filter_selector_string += ' div.yadcf-filter-wrapper-inner';
        filterActionFn = function (tableSel) {
            return function (event) {
                Yadcf.rangeNumberKeyUP(tableSel, event);
            };
        }(table_selector_jq_friendly);
        if (columnObj.externally_triggered === true) {
            filterActionFn = function () { };
        }
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<input>', {
            onkeydown: this.preventDefaultForEnter,
            placeholder: filter_default_label[0],
            id: fromId,
            class: 'yadcf-filter-range-number yadcf-filter-range',
            onkeyup: filterActionFn
        }));
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<span>', {
            class: 'yadcf-filter-range-number-seperator'
        }));
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<input>', {
            onkeydown: this.preventDefaultForEnter,
            placeholder: filter_default_label[1],
            id: toId,
            class: 'yadcf-filter-range-number yadcf-filter-range',
            onkeyup: filterActionFn
        }));
        if (filter_reset_button_text !== false) {
            (0, jquery_1.default)(filter_selector_string_tmp).append(this.makeElement('<button>', {
                type: 'button',
                id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "-reset"),
                onmousedown: this.stopPropagation,
                onclick: function (colNo, tableSel) {
                    return function (event) {
                        Yadcf.stopPropagation(event);
                        Yadcf.rangeClear(tableSel, event, colNo);
                        return false;
                    };
                }(column_number, table_selector_jq_friendly),
                class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                text: filter_reset_button_text
            }));
        }
        if (columnObj.externally_triggered_checkboxes_text && typeof columnObj.externally_triggered_checkboxes_function === 'function') {
            (0, jquery_1.default)(filter_selector_string_tmp).append(this.makeElement('<button>', {
                type: 'button',
                id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "-externally_triggered_checkboxes-button"),
                onmousedown: Yadcf.stopPropagation,
                onclick: Yadcf.stopPropagation,
                class: "yadcf-filter-externally_triggered_checkboxes-button ".concat(columnObj.externally_triggered_checkboxes_button_style_class),
                text: columnObj.externally_triggered_checkboxes_text
            }));
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "-externally_triggered_checkboxes-button")).on('click', columnObj.externally_triggered_checkboxes_function);
        }
        exclude_str = (0, jquery_1.default)();
        if (columnObj.exclude === true) {
            if (columnObj.externally_triggered !== true) {
                exclude_str = this.makeElement('<span>', {
                    class: 'yadcf-exclude-wrapper',
                    onmousedown: Yadcf.stopPropagation,
                    onclick: Yadcf.stopPropagation
                })
                    .append(this.makeElement('<div>', {
                    class: 'yadcf-label small',
                    text: columnObj.exclude_label
                }))
                    .append(this.makeElement('<input>', {
                    type: 'checkbox',
                    title: columnObj.exclude_label,
                    onclick: function (tableSel) {
                        return function (event) {
                            Yadcf.stopPropagation(event);
                            Yadcf.rangeNumberKeyUP(tableSel, event);
                        };
                    }(table_selector_jq_friendly)
                }));
            }
            else {
                exclude_str = this.makeElement('<span>', {
                    class: 'yadcf-exclude-wrapper',
                    onmousedown: this.stopPropagation,
                    onclick: Yadcf.stopPropagation
                })
                    .append(this.makeElement('<div>', {
                    class: 'yadcf-label small',
                    text: columnObj.exclude_label
                }))
                    .append(this.makeElement('<input>', {
                    type: 'checkbox',
                    title: columnObj.exclude_label,
                    onclick: Yadcf.stopPropagation
                }));
            }
        }
        null_str = (0, jquery_1.default)();
        if (columnObj.null_check_box === true) {
            null_str = this.makeElement('<span>', {
                class: 'yadcf-null-wrapper',
                onmousedown: Yadcf.stopPropagation,
                onclick: Yadcf.stopPropagation
            })
                .append(this.makeElement('<div>', {
                class: 'yadcf-label small',
                text: columnObj.null_label
            }))
                .append(this.makeElement('<input>', {
                type: 'checkbox',
                title: columnObj.null_label,
                onclick: function (colNo, tableSel) {
                    return function (event) {
                        Yadcf.stopPropagation(event);
                        Yadcf.nullChecked(event, tableSel, colNo);
                    };
                }(column_number, table_selector_jq_friendly)
            }));
            if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                this.addNullFilterCapability(table_selector_jq_friendly, column_number, false);
            }
        }
        if (columnObj.checkbox_position_after) {
            exclude_str.addClass('after');
            null_str.addClass('after');
            (0, jquery_1.default)(filter_selector_string_tmp).append(exclude_str, null_str);
        }
        else {
            (0, jquery_1.default)(filter_selector_string).before(exclude_str, null_str);
        }
        // Hide on load.
        if (columnObj.externally_triggered_checkboxes_text && typeof columnObj.externally_triggered_checkboxes_function === 'function') {
            var sel = (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number));
            sel.find('.yadcf-exclude-wrapper').hide();
            sel.find('.yadcf-null-wrapper').hide();
        }
        if (oTable.fnSettings().oFeatures.bStateSave === true && oTable.fnSettings().oLoadedState) {
            if (oTable.fnSettings().oLoadedState.yadcfState &&
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] &&
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number]) {
                var exclude_checked = false;
                var null_checked = false;
                if (columnObj.null_check_box) {
                    null_checked = oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].null_checked;
                    (0, jquery_1.default)('#' + filter_wrapper_id).find('.yadcf-null-wrapper :checkbox').prop('checked', null_checked);
                    if (columnObj.exclude) {
                        exclude_checked = oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].exclude_checked;
                        (0, jquery_1.default)('#' + filter_wrapper_id).find('.yadcf-exclude-wrapper :checkbox').prop('checked', exclude_checked);
                    }
                }
                if (null_checked) {
                    (0, jquery_1.default)('#' + fromId).prop('disabled', true);
                    (0, jquery_1.default)('#' + toId).prop('disabled', true);
                }
                else {
                    var inuseClass = exclude_checked ? ' inuse inuse-exclude' : ' inuse ';
                    if (oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from) {
                        (0, jquery_1.default)('#' + fromId).val(oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from);
                        if (oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from !== '') {
                            (0, jquery_1.default)('#' + fromId).addClass(inuseClass);
                        }
                    }
                    if (oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].to) {
                        (0, jquery_1.default)('#' + toId).val(oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].to);
                        if (oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].to !== '') {
                            (0, jquery_1.default)('#' + toId).addClass(inuseClass);
                        }
                    }
                }
            }
        }
        this.resetIApiIndex();
        if (oTable.fnSettings().oFeatures.bServerSide !== true) {
            this.addRangeNumberAndSliderFilterCapability(table_selector_jq_friendly, fromId, toId, column_number, ignore_char);
        }
    };
    Yadcf.dateSelectSingle = function (pDate, pEvent, clear) {
        var oTable, date, event, column_number, dashIndex, table_selector_jq_friendly, column_number_filter, settingsDt, columnObj, yadcfState;
        if (pDate) {
            if (pDate.type === 'dp') {
                event = pDate.target;
            }
            else if (pDate.type === 'changeDate') {
                event = pDate.currentTarget;
            }
            else if ((0, jquery_1.default)(clear).length === 1) { // dt-datetime
                date = pDate;
                event = clear;
                clear = undefined;
            }
            else {
                date = pDate;
                event = pEvent;
            }
        }
        column_number = (0, jquery_1.default)(event).attr('id').replace('yadcf-filter-', '').replace('-date', '').replace('-reset', '');
        dashIndex = column_number.lastIndexOf('-');
        table_selector_jq_friendly = column_number.substring(0, dashIndex);
        column_number = column_number.substring(dashIndex + 1);
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        oTable = this.oTables[table_selector_jq_friendly];
        settingsDt = this.getSettingsObjFromTable(oTable);
        columnObj = this.getOptions(oTable.selector)[column_number];
        if (pDate.type === 'dp') {
            if ((0, moment_1.default)((0, jquery_1.default)(event).val(), columnObj.date_format).isValid()) {
                date = (0, jquery_1.default)(event).val();
            }
            else {
                clear = 'clear';
            }
            (0, jquery_1.default)(event).trigger('blur');
        }
        else if (columnObj.datepicker_type === 'bootstrap-datepicker') {
            if (pDate.dates) {
                date = pDate.format(0, columnObj.date_format);
            }
        }
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        if (clear === undefined) {
            if (columnObj.filter_type !== 'date_custom_func') {
                oTable.fnFilter(date, column_number_filter);
            }
            else {
                this.doFilterCustomDateFunc({ value: date }, table_selector_jq_friendly, column_number);
            }
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse');
        }
        else if (clear === 'clear') {
            if (this.exGetColumnFilterVal(oTable, column_number) === '') {
                return;
            }
            if (columnObj.filter_type === 'date_custom_func') {
                // Handle state saving.
                if (oTable.fnSettings().oFeatures.bStateSave === true && oTable.fnSettings().oLoadedState) {
                    if (!oTable.fnSettings().oLoadedState) {
                        oTable.fnSettings().oLoadedState = {};
                        oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
                    }
                    if (oTable.fnSettings().oFeatures.bStateSave === true) {
                        if (oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                            oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number] = { from: '' };
                        }
                        else {
                            yadcfState = {};
                            yadcfState[table_selector_jq_friendly] = [];
                            yadcfState[table_selector_jq_friendly][column_number] = { from: '' };
                            oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
                        }
                        oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
                    }
                }
            }
            if (columnObj.datepicker_type === 'daterangepicker' && oTable.fnSettings().oFeatures.bServerSide !== true) {
                this.rangeClear(table_selector_jq_friendly, event, column_number);
            }
            else {
                if (columnObj.filter_type !== 'date_custom_func') {
                    oTable.fnFilter('', column_number_filter);
                }
                else {
                    (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val('');
                    this.doFilterCustomDateFunc({ value: date }, table_selector_jq_friendly, column_number);
                }
            }
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val('').removeClass('inuse');
            if (columnObj.datepicker_type === 'bootstrap-datepicker') {
                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).datepicker('update');
            }
        }
        this.resetIApiIndex();
    };
    Yadcf.dateSelect = function (pDate, pEvent) {
        var oTable, column_number, dashIndex, table_selector_jq_friendly, yadcfState, from, to, event, columnObj, column_number_filter, settingsDt, keyUp;
        if (pDate.type === 'dp' || pDate.namespace === 'daterangepicker') {
            event = pDate.target;
        }
        else if (pDate.type === 'changeDate') {
            event = pDate.currentTarget;
        }
        else {
            event = pEvent;
        }
        column_number = (0, jquery_1.default)(event).attr('id').replace('yadcf-filter-', '').replace('-from-date', '').replace('-to-date', '');
        dashIndex = column_number.lastIndexOf('-');
        table_selector_jq_friendly = column_number.substring(0, dashIndex);
        column_number = column_number.substring(dashIndex + 1);
        oTable = this.oTables[table_selector_jq_friendly];
        settingsDt = this.getSettingsObjFromTable(oTable);
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        columnObj = this.getOptions(oTable.selector)[column_number];
        if (pDate.type === 'dp') {
            event = pDate.target;
            // @ts-expect-error
            if (pDate.date === false || !(0, moment_1.default)((0, jquery_1.default)(event).val(), columnObj.date_format).isValid()) {
                (0, jquery_1.default)(event).removeClass('inuse');
                (0, jquery_1.default)(event).data('DateTimePicker').minDate(false);
            }
            else {
                (0, jquery_1.default)(event).addClass('inuse');
            }
            (0, jquery_1.default)(event).trigger('blur');
        }
        else if (pDate.type === 'changeDate') {
            // @ts-expect-error
            if (pDate.date !== undefined) {
                (0, jquery_1.default)(event).addClass('inuse');
            }
            else {
                (0, jquery_1.default)(event).removeClass('inuse');
            }
        }
        else {
            (0, jquery_1.default)(event).addClass('inuse');
        }
        if (pDate.namespace === 'daterangepicker') {
            // @ts-expect-error
            from = (0, moment_1.default)(pEvent.startDate).format(columnObj.date_format);
            // @ts-expect-error
            to = (0, moment_1.default)(pEvent.endDate).format(columnObj.date_format);
        }
        else {
            if ((0, jquery_1.default)(event).attr('id').indexOf('-from-') !== -1) {
                from = document.getElementById((0, jquery_1.default)(event).attr('id')).value;
                to = document.getElementById((0, jquery_1.default)(event).attr('id').replace('-from-', '-to-')).value;
            }
            else {
                to = document.getElementById((0, jquery_1.default)(event).attr('id')).value;
                from = document.getElementById((0, jquery_1.default)(event).attr('id').replace('-to-', '-from-')).value;
            }
        }
        keyUp = function () {
            if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                oTable.fnDraw();
            }
            else {
                oTable.fnFilter(from + columnObj.custom_range_delimiter + to, column_number_filter);
            }
            if (!oTable.fnSettings().oLoadedState) {
                oTable.fnSettings().oLoadedState = {};
                oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
            }
            if (oTable.fnSettings().oFeatures.bStateSave === true) {
                if (oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                    oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number] = { from: from, to: to };
                }
                else {
                    yadcfState = {};
                    yadcfState[table_selector_jq_friendly] = [];
                    yadcfState[table_selector_jq_friendly][column_number] = { from: from, to: to };
                    oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
                }
                oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
            }
            if (from !== '' || to !== '') {
                (0, jquery_1.default)('#' + event.id).addClass('inuse');
            }
            this.resetIApiIndex();
        };
        if (columnObj.filter_delay === undefined) {
            keyUp();
        }
        else {
            this.yadcfDelay(function () {
                keyUp();
            }, columnObj.filter_delay);
        }
    };
    Yadcf.addRangeDateFilter = function (filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, filter_default_label, date_format) {
        var fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-date-").concat(column_number), toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-to-date-").concat(column_number), filter_selector_string_tmp, filter_wrapper_id, oTable, columnObj, datepickerObj = {}, filterActionFn, $fromInput, $toInput, innerWrapperAdditionalClass = '';
        filter_wrapper_id = "yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number);
        if ((0, jquery_1.default)('#' + filter_wrapper_id).length > 0) {
            return;
        }
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        oTable = this.oTables[table_selector_jq_friendly];
        columnObj = this.getOptions(oTable.selector)[column_number];
        if (columnObj.datepicker_type === 'bootstrap-datepicker') {
            innerWrapperAdditionalClass = 'input-daterange';
        }
        // Add a wrapper to hold both filter and reset button.
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<div />', {
            onmousedown: this.stopPropagation,
            onclick: this.stopPropagation,
            id: filter_wrapper_id,
            class: 'yadcf-filter-wrapper'
        }));
        filter_selector_string += ' div.yadcf-filter-wrapper';
        filter_selector_string_tmp = filter_selector_string;
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<div>', {
            id: "yadcf-filter-wrapper-inner-".concat(table_selector_jq_friendly, "-").concat(column_number),
            class: "yadcf-filter-wrapper-inner ".concat(innerWrapperAdditionalClass)
        }));
        filter_selector_string += ' div.yadcf-filter-wrapper-inner';
        filterActionFn = function (tableSel) {
            return function (event) {
                Yadcf.rangeDateKeyUP(tableSel, date_format, event);
            };
        }(table_selector_jq_friendly);
        if (columnObj.externally_triggered === true) {
            filterActionFn = function () { };
        }
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<input>', {
            onkeydown: this.preventDefaultForEnter,
            placeholder: filter_default_label[0],
            id: fromId,
            class: "yadcf-filter-range-date yadcf-filter-range yadcf-filter-range-start ".concat(columnObj.style_class),
            onkeyup: filterActionFn
        }));
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<span>', {
            class: 'yadcf-filter-range-date-seperator'
        }));
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<input>', {
            onkeydown: this.preventDefaultForEnter,
            placeholder: filter_default_label[1],
            id: toId,
            class: "yadcf-filter-range-date yadcf-filter-range yadcf-filter-range-end ".concat(columnObj.style_class),
            onkeyup: filterActionFn
        }));
        $fromInput = (0, jquery_1.default)('#' + fromId);
        $toInput = (0, jquery_1.default)('#' + toId);
        if (filter_reset_button_text !== false) {
            (0, jquery_1.default)(filter_selector_string_tmp).append(this.makeElement('<button>', {
                type: 'button',
                onmousedown: this.stopPropagation,
                onclick: function (colNo, tableSel) {
                    return function (event) {
                        Yadcf.stopPropagation(event);
                        Yadcf.rangeClear(tableSel, event, colNo);
                        return false;
                    };
                }(column_number, table_selector_jq_friendly),
                class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                text: filter_reset_button_text
            }));
        }
        if (columnObj.datepicker_type === 'jquery-ui') {
            // @ts-expect-error
            datepickerObj.dateFormat = date_format;
        }
        else if (columnObj.datepicker_type === 'bootstrap-datetimepicker') {
            // @ts-expect-error
            datepickerObj.format = date_format;
        }
        if (columnObj.externally_triggered !== true) {
            if (columnObj.datepicker_type === 'jquery-ui') {
                // @ts-expect-error
                datepickerObj.onSelect = dateSelect;
            }
            // for 'bootstrap-datetimepicker' its implemented below...
        }
        datepickerObj = jquery_1.default.extend({}, datepickerObj, columnObj.filter_plugin_options);
        if (columnObj.datepicker_type === 'jquery-ui') {
            if (columnObj.jquery_ui_datepicker_locale) {
                jquery_1.default.extend(datepickerObj, jquery_1.default.datepicker.regional[columnObj.jquery_ui_datepicker_locale]);
            }
            $fromInput.datepicker(jquery_1.default.extend(datepickerObj, {
                onClose: function (selectedDate) {
                    $toInput.datepicker('option', 'minDate', selectedDate);
                }
            }));
            $toInput.datepicker(jquery_1.default.extend(datepickerObj, {
                onClose: function (selectedDate) {
                    $fromInput.datepicker('option', 'maxDate', selectedDate);
                }
            }));
        }
        else if (columnObj.datepicker_type === 'bootstrap-datetimepicker') {
            // @ts-expect-error
            datepickerObj.useCurrent = false;
            $fromInput.datetimepicker(datepickerObj);
            $toInput.datetimepicker(datepickerObj);
            if (columnObj.externally_triggered !== true) {
                $fromInput.add($toInput).on('dp.hide', this.dateSelect);
            }
        }
        else if (columnObj.datepicker_type === 'bootstrap-datepicker') {
            if (date_format) {
                jquery_1.default.extend(datepickerObj, { format: date_format });
            }
            $fromInput.datepicker(datepickerObj).on('changeDate', function (e) {
                Yadcf.dateSelect(e);
                (0, jquery_1.default)(this).datepicker('hide');
            });
            $toInput.datepicker(datepickerObj).on('changeDate', function (e) {
                Yadcf.dateSelect(e);
                (0, jquery_1.default)(this).datepicker('hide');
            });
        }
        if (oTable.fnSettings().oFeatures.bStateSave === true && oTable.fnSettings().oLoadedState) {
            if (oTable.fnSettings().oLoadedState.yadcfState &&
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] &&
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number]) {
                (0, jquery_1.default)('#' + fromId).val(oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from);
                if (oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from !== '') {
                    (0, jquery_1.default)('#' + fromId).addClass('inuse');
                }
                (0, jquery_1.default)('#' + toId).val(oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].to);
                if (oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].to !== '') {
                    (0, jquery_1.default)('#' + toId).addClass('inuse');
                }
            }
        }
        if (oTable.fnSettings().oFeatures.bServerSide !== true) {
            this.addRangeDateFilterCapability(table_selector_jq_friendly, fromId, toId, column_number, date_format);
        }
        this.resetIApiIndex();
    };
    Yadcf.addDateFilter = function (filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, filter_default_label, date_format) {
        var dateId = "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number), filter_selector_string_tmp, filter_wrapper_id, oTable, columnObj, datepickerObj = {}, filterActionFn, settingsDt;
        filter_wrapper_id = "yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number);
        if ((0, jquery_1.default)('#' + filter_wrapper_id).length > 0) {
            return;
        }
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        oTable = this.oTables[table_selector_jq_friendly];
        columnObj = this.getOptions(oTable.selector)[column_number];
        // Add a wrapper to hold both filter and reset button.
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<div>', {
            onmousedown: Yadcf.stopPropagation,
            onclick: Yadcf.stopPropagation,
            id: filter_wrapper_id,
            class: 'yadcf-filter-wrapper'
        }));
        filter_selector_string += ' div.yadcf-filter-wrapper';
        filter_selector_string_tmp = filter_selector_string;
        filterActionFn = function (tableSel) {
            return function (event) {
                Yadcf.dateKeyUP(table_selector_jq_friendly, date_format, event);
            };
        }(table_selector_jq_friendly);
        if (columnObj.externally_triggered === true) {
            filterActionFn = function () { };
        }
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<input>', {
            onkeydown: Yadcf.preventDefaultForEnter,
            placeholder: filter_default_label,
            id: dateId,
            class: "yadcf-filter-date ".concat(columnObj.style_class),
            onkeyup: filterActionFn
        }));
        if (filter_reset_button_text !== false) {
            (0, jquery_1.default)(filter_selector_string_tmp).append(this.makeElement('<button>', {
                type: 'button',
                id: dateId + '-reset',
                onmousedown: Yadcf.stopPropagation,
                onclick: function (tableSel) {
                    return function (event) {
                        Yadcf.stopPropagation(event);
                        Yadcf.dateSelectSingle(tableSel, Yadcf.eventTargetFixUp(event).target, 'clear');
                        return false;
                    };
                }(table_selector_jq_friendly),
                class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                text: filter_reset_button_text
            }));
        }
        if (columnObj.datepicker_type === 'jquery-ui') {
            datepickerObj.dateFormat = date_format;
        }
        else if (columnObj.datepicker_type.indexOf('bootstrap') !== -1 || columnObj.datepicker_type === 'dt-datetime') {
            datepickerObj.format = date_format;
        }
        else if (columnObj.datepicker_type === 'daterangepicker') {
            datepickerObj.locale = {};
            datepickerObj.locale.format = date_format;
        }
        if (columnObj.externally_triggered !== true) {
            if (columnObj.datepicker_type === 'jquery-ui') {
                // @ts-expect-error
                datepickerObj.onSelect = dateSelectSingle;
            }
        }
        datepickerObj = jquery_1.default.extend({}, datepickerObj, columnObj.filter_plugin_options);
        if (columnObj.datepicker_type === 'jquery-ui') {
            if (columnObj.jquery_ui_datepicker_locale) {
                jquery_1.default.extend(datepickerObj, jquery_1.default.datepicker.regional[columnObj.jquery_ui_datepicker_locale]);
            }
            (0, jquery_1.default)('#' + dateId).datepicker(datepickerObj);
        }
        else if (columnObj.datepicker_type === 'bootstrap-datetimepicker') {
            datepickerObj.useCurrent = false;
            (0, jquery_1.default)('#' + dateId).datetimepicker(datepickerObj);
            if (columnObj.externally_triggered !== true) {
                if (datepickerObj.format.toLowerCase() !== 'hh:mm') {
                    (0, jquery_1.default)('#' + dateId).on('dp.change', this.dateSelectSingle);
                }
                else {
                    (0, jquery_1.default)('#' + dateId).on('dp.hide', this.dateSelectSingle);
                }
            }
        }
        else if (columnObj.datepicker_type === 'bootstrap-datepicker') {
            (0, jquery_1.default)('#' + dateId).datepicker(datepickerObj).on('changeDate', function (e) {
                this.dateSelectSingle(e);
                (0, jquery_1.default)(this).datepicker('hide');
            });
        }
        else if (columnObj.datepicker_type === 'dt-datetime') {
            // @ts-expect-error
            new jquery_1.default.fn.DataTable.Editor.DateTime((0, jquery_1.default)('#' + dateId), {
                format: date_format,
                onChange: this.dateSelectSingle
            });
        }
        else if (columnObj.datepicker_type === 'daterangepicker') {
            // @ts-expect-error
            (0, jquery_1.default)('#' + dateId).daterangepicker(datepickerObj);
            (0, jquery_1.default)('#' + dateId).on('apply.daterangepicker, hide.daterangepicker', function (ev, picker) {
                Yadcf.dateSelect(ev, picker);
            });
        }
        if (oTable.fnSettings().aoPreSearchCols[column_number].sSearch !== '') {
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(oTable.fnSettings().aoPreSearchCols[column_number].sSearch).addClass('inuse');
        }
        if (columnObj.filter_type === 'date_custom_func') {
            settingsDt = this.getSettingsObjFromTable(oTable);
            if (oTable.fnSettings().oFeatures.bStateSave === true && oTable.fnSettings().oLoadedState) {
                if (oTable.fnSettings().oLoadedState.yadcfState && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number]) {
                    (0, jquery_1.default)('#' + dateId).val(oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from);
                    if (oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from !== '') {
                        (0, jquery_1.default)('#' + dateId).addClass('inuse');
                    }
                }
            }
            if (settingsDt.oFeatures.bServerSide !== true) {
                this.addCustomFunctionFilterCapability(table_selector_jq_friendly, "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number), column_number);
            }
        }
        if (columnObj.datepicker_type === 'daterangepicker' && oTable.fnSettings().oFeatures.bServerSide !== true) {
            this.addRangeDateFilterCapability(table_selector_jq_friendly, dateId, dateId, column_number, date_format);
        }
        this.resetIApiIndex();
    };
    Yadcf.rangeNumberSldierDrawTips = function (min_tip_val, max_tip_val, min_tip_id, max_tip_id, table_selector_jq_friendly, column_number) {
        var first_handle = (0, jquery_1.default)(".yadcf-number-slider-filter-wrapper-inner.-".concat(table_selector_jq_friendly, "-").concat(column_number)), // + ' .ui-slider-handle:first'),
        last_handle = (0, jquery_1.default)(".yadcf-number-slider-filter-wrapper-inner.-".concat(table_selector_jq_friendly, "-").concat(column_number)), // + ' .ui-slider-handle:last'),
        min_tip_inner, max_tip_inner;
        min_tip_inner = (0, jquery_1.default)('<div>', {
            id: min_tip_id,
            class: 'yadcf-filter-range-number-slider-min-tip-inner',
            text: min_tip_val
        });
        max_tip_inner = (0, jquery_1.default)('<div>', {
            id: max_tip_id,
            class: 'yadcf-filter-range-number-slider-max-tip-inner',
            text: max_tip_val
        });
        if (first_handle.length === 1) {
            first_handle = (0, jquery_1.default)(".yadcf-number-slider-filter-wrapper-inner.-".concat(table_selector_jq_friendly, "-").concat(column_number, " .ui-slider-handle:first"));
            (0, jquery_1.default)(first_handle).addClass('yadcf-filter-range-number-slider-min-tip').html(min_tip_inner);
            last_handle = (0, jquery_1.default)(".yadcf-number-slider-filter-wrapper-inner.-".concat(table_selector_jq_friendly, "-").concat(column_number, " .ui-slider-handle:last"));
            (0, jquery_1.default)(last_handle).addClass('yadcf-filter-range-number-slider-max-tip').html(max_tip_inner);
        }
        else {
            // Might happen when scrollX is used or when filter row is being duplicated by DataTables.
            (0, jquery_1.default)((0, jquery_1.default)(first_handle)[0]).find('.ui-slider-handle:first').addClass('yadcf-filter-range-number-slider-min-tip').html(min_tip_inner);
            (0, jquery_1.default)((0, jquery_1.default)(last_handle)[0]).find('.ui-slider-handle:last').addClass('yadcf-filter-range-number-slider-max-tip').html(max_tip_inner);
            (0, jquery_1.default)((0, jquery_1.default)(first_handle)[1]).find('.ui-slider-handle:first').addClass('yadcf-filter-range-number-slider-min-tip').html(min_tip_inner);
            (0, jquery_1.default)((0, jquery_1.default)(last_handle)[1]).find('.ui-slider-handle:last').addClass('yadcf-filter-range-number-slider-max-tip').html(max_tip_inner);
        }
    };
    Yadcf.rangeNumberSliderChange = function (table_selector_jq_friendly, event, ui) {
        var oTable, min_val, max_val, slider_inuse, yadcfState, column_number, columnObj, keyUp, settingsDt, column_number_filter;
        event = this.eventTargetFixUp(event);
        column_number = (0, jquery_1.default)(event.target).attr('id').replace('yadcf-filter-', '').replace(table_selector_jq_friendly, '').replace('-slider-', '');
        oTable = this.oTables[table_selector_jq_friendly];
        settingsDt = this.getSettingsObjFromTable(oTable);
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        columnObj = this.getOptions(oTable.selector)[column_number];
        keyUp = function () {
            jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
            if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                oTable.fnDraw();
            }
            else {
                oTable.fnFilter(ui.values[0] + columnObj.custom_range_delimiter + ui.values[1], column_number_filter);
            }
            min_val = +(0, jquery_1.default)((0, jquery_1.default)(event.target).parent().find('.yadcf-filter-range-number-slider-min-tip-hidden')).text();
            max_val = +(0, jquery_1.default)((0, jquery_1.default)(event.target).parent().find('.yadcf-filter-range-number-slider-max-tip-hidden')).text();
            if (min_val !== ui.values[0]) {
                (0, jquery_1.default)((0, jquery_1.default)(event.target).find('.ui-slider-handle')[0]).addClass('inuse');
                slider_inuse = true;
            }
            else {
                (0, jquery_1.default)((0, jquery_1.default)(event.target).find('.ui-slider-handle')[0]).removeClass('inuse');
            }
            if (max_val !== ui.values[1]) {
                (0, jquery_1.default)((0, jquery_1.default)(event.target).find('.ui-slider-handle')[1]).addClass('inuse');
                slider_inuse = true;
            }
            else {
                (0, jquery_1.default)((0, jquery_1.default)(event.target).find('.ui-slider-handle')[1]).removeClass('inuse');
            }
            if (slider_inuse === true) {
                (0, jquery_1.default)(event.target).find('.ui-slider-range').addClass('inuse');
            }
            else {
                (0, jquery_1.default)(event.target).find('.ui-slider-range').removeClass('inuse');
            }
            if (!oTable.fnSettings().oLoadedState) {
                oTable.fnSettings().oLoadedState = {};
                oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
            }
            if (oTable.fnSettings().oFeatures.bStateSave === true) {
                if (oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                    oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number] = {
                        from: ui.values[0],
                        to: ui.values[1]
                    };
                }
                else {
                    yadcfState = {};
                    yadcfState[table_selector_jq_friendly] = [];
                    yadcfState[table_selector_jq_friendly][column_number] = {
                        from: ui.values[0],
                        to: ui.values[1]
                    };
                    oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
                }
                oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
            }
            Yadcf.resetIApiIndex();
        };
        if (columnObj.filter_delay === undefined) {
            keyUp();
        }
        else {
            this.yadcfDelay(function () {
                keyUp();
            }, columnObj.filter_delay);
        }
    };
    Yadcf.addRangeNumberSliderFilter = function (filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, min_val, max_val, ignore_char) {
        var sliderId = "yadcf-filter-".concat(table_selector_jq_friendly, "-slider-").concat(column_number), min_tip_id = "yadcf-filter-".concat(table_selector_jq_friendly, "-min_tip-").concat(column_number), max_tip_id = "yadcf-filter-".concat(table_selector_jq_friendly, "-max_tip-").concat(column_number), filter_selector_string_tmp, filter_wrapper_id, oTable, min_state_val = min_val, max_state_val = max_val, columnObj, slideFunc, changeFunc, sliderObj, sliderMaxMin = {
            min: min_val,
            max: max_val
        }, settingsDt, currSliderMin = (0, jquery_1.default)('#' + sliderId).slider('option', 'min'), currSliderMax = (0, jquery_1.default)('#' + sliderId).slider('option', 'max'), redrawTable;
        filter_wrapper_id = "yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number);
        if ((0, jquery_1.default)('#' + filter_wrapper_id).length > 0 && (currSliderMin === min_val && currSliderMax === max_val)) {
            return;
        }
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        oTable = this.oTables[table_selector_jq_friendly];
        settingsDt = this.settingsMap[this.generateTableSelectorJQFriendly2(oTable)];
        if ((0, jquery_1.default)('#' + filter_wrapper_id).length > 0) {
            (0, jquery_1.default)('#' + sliderId).slider('destroy');
            (0, jquery_1.default)('#' + filter_wrapper_id).remove();
            redrawTable = true;
        }
        columnObj = this.getOptions(oTable.selector)[column_number];
        if (settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState) {
            if (settingsDt.oLoadedState.yadcfState && settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly] && settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number]) {
                if (min_val !== settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from) {
                    min_state_val = settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from;
                }
                if (max_val !== settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].to) {
                    max_state_val = settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].to;
                }
            }
        }
        if (isFinite(min_val) && isFinite(max_val) && isFinite(min_state_val) && isFinite(max_state_val)) {
            // Add a wrapper to hold both filter and reset button.
            (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<div>', {
                onmousedown: this.stopPropagation,
                onclick: this.stopPropagation,
                id: filter_wrapper_id,
                class: "yadcf-filter-wrapper ".concat(columnObj.style_class)
            }));
            filter_selector_string += ' div.yadcf-filter-wrapper';
            filter_selector_string_tmp = filter_selector_string;
            (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<div>', {
                id: "yadcf-filter-wrapper-inner-".concat(table_selector_jq_friendly, "-").concat(column_number),
                class: "yadcf-number-slider-filter-wrapper-inner -".concat(table_selector_jq_friendly, "-").concat(column_number)
            }));
            filter_selector_string += ' div.yadcf-number-slider-filter-wrapper-inner';
            (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<div>', {
                id: sliderId,
                class: 'yadcf-filter-range-number-slider'
            }));
            filter_selector_string += ' #' + sliderId;
            (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<span>', {
                class: 'yadcf-filter-range-number-slider-min-tip-hidden hide',
                text: min_val
            }));
            (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<span>', {
                class: 'yadcf-filter-range-number-slider-max-tip-hidden hide',
                text: max_val
            }));
            if (columnObj.externally_triggered !== true) {
                slideFunc = function (event, ui) {
                    this.rangeNumberSldierDrawTips(ui.values[0], ui.values[1], min_tip_id, max_tip_id, table_selector_jq_friendly, column_number);
                    this.rangeNumberSliderChange(table_selector_jq_friendly, event, ui);
                };
                changeFunc = function (event, ui) {
                    this.rangeNumberSldierDrawTips(ui.values[0], ui.values[1], min_tip_id, max_tip_id, table_selector_jq_friendly, column_number);
                    if (event.originalEvent || (0, jquery_1.default)(event.target).slider('option', 'yadcf-reset') === true) {
                        (0, jquery_1.default)(event.target).slider('option', 'yadcf-reset', false);
                        this.rangeNumberSliderChange(table_selector_jq_friendly, event, ui);
                    }
                };
            }
            else {
                slideFunc = function (event, ui) {
                    this.rangeNumberSldierDrawTips(ui.values[0], ui.values[1], min_tip_id, max_tip_id, table_selector_jq_friendly, column_number);
                };
                changeFunc = function (event, ui) {
                    this.rangeNumberSldierDrawTips(ui.values[0], ui.values[1], min_tip_id, max_tip_id, table_selector_jq_friendly, column_number);
                };
            }
            sliderObj = {
                range: true,
                min: min_val,
                max: max_val,
                values: [min_state_val, max_state_val],
                create: function (event, ui) {
                    Yadcf.rangeNumberSldierDrawTips(min_state_val, max_state_val, min_tip_id, max_tip_id, table_selector_jq_friendly, column_number);
                },
                slide: slideFunc,
                change: changeFunc
            };
            if (columnObj.filter_plugin_options !== undefined) {
                jquery_1.default.extend(sliderObj, columnObj.filter_plugin_options);
            }
            (0, jquery_1.default)('#' + sliderId).slider(sliderObj);
            if (filter_reset_button_text !== false) {
                (0, jquery_1.default)(filter_selector_string_tmp).append(this.makeElement('<button>', {
                    type: 'button',
                    onmousedown: this.stopPropagation,
                    onclick: function (tableSel) {
                        return function (event) {
                            Yadcf.stopPropagation(event);
                            Yadcf.rangeNumberSliderClear(tableSel, event);
                            return false;
                        };
                    }(table_selector_jq_friendly),
                    class: "yadcf-filter-reset-button range-number-slider-reset-button ".concat(columnObj.reset_button_style_class),
                    text: filter_reset_button_text
                }));
            }
        }
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        oTable = this.oTables[table_selector_jq_friendly];
        if (settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState) {
            if (settingsDt.oLoadedState.yadcfState && settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly] && settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number]) {
                if (isFinite(min_val) && min_val !== settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from) {
                    (0, jquery_1.default)((0, jquery_1.default)(filter_selector_string).find('.ui-slider-handle')[0]).addClass('inuse');
                }
                if (isFinite(max_val) && max_val !== settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].to) {
                    (0, jquery_1.default)((0, jquery_1.default)(filter_selector_string).find('.ui-slider-handle')[1]).addClass('inuse');
                }
                if ((isFinite(min_val) && isFinite(max_val)) && (min_val !== settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from || max_val !== settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].to)) {
                    (0, jquery_1.default)((0, jquery_1.default)(filter_selector_string).find('.ui-slider-range')).addClass('inuse');
                }
            }
        }
        this.resetIApiIndex();
        if (settingsDt.oFeatures.bServerSide !== true) {
            this.addRangeNumberAndSliderFilterCapability(table_selector_jq_friendly, min_tip_id, max_tip_id, column_number, ignore_char, sliderMaxMin);
        }
        if (redrawTable === true) {
            oTable.fnDraw(false);
        }
    };
    Yadcf.destroyThirdPartyPlugins = function (table_arg) {
        var tableOptions, table_selector_jq_friendly, columnObjKey, column_number, optionsObj, fromId, toId;
        // Check if the table arg is from new datatables API (capital 'D').
        if (table_arg.settings !== undefined) {
            table_arg = table_arg.settings()[0].oInstance;
        }
        tableOptions = this.getOptions(table_arg.selector);
        table_selector_jq_friendly = this.generateTableSelectorJQFriendly2(table_arg);
        for (columnObjKey in tableOptions) {
            if (tableOptions.hasOwnProperty(columnObjKey)) {
                optionsObj = tableOptions[columnObjKey];
                column_number = optionsObj.column_number;
                switch (optionsObj.filter_type) {
                    case 'multi_select':
                    case 'multi_select_custom_func':
                    case 'select':
                    case 'custom_func':
                        switch (optionsObj.select_type) {
                            case 'chosen':
                                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).chosen('destroy');
                                break;
                            case 'select2':
                                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).select2('destroy');
                                break;
                            case 'custom_select':
                                if (this.selectElementCustomDestroyFunc !== undefined) {
                                    this.selectElementCustomDestroyFunc((0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)));
                                }
                                break;
                        }
                        break;
                    case 'auto_complete':
                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).autocomplete('destroy');
                        break;
                    case 'date':
                        switch (optionsObj.select_type) {
                            case 'jquery-ui':
                                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).datepicker('destroy');
                                break;
                            case 'bootstrap-datetimepicker':
                                // @ts-expect-error
                                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).destroy();
                                break;
                        }
                        break;
                    case 'range_date':
                        fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-date-").concat(column_number);
                        toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-to-date-").concat(column_number);
                        switch (optionsObj.select_type) {
                            case 'jquery-ui':
                                (0, jquery_1.default)('#' + fromId).datepicker('destroy');
                                (0, jquery_1.default)('#' + toId).datepicker('destroy');
                                break;
                            case 'bootstrap-datetimepicker':
                                // @ts-expect-error
                                (0, jquery_1.default)('#' + fromId).destroy();
                                // @ts-expect-error
                                (0, jquery_1.default)('#' + toId).destroy();
                                break;
                        }
                        break;
                    case 'range_number_slider':
                        (0, jquery_1.default)('#yadcf-filter-' + table_selector_jq_friendly + '-slider-' + column_number).slider('destroy');
                        break;
                }
            }
        }
    };
    Yadcf.removeFilters = function (oTable) {
        var tableId = this.getTableId(oTable);
        (0, jquery_1.default)('#' + tableId + ' .yadcf-filter-wrapper').remove();
        if (this.yadcfVersionCheck('1.13')) {
            (0, jquery_1.default)(document).off('draw.dt', oTable.selector);
            (0, jquery_1.default)(document).off('xhr.dt', oTable.selector);
            (0, jquery_1.default)(document).off('column-visibility.dt', oTable.selector);
            (0, jquery_1.default)(document).off('destroy.dt', oTable.selector);
            (0, jquery_1.default)(document).off('stateLoaded.dt', oTable.selector);
        }
        else {
            (0, jquery_1.default)(document).off('draw', oTable.selector);
            (0, jquery_1.default)(document).off('destroy', oTable.selector);
        }
        if (jquery_1.default.fn.dataTable.ext.afnFiltering.length > 0) {
            jquery_1.default.fn.dataTable.ext.afnFiltering.splice(0, jquery_1.default.fn.dataTable.ext.afnFiltering.length);
        }
        this.destroyThirdPartyPlugins(oTable);
    };
    /* alphanum.js (C) Brian Huisman
      Based on the Alphanum Algorithm by David Koelle
      The Alphanum Algorithm is discussed at http://www.DaveKoelle.com
    */
    Yadcf.sortAlphaNum = function (a, b) {
        function chunkify(t) {
            var tz = [];
            var x = 0, y = -1, n = 0, i, j;
            while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                var m = (i == 46 || (i >= 48 && i <= 57));
                if (m !== n) {
                    tz[++y] = '';
                    n = m;
                }
                tz[y] += j;
            }
            return tz;
        }
        if (typeof a === 'object' && typeof a.label === 'string') {
            a = a.label;
        }
        if (typeof b === 'object' && typeof b.label === 'string') {
            b = b.label;
        }
        var aa = chunkify(a.toLowerCase());
        var bb = chunkify(b.toLowerCase());
        for (var x = 0; aa[x] && bb[x]; x++) {
            if (aa[x] !== bb[x]) {
                var c = Number(aa[x]), d = Number(bb[x]);
                if (c.toString() == aa[x] && d.toString() == bb[x]) {
                    return c - d;
                }
                return (aa[x] > bb[x]) ? 1 : -1;
            }
        }
        return aa.length - bb.length;
    };
    Yadcf.sortColumnData = function (column_data, columnObj) {
        if ((0, includes_1.default)(['select', 'auto_complete', 'multi_select', 'multi_select_custom_func', 'custom_func'], columnObj.filter_type)) {
            if (columnObj.sort_as === 'alpha') {
                if (columnObj.sort_order === 'asc') {
                    column_data.sort();
                }
                else if (columnObj.sort_order === 'desc') {
                    column_data.sort();
                    column_data.reverse();
                }
            }
            else if (columnObj.sort_as === 'num') {
                if (columnObj.sort_order === 'asc') {
                    column_data.sort(this.sortNumAsc);
                }
                else if (columnObj.sort_order === 'desc') {
                    column_data.sort(this.sortNumDesc);
                }
            }
            else if (columnObj.sort_as === 'alphaNum') {
                if (columnObj.sort_order === 'asc') {
                    column_data.sort(this.sortAlphaNum);
                }
                else if (columnObj.sort_order === 'desc') {
                    column_data.sort(this.sortAlphaNum);
                    column_data.reverse();
                }
            }
            else if (columnObj.sort_as === 'custom') {
                column_data.sort(columnObj.sort_as_custom_func);
            }
        }
        return column_data;
    };
    Yadcf.getFilteredRows = function (table) {
        var data = [], dataTmp, i;
        // @ts-expect-error
        if (table.rows || table._) {
            if (this.yadcfVersionCheck('1.10')) {
                dataTmp = table.rows({ search: 'applied' }).data().toArray();
            }
            else { // v 1.9 and below
                // @ts-expect-error
                dataTmp = table._('tr', { search: 'applied' });
            }
        }
        for (i = 0; i < dataTmp.length; i++) {
            data.push({ _aData: dataTmp[i] });
        }
        return data;
    };
    Yadcf.parseTableColumn = function (pTable, columnObj, table_selector_jq_friendly, pSettings) {
        var col_filter_array = {}, column_data = [], col_inner_elements, col_inner_data, col_inner_data_helper, j, k, data, data_length, settingsDt, column_number_filter;
        if (pSettings !== undefined) {
            settingsDt = pSettings;
        }
        else {
            settingsDt = this.getSettingsObjFromTable(pTable);
        }
        if (columnObj.cumulative_filtering !== true) {
            data = settingsDt.aoData;
            data_length = data.length;
        }
        else {
            data = this.getFilteredRows(pTable);
            data_length = data.length;
        }
        if (columnObj.col_filter_array !== undefined) {
            col_filter_array = columnObj.col_filter_array;
        }
        column_number_filter = this.calcColumnNumberFilter(settingsDt, columnObj.column_number, table_selector_jq_friendly);
        if (isNaN(settingsDt.aoColumns[column_number_filter].mData) && typeof settingsDt.aoColumns[column_number_filter].mData !== 'object') {
            columnObj.column_number_data = settingsDt.aoColumns[column_number_filter].mData;
        }
        if (isNaN(settingsDt.aoColumns[column_number_filter].mRender) && typeof settingsDt.aoColumns[column_number_filter].mRender !== 'object') {
            columnObj.column_number_render = settingsDt.aoColumns[column_number_filter].mRender;
        }
        for (j = 0; j < data_length; j++) {
            if (columnObj.column_data_type === 'html') {
                if (columnObj.column_number_data === undefined) {
                    col_inner_elements = (0, jquery_1.default)(data[j]._aData[column_number_filter]);
                }
                else {
                    col_inner_elements = this.dot2obj(data[j]._aData, columnObj.column_number_data);
                    col_inner_elements = (0, jquery_1.default)(col_inner_elements);
                }
                if (col_inner_elements.length > 0) {
                    for (k = 0; k < col_inner_elements.length; k++) {
                        col_inner_data = null;
                        col_inner_data_helper = null;
                        switch (columnObj.html_data_type) {
                            case 'text':
                                col_inner_data = (0, jquery_1.default)(col_inner_elements[k]).text();
                                break;
                            case 'value':
                                col_inner_data = (0, jquery_1.default)(col_inner_elements[k]).val();
                                break;
                            case 'id':
                                col_inner_data = col_inner_elements[k].id;
                                break;
                            case 'selector':
                                var len = (0, jquery_1.default)(col_inner_elements[k]).find(columnObj.html_data_selector).length;
                                if (len === 1) {
                                    col_inner_data = (0, jquery_1.default)(col_inner_elements[k]).find(columnObj.html_data_selector).text();
                                }
                                else if (len > 1) {
                                    col_inner_data_helper = (0, jquery_1.default)(col_inner_elements[k]).find(columnObj.html_data_selector);
                                }
                                break;
                        }
                        if (col_inner_data || col_inner_data_helper) {
                            if (!col_inner_data_helper) {
                                if ((0, trim_1.default)(col_inner_data) !== '' && !(col_filter_array.hasOwnProperty(col_inner_data))) {
                                    col_filter_array[col_inner_data] = col_inner_data;
                                    column_data.push(col_inner_data);
                                }
                            }
                            else {
                                col_inner_data = col_inner_data_helper;
                                col_inner_data_helper.each(function (index) {
                                    var elm = (0, jquery_1.default)(col_inner_data[index]).text();
                                    if ((0, trim_1.default)(elm) !== '' && !(col_filter_array.hasOwnProperty(elm))) {
                                        col_filter_array[elm] = elm;
                                        column_data.push(elm);
                                    }
                                });
                            }
                        }
                    }
                }
                else {
                    if (col_inner_elements.selector) {
                        col_inner_data = col_inner_elements.selector;
                    }
                    else {
                        col_inner_data = data[j]._aData[column_number_filter];
                    }
                    if ((0, trim_1.default)(col_inner_data) !== '' && !(col_filter_array.hasOwnProperty(col_inner_data))) {
                        col_filter_array[col_inner_data] = col_inner_data;
                        column_data.push(col_inner_data);
                    }
                }
            }
            else if (columnObj.column_data_type === 'text') {
                if (columnObj.text_data_delimiter !== undefined) {
                    if (columnObj.column_number_data === undefined) {
                        col_inner_elements = data[j]._aData[column_number_filter].split(columnObj.text_data_delimiter);
                    }
                    else {
                        col_inner_elements = this.dot2obj(data[j]._aData, columnObj.column_number_data);
                        col_inner_elements = (col_inner_elements + '').split(columnObj.text_data_delimiter);
                    }
                    for (k = 0; k < col_inner_elements.length; k++) {
                        col_inner_data = col_inner_elements[k];
                        if ((0, trim_1.default)(col_inner_data) !== '' && !(col_filter_array.hasOwnProperty(col_inner_data))) {
                            col_filter_array[col_inner_data] = col_inner_data;
                            column_data.push(col_inner_data);
                        }
                    }
                }
                else {
                    if (columnObj.column_number_data === undefined) {
                        col_inner_data = data[j]._aData[column_number_filter];
                        if (col_inner_data !== null && typeof col_inner_data === 'object') {
                            if (columnObj.html5_data !== undefined) {
                                col_inner_data = col_inner_data["@".concat(columnObj.html5_data)];
                            }
                            else if (col_inner_data && col_inner_data.display) {
                                col_inner_data = col_inner_data.display;
                            }
                            else {
                                console.log("Warning: Looks like you have forgot to define the html5_data attribute for the ".concat(columnObj.column_number, " column"));
                                return [];
                            }
                        }
                    }
                    else if (data[j]._aFilterData !== undefined && data[j]._aFilterData !== null) {
                        col_inner_data = data[j]._aFilterData[column_number_filter];
                    }
                    else {
                        col_inner_data = this.dot2obj(data[j]._aData, columnObj.column_number_data);
                    }
                    if ((0, trim_1.default)(col_inner_data) !== '' && !(col_filter_array.hasOwnProperty(col_inner_data))) {
                        col_filter_array[col_inner_data] = col_inner_data;
                        column_data.push(col_inner_data);
                    }
                }
            }
            else if (columnObj.column_data_type === 'rendered_html') {
                if (data[j]._aFilterData) {
                    col_inner_elements = data[j]._aFilterData[column_number_filter];
                }
                else if (columnObj.column_data_render) {
                    col_inner_elements = columnObj.column_data_render(data[j]._aData);
                }
                else {
                    console.log('Looks like you missing column_data_render function for the column ' + column_number_filter);
                }
                if (typeof col_inner_elements !== 'string') {
                    col_inner_elements = (0, jquery_1.default)(col_inner_elements);
                    if (col_inner_elements.length > 0) {
                        for (k = 0; k < col_inner_elements.length; k++) {
                            switch (columnObj.html_data_type) {
                                case 'text':
                                    col_inner_data = (0, jquery_1.default)(col_inner_elements[k]).text();
                                    break;
                                case 'value':
                                    col_inner_data = (0, jquery_1.default)(col_inner_elements[k]).val();
                                    break;
                                case 'id':
                                    col_inner_data = col_inner_elements[k].id;
                                    break;
                                case 'selector':
                                    col_inner_data = (0, jquery_1.default)(col_inner_elements[k]).find(columnObj.html_data_selector).text();
                                    break;
                            }
                        }
                    }
                    else {
                        col_inner_data = col_inner_elements.selector;
                    }
                }
                else {
                    col_inner_data = col_inner_elements;
                }
                if (columnObj.text_data_delimiter !== undefined) {
                    col_inner_elements = col_inner_elements.split(columnObj.text_data_delimiter);
                    for (k = 0; k < col_inner_elements.length; k++) {
                        col_inner_data = col_inner_elements[k];
                        if ((0, trim_1.default)(col_inner_data) !== '' && !(col_filter_array.hasOwnProperty(col_inner_data))) {
                            col_filter_array[col_inner_data] = col_inner_data;
                            column_data.push(col_inner_data);
                        }
                    }
                }
                else {
                    if ((0, trim_1.default)(col_inner_data) !== '' && !(col_filter_array.hasOwnProperty(col_inner_data))) {
                        col_filter_array[col_inner_data] = col_inner_data;
                        column_data.push(col_inner_data);
                    }
                }
            }
            else if (columnObj.column_data_type === 'html5_data_complex') {
                col_inner_data = data[j]._aData[column_number_filter];
                col_inner_data_helper = col_inner_data['@' + columnObj.html5_data];
                if (!col_filter_array.hasOwnProperty(col_inner_data_helper)) {
                    col_filter_array[col_inner_data_helper] = col_inner_data_helper;
                    column_data.push({
                        value: col_inner_data_helper,
                        label: col_inner_data.display
                    });
                }
            }
        }
        columnObj.col_filter_array = col_filter_array;
        if (column_data && columnObj.ignore_char !== undefined) {
            column_data = column_data.map(function (element) { return element.toString().replace(columnObj.ignore_char, ''); });
        }
        return column_data;
    };
    Yadcf.makeElement = function (element, opts) {
        /* Wrap making an element so all event handlers are dynamically bound. */
        var onclick = opts.onclick;
        var onkeyup = opts.onkeyup;
        var onmousedown = opts.onmousedown;
        var onkeydown = opts.onkeydown;
        var onchange = opts.onchange;
        delete opts.onclick;
        delete opts.onkeyup;
        delete opts.onmousedown;
        delete opts.onkeydown;
        delete opts.onchange;
        var $el = (0, jquery_1.default)(element, opts);
        if (onclick) {
            $el.on('click', onclick);
        }
        if (onkeyup) {
            $el.on('keyup', onkeyup);
        }
        if (onkeydown) {
            $el.on('keydown', onkeydown);
        }
        if (onmousedown) {
            $el.on('mousedown', onmousedown);
        }
        if (onchange) {
            $el.on('change', onchange);
        }
        return $el;
    };
    Yadcf.appendFilters = function (oTable, args, table_selector, pSettings) {
        var $filter_selector, filter_selector_string, data, filter_container_id, column_number_data, column_number, column_position, filter_default_label, filter_reset_button_text, enable_auto_complete, date_format, ignore_char, filter_match_mode, column_data, column_data_temp, options_tmp, ii, table_selector_jq_friendly, min_val, max_val, col_num_visible, col_num_visible_iter, tmpStr, columnObjKey, columnObj, filters_position, unique_th, settingsDt, filterActionFn, custom_func_filter_value_holder, exclude_str, regex_str, null_str, externally_triggered_checkboxes_text, externally_triggered_checkboxes_function;
        if (pSettings === undefined) {
            settingsDt = this.getSettingsObjFromTable(oTable);
        }
        else {
            settingsDt = pSettings;
        }
        this.settingsMap[this.generateTableSelectorJQFriendly2(oTable)] = settingsDt;
        table_selector_jq_friendly = this.generateTableSelectorJQFriendly2(oTable);
        this.initColReorder2(settingsDt, table_selector_jq_friendly);
        filters_position = (0, jquery_1.default)(document).data("".concat(table_selector, "_filters_position"));
        if (settingsDt.oScroll.sX !== '' || settingsDt.oScroll.sY !== '') {
            table_selector = ".yadcf-datatables-table-".concat(table_selector_jq_friendly);
            if ((0, jquery_1.default)(table_selector).length === 0) {
                this.scrollXYHandler(oTable, '#' + this.getTableId(oTable));
            }
        }
        if (settingsDt.oApi._fnGetUniqueThs !== undefined) {
            unique_th = settingsDt.oApi._fnGetUniqueThs(settingsDt);
        }
        var _loop_1 = function () {
            if (args.hasOwnProperty(columnObjKey)) {
                columnObj = args[columnObjKey];
                options_tmp = (0, jquery_1.default)();
                tmpStr = '';
                data = columnObj.data;
                column_data = [];
                column_data_temp = [];
                filter_container_id = columnObj.filter_container_id;
                column_number = columnObj.column_number;
                column_number = +column_number;
                column_position = column_number;
                if (this_1.plugins[table_selector_jq_friendly] !== undefined &&
                    (this_1.plugins[table_selector_jq_friendly] !== undefined &&
                        this_1.plugins[table_selector_jq_friendly].ColReorder !== undefined)) {
                    column_position = this_1.plugins[table_selector_jq_friendly].ColReorder[column_number];
                }
                columnObj.column_number = column_number;
                column_number_data = undefined;
                if (isNaN(settingsDt.aoColumns[column_position].mData) &&
                    (typeof settingsDt.aoColumns[column_position].mData !== 'object')) {
                    column_number_data = settingsDt.aoColumns[column_position].mData;
                    columnObj.column_number_data = column_number_data;
                }
                else if (settingsDt.aoColumns[column_position].mData &&
                    settingsDt.aoColumns[column_position].mData.filter) {
                    column_number_data = settingsDt.aoColumns[column_position].mData.filter;
                    columnObj.column_number_data = column_number_data;
                }
                if (isNaN(settingsDt.aoColumns[column_position].mRender) &&
                    typeof settingsDt.aoColumns[column_position].mRender !== 'object') {
                    columnObj.column_number_render = settingsDt.aoColumns[column_position].mRender;
                }
                filter_default_label = columnObj.filter_default_label;
                filter_reset_button_text = columnObj.filter_reset_button_text;
                externally_triggered_checkboxes_text = columnObj.externally_triggered_checkboxes_text;
                externally_triggered_checkboxes_function = columnObj.externally_triggered_checkboxes_function;
                enable_auto_complete = columnObj.enable_auto_complete;
                date_format = columnObj.date_format;
                if (columnObj.datepicker_type === 'jquery-ui') {
                    date_format = (date_format !== 'yyyy-mm-dd') ? date_format.replace('yyyy', 'yy') : date_format;
                }
                if (columnObj.datepicker_type === 'bootstrap-datetimepicker' &&
                    columnObj.filter_plugin_options !== undefined &&
                    columnObj.filter_plugin_options.format !== undefined) {
                    date_format = columnObj.filter_plugin_options.format;
                }
                columnObj.date_format = date_format;
                if (columnObj.ignore_char !== undefined && !(columnObj.ignore_char instanceof RegExp)) {
                    ignore_char = new RegExp(columnObj.ignore_char, 'g');
                    columnObj.ignore_char = ignore_char;
                }
                filter_match_mode = columnObj.filter_match_mode;
                if (column_number === undefined) {
                    alert('You must specify column number');
                    return { value: void 0 };
                }
                if (enable_auto_complete === true) {
                    columnObj.filter_type = 'auto_complete';
                }
                if (filter_default_label === undefined) {
                    if (columnObj.filter_type === 'select' || columnObj.filter_type === 'custom_func') {
                        filter_default_label = this_1.default_options.language.select;
                    }
                    else if (columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'multi_select_custom_func') {
                        filter_default_label = this_1.default_options.language.select_multi;
                    }
                    else if (columnObj.filter_type === 'auto_complete' || columnObj.filter_type === 'text') {
                        filter_default_label = this_1.default_options.language.filter;
                    }
                    else if (columnObj.filter_type === 'range_number' || columnObj.filter_type === 'range_date') {
                        filter_default_label = this_1.default_options.language.range;
                    }
                    else if (columnObj.filter_type === 'date' || columnObj.filter_type === 'date_custom_func') {
                        filter_default_label = this_1.default_options.language.date;
                    }
                    columnObj.filter_default_label = filter_default_label;
                }
                if (filter_reset_button_text === undefined) {
                    filter_reset_button_text = 'x';
                }
                if (data !== undefined) {
                    for (ii = 0; ii < data.length; ii++) {
                        column_data.push(data[ii]);
                    }
                }
                if (data === undefined || columnObj.append_data_to_table_data !== undefined) {
                    columnObj.col_filter_array = undefined;
                    column_data_temp = this_1.parseTableColumn(oTable, columnObj, table_selector_jq_friendly, settingsDt);
                    if (columnObj.append_data_to_table_data !== 'before') {
                        column_data = column_data.concat(column_data_temp);
                    }
                    else {
                        column_data_temp = this_1.sortColumnData(column_data_temp, columnObj);
                        column_data = column_data.concat(column_data_temp);
                    }
                }
                if (columnObj.append_data_to_table_data === undefined || columnObj.append_data_to_table_data === 'sorted') {
                    column_data = this_1.sortColumnData(column_data, columnObj);
                }
                if (columnObj.filter_type === 'range_number_slider') {
                    var column_data_render_1;
                    if (columnObj.column_number_render) {
                        column_data_render_1 = jquery_1.default.extend(true, [], column_data);
                        column_data_render_1.forEach(function (data, index) {
                            var meta = {
                                row: index,
                                col: columnObj.column_number,
                                settings: settingsDt
                            };
                            var indexData = columnObj.column_number_data ? columnObj.column_number_data : index;
                            if (typeof indexData === 'string' && typeof column_data_render_1 === 'object') {
                                var cellDataRender = columnObj.column_number_render(Yadcf.getProp(column_data_render_1, indexData), 'filter', column_data, meta);
                                Yadcf.setProp(column_data_render_1, indexData, (cellDataRender !== undefined && cellDataRender !== null) ? cellDataRender : Yadcf.getProp(column_data, indexData));
                            }
                            else {
                                var cellDataRender = columnObj.column_number_render(column_data_render_1[indexData], 'filter', column_data, meta);
                                column_data_render_1[indexData] = (cellDataRender !== undefined && cellDataRender !== null) ? cellDataRender : column_data[indexData];
                            }
                        });
                    }
                    min_val = this_1.findMinInArray(column_data_render_1 ? column_data_render_1 : column_data, columnObj);
                    max_val = this_1.findMaxInArray(column_data_render_1 ? column_data_render_1 : column_data, columnObj);
                }
                if (filter_container_id === undefined && columnObj.filter_container_selector === undefined) {
                    // Can't show filter inside a column for a hidden one (place it outside using filter_container_id)
                    if (settingsDt.aoColumns[column_position].bVisible === false) {
                        return "continue";
                    }
                    if (filters_position !== 'thead') {
                        if (unique_th === undefined) {
                            // Handle hidden columns.
                            col_num_visible = column_position;
                            for (col_num_visible_iter = 0; col_num_visible_iter < settingsDt.aoColumns.length && col_num_visible_iter < column_position; col_num_visible_iter++) {
                                if (settingsDt.aoColumns[col_num_visible_iter].bVisible === false) {
                                    col_num_visible--;
                                }
                            }
                            column_position = col_num_visible;
                            filter_selector_string = table_selector + ' ' + filters_position + ' th:eq(' + column_position + ')';
                        }
                        else {
                            filter_selector_string = table_selector + ' ' + filters_position + ' th:eq(' + (0, jquery_1.default)(unique_th[column_position]).index() + ')';
                        }
                    }
                    else {
                        if (columnObj.filters_tr_index === undefined) {
                            filter_selector_string = table_selector + ' ' + filters_position + ' tr:eq(' + (0, jquery_1.default)(unique_th[column_position]).parent().index() + ') th:eq(' + (0, jquery_1.default)(unique_th[column_position]).index() + ')';
                        }
                        else {
                            filter_selector_string = table_selector + ' ' + filters_position + ' tr:eq(' + columnObj.filters_tr_index + ') th:eq(' + (0, jquery_1.default)(unique_th[column_position]).index() + ')';
                        }
                    }
                    $filter_selector = (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter');
                    if (columnObj.select_type === 'select2' || columnObj.select_type === 'custom_select') {
                        $filter_selector = (0, jquery_1.default)(filter_selector_string).find('select.yadcf-filter');
                    }
                }
                else {
                    if (filter_container_id !== undefined) {
                        columnObj.filter_container_selector = '#' + filter_container_id;
                    }
                    if ((0, jquery_1.default)(columnObj.filter_container_selector).length === 0) {
                        console.log('ERROR: Filter container could not be found, columnObj.filter_container_selector: ' + columnObj.filter_container_selector);
                        return "continue";
                    }
                    filter_selector_string = columnObj.filter_container_selector;
                    $filter_selector = (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter');
                    if (columnObj.select_type === 'select2' || columnObj.select_type === 'custom_select') {
                        $filter_selector = (0, jquery_1.default)(filter_selector_string).find('select.yadcf-filter');
                    }
                }
                if ((0, includes_1.default)(['select', 'custom_func', 'multi_select', 'multi_select_custom_func'], columnObj.filter_type)) {
                    if (columnObj.data_as_is !== true) {
                        if (columnObj.omit_default_label !== true) {
                            if (columnObj.filter_type === 'select' || columnObj.filter_type === 'custom_func') {
                                options_tmp = (0, jquery_1.default)('<option>', {
                                    value: '-1',
                                    text: filter_default_label
                                });
                                if (columnObj.select_type === 'select2' && columnObj.select_type_options.placeholder !== undefined && columnObj.select_type_options.allowClear === true) {
                                    options_tmp = (0, jquery_1.default)('<option>', {
                                        value: ''
                                    });
                                }
                            }
                            else if (columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'multi_select_custom_func') {
                                if (columnObj.select_type === undefined) {
                                    options_tmp = (0, jquery_1.default)('<option>', {
                                        'data-placeholder': 'true',
                                        value: '-1',
                                        text: filter_default_label
                                    });
                                }
                                else {
                                    options_tmp = (0, jquery_1.default)();
                                }
                            }
                        }
                        if (columnObj.append_data_to_table_data === undefined) {
                            if (typeof column_data[0] === 'object') {
                                for (ii = 0; ii < column_data.length; ii++) {
                                    options_tmp = options_tmp.add((0, jquery_1.default)('<option>', {
                                        value: column_data[ii].value,
                                        text: column_data[ii].label
                                    }));
                                }
                            }
                            else {
                                for (ii = 0; ii < column_data.length; ii++) {
                                    options_tmp = options_tmp.add((0, jquery_1.default)('<option>', {
                                        value: column_data[ii],
                                        text: column_data[ii]
                                    }));
                                }
                            }
                        }
                        else {
                            for (ii = 0; ii < column_data.length; ii++) {
                                if (typeof column_data[ii] === 'object') {
                                    options_tmp = options_tmp.add((0, jquery_1.default)('<option>', {
                                        value: column_data[ii].value,
                                        text: column_data[ii].label
                                    }));
                                }
                                else {
                                    options_tmp = options_tmp.add((0, jquery_1.default)('<option>', {
                                        value: column_data[ii],
                                        text: column_data[ii]
                                    }));
                                }
                            }
                        }
                    }
                    else {
                        options_tmp = columnObj.data;
                    }
                    column_data = options_tmp;
                }
                if ($filter_selector.length === 1) {
                    if ((0, includes_1.default)(['select', 'custom_func', 'multi_select', 'multi_select_custom_func'], columnObj.filter_type)) {
                        if (columnObj.filter_type === 'custom_func' || columnObj.filter_type === 'multi_select_custom_func') {
                            custom_func_filter_value_holder = (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val();
                        }
                        if (!columnObj.select_type_options || !columnObj.select_type_options.ajax) {
                            $filter_selector.empty();
                            $filter_selector.append(column_data);
                            if (settingsDt.aoPreSearchCols[column_position].sSearch !== '') {
                                tmpStr = settingsDt.aoPreSearchCols[column_position].sSearch;
                                if (columnObj.filter_type === 'select') {
                                    tmpStr = this_1.yadcfParseMatchFilter(tmpStr, this_1.getOptions(oTable.selector)[column_number].filter_match_mode);
                                    var foundEntry = (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number) + ' option').filter(function () {
                                        return (0, jquery_1.default)(this).val() === tmpStr;
                                    }).prop('selected', true);
                                    if (foundEntry && foundEntry.length > 0) {
                                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse');
                                    }
                                }
                                else if (columnObj.filter_type === 'multi_select') {
                                    tmpStr = this_1.yadcfParseMatchFilterMultiSelect(tmpStr, this_1.getOptions(oTable.selector)[column_number].filter_match_mode);
                                    tmpStr = tmpStr.replace(/\\/g, '');
                                    tmpStr = tmpStr.split('|');
                                    (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(tmpStr);
                                }
                            }
                        }
                        if (columnObj.filter_type === 'custom_func' || columnObj.filter_type === 'multi_select_custom_func') {
                            tmpStr = custom_func_filter_value_holder;
                            if (tmpStr === '-1' || tmpStr === undefined) {
                                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(tmpStr);
                            }
                            else {
                                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(tmpStr).addClass('inuse');
                            }
                        }
                        this_1.initializeSelectPlugin(columnObj.select_type, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)), columnObj.select_type_options);
                        if (columnObj.cumulative_filtering === true && columnObj.select_type === 'chosen') {
                            this_1.refreshSelectPlugin(columnObj, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)));
                        }
                    }
                    else if (columnObj.filter_type === 'auto_complete') {
                        (0, jquery_1.default)(document).data("yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number), column_data);
                    }
                }
                else {
                    if (filter_container_id === undefined && columnObj.filter_container_selector === undefined) {
                        if ((0, jquery_1.default)(filter_selector_string + ' div.DataTables_sort_wrapper').length > 0) {
                            (0, jquery_1.default)(filter_selector_string + ' div.DataTables_sort_wrapper').css('display', 'inline-block');
                        }
                    }
                    else {
                        if (filter_container_id !== undefined) {
                            columnObj.filter_container_selector = '#' + filter_container_id;
                        }
                        if ((0, jquery_1.default)('#yadcf-filter-wrapper-' + this_1.generateTableSelectorJQFriendlyNew(columnObj.filter_container_selector)).length === 0) {
                            (0, jquery_1.default)(columnObj.filter_container_selector).append(this_1.makeElement('<div>', {
                                id: 'yadcf-filter-wrapper-' + this_1.generateTableSelectorJQFriendlyNew(columnObj.filter_container_selector)
                            }));
                        }
                        filter_selector_string = '#yadcf-filter-wrapper-' + this_1.generateTableSelectorJQFriendlyNew(columnObj.filter_container_selector);
                    }
                    if (columnObj.filter_type === 'select' || columnObj.filter_type === 'custom_func') {
                        // Add a wrapper to hold both filter and reset button.
                        (0, jquery_1.default)(filter_selector_string).append(this_1.makeElement('<div>', {
                            id: "yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number),
                            class: 'yadcf-filter-wrapper'
                        }));
                        filter_selector_string += ' div.yadcf-filter-wrapper';
                        if (columnObj.filter_type === 'select') {
                            filterActionFn = function (colNo, tableSel) {
                                return function (event) {
                                    Yadcf.doFilter(this, tableSel, colNo, filter_match_mode);
                                };
                            }(column_number, table_selector_jq_friendly);
                            if (columnObj.externally_triggered === true) {
                                filterActionFn = function () { };
                            }
                            (0, jquery_1.default)(filter_selector_string).append(this_1.makeElement('<select>', {
                                id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number),
                                class: "yadcf-filter ".concat(columnObj.style_class),
                                onchange: filterActionFn,
                                onkeydown: this_1.preventDefaultForEnter,
                                onmousedown: this_1.stopPropagation,
                                onclick: this_1.stopPropagation,
                                html: column_data
                            }));
                            if (filter_reset_button_text !== false) {
                                (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').after(this_1.makeElement('<button>', {
                                    type: 'button',
                                    id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number) + '-reset',
                                    onmousedown: this_1.stopPropagation,
                                    onclick: function (colNo, tableSel) {
                                        return function (event) {
                                            Yadcf.doFilter('clear', tableSel, colNo);
                                            return false;
                                        };
                                    }(column_number, table_selector_jq_friendly),
                                    class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                                    text: filter_reset_button_text
                                }));
                            }
                            if (columnObj.externally_triggered_checkboxes_text &&
                                typeof columnObj.externally_triggered_checkboxes_function === 'function') {
                                (0, jquery_1.default)(filter_selector_string).append(this_1.makeElement('<button>', {
                                    type: 'button',
                                    id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number) + '-externally_triggered_checkboxes-button',
                                    onmousedown: this_1.stopPropagation,
                                    onclick: this_1.stopPropagation,
                                    class: "yadcf-filter-externally_triggered_checkboxes-button ".concat(columnObj.externally_triggered_checkboxes_button_style_class),
                                    text: columnObj.externally_triggered_checkboxes_text
                                }));
                                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "-externally_triggered_checkboxes-button")).on('click', columnObj.externally_triggered_checkboxes_function);
                            }
                            exclude_str = (0, jquery_1.default)();
                            if (columnObj.exclude === true) {
                                exclude_str = this_1.makeElement('<span>', {
                                    class: 'yadcf-exclude-wrapper',
                                    onmousedown: this_1.stopPropagation,
                                    onclick: this_1.stopPropagation
                                })
                                    .append(this_1.makeElement('<div>', {
                                    class: 'yadcf-label small',
                                    text: columnObj.exclude_label
                                }))
                                    .append(this_1.makeElement('<input>', {
                                    type: 'checkbox',
                                    title: columnObj.exclude_label,
                                    onclick: function (colNo, tableSel) {
                                        return function (event) {
                                            Yadcf.stopPropagation(event);
                                            Yadcf.doFilter('exclude', tableSel, colNo, filter_match_mode);
                                        };
                                    }(column_number, table_selector_jq_friendly)
                                }));
                            }
                            if (columnObj.checkbox_position_after) {
                                exclude_str.addClass('after');
                                (0, jquery_1.default)(filter_selector_string).append(exclude_str);
                            }
                            else {
                                (0, jquery_1.default)(filter_selector_string).prepend(exclude_str);
                            }
                            // Hide on load.
                            if (columnObj.externally_triggered_checkboxes_text &&
                                typeof columnObj.externally_triggered_checkboxes_function === 'function') {
                                var sel = (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number));
                                sel.find('.yadcf-exclude-wrapper').hide();
                            }
                        }
                        else {
                            filterActionFn = function (colNo, tableSel) {
                                return function (event) {
                                    Yadcf.doFilterCustomDateFunc(this, tableSel, colNo);
                                };
                            }(column_number, table_selector_jq_friendly);
                            if (columnObj.externally_triggered === true) {
                                filterActionFn = function () { };
                            }
                            (0, jquery_1.default)(filter_selector_string).append(this_1.makeElement('<select>', {
                                id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number),
                                class: "yadcf-filter ".concat(columnObj.style_class),
                                onchange: filterActionFn,
                                onkeydown: this_1.preventDefaultForEnter,
                                onmousedown: this_1.stopPropagation,
                                onclick: this_1.stopPropagation,
                                html: column_data
                            }));
                            if (filter_reset_button_text !== false) {
                                (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').after(this_1.makeElement('<button>', {
                                    type: 'button',
                                    onmousedown: this_1.stopPropagation,
                                    onclick: function (colNo, tableSel) {
                                        return function (event) {
                                            Yadcf.stopPropagation(event);
                                            Yadcf.doFilterCustomDateFunc('clear', tableSel, colNo);
                                            return false;
                                        };
                                    }(column_number, table_selector_jq_friendly),
                                    class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                                    text: filter_reset_button_text
                                }));
                            }
                            if (settingsDt.oFeatures.bStateSave === true &&
                                settingsDt.oLoadedState) {
                                if (settingsDt.oLoadedState.yadcfState &&
                                    settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly] &&
                                    settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number]) {
                                    tmpStr = settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from;
                                    if (tmpStr === '-1' || tmpStr === undefined) {
                                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(tmpStr);
                                    }
                                    else {
                                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(tmpStr).addClass('inuse');
                                    }
                                }
                            }
                            if (settingsDt.oFeatures.bServerSide !== true) {
                                this_1.addCustomFunctionFilterCapability(table_selector_jq_friendly, "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number), column_number);
                            }
                        }
                        if (settingsDt.aoPreSearchCols[column_position].sSearch !== '') {
                            tmpStr = settingsDt.aoPreSearchCols[column_position].sSearch;
                            tmpStr = this_1.yadcfParseMatchFilter(tmpStr, this_1.getOptions(oTable.selector)[column_number].filter_match_mode);
                            var match_mode = this_1.getOptions(oTable.selector)[column_number].filter_match_mode;
                            var null_str_1 = columnObj.select_null_option;
                            var excludeStrStart = '^((?!';
                            var excludeStrEnd = ').)*$';
                            switch (match_mode) {
                                case 'exact':
                                    null_str_1 = '^' + this_1.escapeRegExp(null_str_1) + '$';
                                    excludeStrStart = '((?!^';
                                    excludeStrEnd = '$).)*';
                                    break;
                                case 'startsWith':
                                    null_str_1 = '^' + this_1.escapeRegExp(null_str_1);
                                    excludeStrStart = '((?!^';
                                    excludeStrEnd = ').)*$';
                                    break;
                                default:
                                    break;
                            }
                            null_str_1 = '^((?!' + null_str_1 + ').)*$';
                            null_str_1 = this_1.yadcfParseMatchFilter(null_str_1, this_1.getOptions(oTable.selector)[column_number].filter_match_mode);
                            var exclude = false;
                            // Null with exclude selected.
                            if (null_str_1 === tmpStr) {
                                exclude = true;
                                tmpStr = columnObj.select_null_option;
                            }
                            else if (tmpStr.includes(excludeStrStart) && tmpStr.includes(excludeStrEnd)) {
                                exclude = true;
                                tmpStr = tmpStr.replace(excludeStrStart, '');
                                tmpStr = tmpStr.replace(excludeStrEnd, '');
                            }
                            var filter = (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number));
                            tmpStr = this_1.escapeRegExp(tmpStr);
                            var optionExists = filter.find("option[value=\"".concat(tmpStr, "\"]")).length === 1;
                            // Set the state preselected value only if the option exists in the select dropdown.
                            if (optionExists) {
                                filter.val(tmpStr).addClass('inuse');
                                if (exclude) {
                                    (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('.yadcf-exclude-wrapper').find(':checkbox').prop('checked', true);
                                    (0, jquery_1.default)(document).data("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val"), tmpStr);
                                    this_1.refreshSelectPlugin(columnObj, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)), tmpStr);
                                }
                                if (tmpStr === columnObj.select_null_option &&
                                    settingsDt.oFeatures.bServerSide === false) {
                                    oTable.fnFilter('', column_number);
                                    this_1.addNullFilterCapability(table_selector_jq_friendly, column_number, true);
                                    oTable.fnDraw();
                                    (0, jquery_1.default)(document).data("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val"), tmpStr);
                                    this_1.refreshSelectPlugin(columnObj, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)), tmpStr);
                                }
                            }
                        }
                        if (columnObj.select_type !== undefined) {
                            this_1.initializeSelectPlugin(columnObj.select_type, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)), columnObj.select_type_options);
                            if (columnObj.cumulative_filtering === true && columnObj.select_type === 'chosen') {
                                this_1.refreshSelectPlugin(columnObj, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)));
                            }
                        }
                    }
                    else if (columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'multi_select_custom_func') {
                        // Add a wrapper to hold both filter and reset button.
                        (0, jquery_1.default)(filter_selector_string).append(this_1.makeElement('<div>', {
                            id: "yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number),
                            class: 'yadcf-filter-wrapper'
                        }));
                        filter_selector_string += ' div.yadcf-filter-wrapper';
                        if (columnObj.filter_type === 'multi_select') {
                            filterActionFn = function (colNo, tableSel) {
                                return function (event) {
                                    Yadcf.doFilterMultiSelect(this, tableSel, colNo, filter_match_mode);
                                };
                            }(column_number, table_selector_jq_friendly);
                            if (columnObj.externally_triggered === true) {
                                filterActionFn = function () { };
                            }
                            (0, jquery_1.default)(filter_selector_string).append(this_1.makeElement('<select>', {
                                multiple: true,
                                'data-placeholder': filter_default_label,
                                id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number),
                                class: "yadcf-filter ".concat(columnObj.style_class),
                                onchange: filterActionFn,
                                onkeydown: this_1.preventDefaultForEnter,
                                onmousedown: this_1.stopPropagation,
                                onclick: this_1.stopPropagation,
                                html: column_data
                            }));
                            if (filter_reset_button_text !== false) {
                                (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').after(this_1.makeElement('<button>', {
                                    type: 'button',
                                    onmousedown: this_1.stopPropagation,
                                    onclick: function (colNo, tableSel) {
                                        return function (event) {
                                            Yadcf.stopPropagation(event);
                                            Yadcf.doFilter('clear', tableSel, colNo);
                                            return false;
                                        };
                                    }(column_number, table_selector_jq_friendly),
                                    class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                                    text: filter_reset_button_text
                                }));
                            }
                            if (settingsDt.aoPreSearchCols[column_position].sSearch !== '') {
                                tmpStr = settingsDt.aoPreSearchCols[column_position].sSearch;
                                tmpStr = this_1.yadcfParseMatchFilterMultiSelect(tmpStr, this_1.getOptions(oTable.selector)[column_number].filter_match_mode);
                                tmpStr = tmpStr.replace(/\\/g, '');
                                tmpStr = tmpStr.split('|');
                                (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(tmpStr);
                            }
                        }
                        else {
                            filterActionFn = function (colNo, tableSel) {
                                return function (event) {
                                    Yadcf.doFilterCustomDateFunc(this, tableSel, colNo);
                                };
                            }(column_number, table_selector_jq_friendly);
                            if (columnObj.externally_triggered === true) {
                                filterActionFn = function () { };
                            }
                            (0, jquery_1.default)(filter_selector_string).append(this_1.makeElement('<select>', {
                                multiple: true,
                                'data-placeholder': filter_default_label,
                                id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number),
                                class: "yadcf-filter ".concat(columnObj.style_class),
                                onchange: filterActionFn,
                                onkeydown: this_1.preventDefaultForEnter,
                                onmousedown: this_1.stopPropagation,
                                onclick: this_1.stopPropagation,
                                html: column_data
                            }));
                            if (filter_reset_button_text !== false) {
                                (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').after(this_1.makeElement('<button>', {
                                    type: 'button',
                                    onmousedown: this_1.stopPropagation,
                                    onclick: function (colNo, tableSel) {
                                        return function (event) {
                                            Yadcf.stopPropagation(event);
                                            Yadcf.doFilterCustomDateFunc('clear', tableSel, colNo);
                                            return false;
                                        };
                                    }(column_number, table_selector_jq_friendly),
                                    class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                                    text: filter_reset_button_text
                                }));
                            }
                            if (settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState) {
                                if (settingsDt.oLoadedState.yadcfState &&
                                    settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly] &&
                                    settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number]) {
                                    tmpStr = settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].from;
                                    if (tmpStr === '-1' || tmpStr === undefined) {
                                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(tmpStr);
                                    }
                                    else {
                                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(tmpStr).addClass('inuse');
                                    }
                                }
                            }
                            if (settingsDt.oFeatures.bServerSide !== true) {
                                this_1.addCustomFunctionFilterCapability(table_selector_jq_friendly, "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number), column_number);
                            }
                        }
                        if (columnObj.filter_container_selector === undefined && columnObj.select_type_options.width === undefined) {
                            columnObj.select_type_options = jquery_1.default.extend(columnObj.select_type_options, { width: (0, jquery_1.default)(filter_selector_string).closest('th').width() + 'px' });
                        }
                        if (columnObj.filter_container_selector !== undefined && columnObj.select_type_options.width === undefined) {
                            columnObj.select_type_options = jquery_1.default.extend(columnObj.select_type_options, { width: (0, jquery_1.default)(filter_selector_string).closest(columnObj.filter_container_selector).width() + 'px' });
                        }
                        if (columnObj.select_type !== undefined) {
                            this_1.initializeSelectPlugin(columnObj.select_type, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)), columnObj.select_type_options);
                            if (columnObj.cumulative_filtering === true && columnObj.select_type === 'chosen') {
                                this_1.refreshSelectPlugin(columnObj, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)));
                            }
                        }
                    }
                    else if (columnObj.filter_type === 'auto_complete') {
                        // Add a wrapper to hold both filter and reset button.
                        (0, jquery_1.default)(filter_selector_string).append(this_1.makeElement('<div>', {
                            id: "yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number),
                            class: 'yadcf-filter-wrapper'
                        }));
                        filter_selector_string += ' div.yadcf-filter-wrapper';
                        filterActionFn = function (tableSel) {
                            return function (event) {
                                Yadcf.autocompleteKeyUP(tableSel, event);
                            };
                        }(table_selector_jq_friendly);
                        if (columnObj.externally_triggered === true) {
                            filterActionFn = function () { };
                        }
                        (0, jquery_1.default)(filter_selector_string).append(this_1.makeElement('<input>', {
                            onkeydown: this_1.preventDefaultForEnter,
                            id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number),
                            class: 'yadcf-filter',
                            onmousedown: this_1.stopPropagation,
                            onclick: this_1.stopPropagation,
                            placeholder: filter_default_label,
                            filter_match_mode: filter_match_mode,
                            onkeyup: filterActionFn
                        }));
                        (0, jquery_1.default)(document).data("yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number), column_data);
                        if (filter_reset_button_text !== false) {
                            (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').after(this_1.makeElement('<button>', {
                                type: 'button',
                                onmousedown: Yadcf.stopPropagation,
                                onclick: function (colNo, tableSel) {
                                    return function (event) {
                                        Yadcf.stopPropagation(event);
                                        Yadcf.doFilterAutocomplete('clear', tableSel, colNo);
                                        return false;
                                    };
                                }(column_number, table_selector_jq_friendly),
                                class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                                text: filter_reset_button_text
                            }));
                        }
                    }
                    else if (columnObj.filter_type === 'text') {
                        // Add a wrapper to hold both filter and reset button.
                        (0, jquery_1.default)(filter_selector_string).append(this_1.makeElement('<div>', {
                            id: "yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number),
                            class: 'yadcf-filter-wrapper'
                        }));
                        filter_selector_string += ' div.yadcf-filter-wrapper';
                        filterActionFn = function (colNo, tableSel) {
                            /* IIFE closure to preserve column number. */
                            return function (event) {
                                Yadcf.textKeyUP(event, tableSel, colNo);
                            };
                        }(column_number, table_selector_jq_friendly);
                        if (columnObj.externally_triggered === true) {
                            filterActionFn = function () { };
                        }
                        exclude_str = (0, jquery_1.default)();
                        if (columnObj.exclude === true) {
                            if (columnObj.externally_triggered !== true) {
                                exclude_str = this_1.makeElement('<span>', {
                                    class: 'yadcf-exclude-wrapper',
                                    onmousedown: this_1.stopPropagation,
                                    onclick: this_1.stopPropagation
                                })
                                    .append(this_1.makeElement('<div>', {
                                    class: 'yadcf-label small',
                                    text: columnObj.exclude_label
                                }))
                                    .append(this_1.makeElement('<input>', {
                                    type: 'checkbox',
                                    title: columnObj.exclude_label,
                                    onclick: function (colNo, tableSel) {
                                        return function (event) {
                                            Yadcf.stopPropagation(event);
                                            Yadcf.textKeyUP(event, tableSel, colNo);
                                        };
                                    }(column_number, table_selector_jq_friendly)
                                }));
                            }
                            else {
                                exclude_str = this_1.makeElement('<span>', {
                                    class: 'yadcf-exclude-wrapper',
                                    onmousedown: this_1.stopPropagation,
                                    onclick: this_1.stopPropagation
                                })
                                    .append(this_1.makeElement('<div>', {
                                    class: 'yadcf-label small',
                                    text: columnObj.exclude_label
                                }))
                                    .append(this_1.makeElement('<input>', {
                                    type: 'checkbox',
                                    title: columnObj.exclude_label,
                                    onclick: this_1.stopPropagation
                                }));
                            }
                        }
                        regex_str = (0, jquery_1.default)();
                        if (columnObj.regex_check_box === true) {
                            if (columnObj.externally_triggered !== true) {
                                regex_str = this_1.makeElement('<span>', {
                                    class: 'yadcf-regex-wrapper',
                                    onmousedown: this_1.stopPropagation,
                                    onclick: this_1.stopPropagation
                                })
                                    .append(this_1.makeElement('<div>', {
                                    class: 'yadcf-label small',
                                    text: columnObj.regex_label
                                }))
                                    .append(this_1.makeElement('<input>', {
                                    type: 'checkbox',
                                    title: columnObj.regex_label,
                                    onclick: function (colNo, tableSel) {
                                        return function (event) {
                                            Yadcf.stopPropagation(event);
                                            Yadcf.textKeyUP(event, tableSel, colNo);
                                        };
                                    }(column_number, table_selector_jq_friendly)
                                }));
                            }
                            else {
                                regex_str = this_1.makeElement('<span>', {
                                    class: 'yadcf-regex-wrapper',
                                    onmousedown: this_1.stopPropagation,
                                    onclick: this_1.stopPropagation
                                })
                                    .append(this_1.makeElement('<div>', {
                                    class: 'yadcf-label small',
                                    text: columnObj.regex_label
                                }))
                                    .append(this_1.makeElement('<input>', {
                                    type: 'checkbox',
                                    title: columnObj.regex_label,
                                    onclick: Yadcf.stopPropagation
                                }));
                            }
                        }
                        null_str = (0, jquery_1.default)();
                        if (columnObj.null_check_box === true) {
                            null_str = this_1.makeElement('<span>', {
                                class: 'yadcf-null-wrapper',
                                onmousedown: this_1.stopPropagation,
                                onclick: this_1.stopPropagation
                            })
                                .append(this_1.makeElement('<div>', {
                                class: 'yadcf-label small',
                                text: columnObj.null_label
                            }))
                                .append(this_1.makeElement('<input>', {
                                type: 'checkbox',
                                title: columnObj.null_label,
                                onclick: function (colNo, tableSel) {
                                    return function (event) {
                                        Yadcf.stopPropagation(event);
                                        Yadcf.nullChecked(event, tableSel, colNo);
                                    };
                                }(column_number, table_selector_jq_friendly)
                            }));
                            if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                                this_1.addNullFilterCapability(table_selector_jq_friendly, column_number, false);
                            }
                        }
                        var append_input = this_1.makeElement('<input>', {
                            type: 'text',
                            onkeydown: this_1.preventDefaultForEnter,
                            id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number),
                            class: "yadcf-filter ".concat(columnObj.style_class),
                            onmousedown: this_1.stopPropagation,
                            onclick: this_1.stopPropagation,
                            placeholder: filter_default_label,
                            filter_match_mode: filter_match_mode,
                            onkeyup: filterActionFn
                        });
                        if (columnObj.checkbox_position_after) {
                            exclude_str.addClass('after');
                            regex_str.addClass('after');
                            null_str.addClass('after');
                            (0, jquery_1.default)(filter_selector_string).append(append_input, exclude_str, regex_str, null_str);
                        }
                        else {
                            (0, jquery_1.default)(filter_selector_string).append(exclude_str, regex_str, null_str, append_input);
                        }
                        if (externally_triggered_checkboxes_text && typeof externally_triggered_checkboxes_function === 'function') {
                            var sel = (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number));
                            // Hide on load.
                            sel.find('.yadcf-exclude-wrapper').hide();
                            sel.find('.yadcf-regex-wrapper').hide();
                            sel.find('.yadcf-null-wrapper').hide();
                            (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').after(this_1.makeElement('<button>', {
                                type: 'button',
                                id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "-externally_triggered_checkboxes-button"),
                                onmousedown: this_1.stopPropagation,
                                onclick: this_1.stopPropagation,
                                class: "yadcf-filter-externally_triggered_checkboxes-button ".concat(columnObj.externally_triggered_checkboxes_button_style_class),
                                text: externally_triggered_checkboxes_text
                            }));
                            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "-externally_triggered_checkboxes-button")).on('click', externally_triggered_checkboxes_function);
                        }
                        if (filter_reset_button_text !== false) {
                            (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').after(this_1.makeElement('<button>', {
                                type: 'button',
                                id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number) + '-reset',
                                onmousedown: this_1.stopPropagation,
                                onclick: function (colNo, tableSel) {
                                    /* IIFE closure to preserve column_number */
                                    return function (event) {
                                        Yadcf.stopPropagation(event);
                                        Yadcf.textKeyUP(event, tableSel, colNo, 'clear');
                                        return false;
                                    };
                                }(column_number, table_selector_jq_friendly),
                                class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                                text: filter_reset_button_text
                            }));
                        }
                        this_1.loadFromStateSaveTextFilter(oTable, settingsDt, columnObj, table_selector_jq_friendly, column_position, column_number);
                    }
                    else if (columnObj.filter_type === 'date' || columnObj.filter_type === 'date_custom_func') {
                        this_1.addDateFilter(filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, filter_default_label, date_format);
                    }
                    else if (columnObj.filter_type === 'range_number') {
                        this_1.addRangeNumberFilter(filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, filter_default_label, ignore_char);
                    }
                    else if (columnObj.filter_type === 'range_number_slider') {
                        this_1.addRangeNumberSliderFilter(filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, min_val, max_val, ignore_char);
                    }
                    else if (columnObj.filter_type === 'range_date') {
                        this_1.addRangeDateFilter(filter_selector_string, table_selector_jq_friendly, column_number, filter_reset_button_text, filter_default_label, date_format);
                    }
                }
                if ((0, jquery_1.default)(document).data("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val")) !== undefined &&
                    (0, jquery_1.default)(document).data("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val")) !== '-1') {
                    (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').val((0, jquery_1.default)(document).data("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val")));
                }
                if (columnObj.filter_type === 'auto_complete') {
                    var autocompleteObj = {
                        source: (0, jquery_1.default)(document).data("yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)),
                        select: this_1.autocompleteSelect
                    };
                    if (columnObj.externally_triggered === true) {
                        delete autocompleteObj.select;
                    }
                    if (columnObj.filter_plugin_options !== undefined) {
                        jquery_1.default.extend(autocompleteObj, columnObj.filter_plugin_options);
                    }
                    // @ts-expect-error
                    (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).autocomplete(autocompleteObj);
                    if (settingsDt.aoPreSearchCols[column_position].sSearch !== '') {
                        tmpStr = settingsDt.aoPreSearchCols[column_position].sSearch;
                        tmpStr = this_1.yadcfParseMatchFilter(tmpStr, this_1.getOptions(oTable.selector)[column_number].filter_match_mode);
                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(tmpStr).addClass('inuse');
                    }
                }
            }
        };
        var this_1 = this;
        for (columnObjKey in args) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
        if (this.exFilterColumnQueue.length > 0) {
            (this.exFilterColumnQueue.shift())();
        }
    };
    Yadcf.loadFromStateSaveTextFilter = function (oTable, settingsDt, columnObj, table_selector_jq_friendly, column_position, column_number) {
        if (columnObj.null_check_box === true) {
            if (settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState) {
                if (settingsDt.oLoadedState.yadcfState &&
                    settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly] &&
                    settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number]) {
                    if (settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].null_checked) {
                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).prop('disabled', true);
                        (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('.yadcf-null-wrapper').find(':checkbox').prop('checked', true);
                    }
                    if (settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].exclude_checked) {
                        (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('.yadcf-exclude-wrapper').find(':checkbox').prop('checked', true);
                    }
                    if (settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].null_checked) {
                        return;
                    }
                }
            }
        }
        if (settingsDt.aoPreSearchCols[column_position].sSearch !== '') {
            var tmpStr = settingsDt.aoPreSearchCols[column_position].sSearch;
            if (columnObj.exclude === true) {
                if (tmpStr.indexOf('^((?!') !== -1) {
                    (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('.yadcf-exclude-wrapper').find(':checkbox').prop('checked', true);
                    (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse-exclude');
                }
                if (tmpStr.indexOf(').)') !== -1) {
                    tmpStr = tmpStr.substring(5, tmpStr.indexOf(').)'));
                }
            }
            // Load saved regex_checkbox state.
            if (columnObj.regex_check_box === true) {
                if (settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState) {
                    if (settingsDt.oLoadedState.yadcfState &&
                        settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly] &&
                        settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number]) {
                        if (settingsDt.oLoadedState.yadcfState[table_selector_jq_friendly][column_number].regex_check_box) {
                            (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('.yadcf-regex-wrapper').find(':checkbox').prop('checked', true);
                            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse-regex');
                        }
                    }
                }
            }
            tmpStr = this.yadcfParseMatchFilter(tmpStr, this.getOptions(oTable.selector)[column_number].filter_match_mode);
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(tmpStr).addClass('inuse');
        }
    };
    Yadcf.rangeClear = function (table_selector_jq_friendly, event, column_number) {
        var oTable = this.oTables[table_selector_jq_friendly];
        var yadcfState, settingsDt, column_number_filter, currentFilterValues, columnObj, fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-date-").concat(column_number), toId = "", $fromInput, $toInput;
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        event = this.eventTargetFixUp(event);
        settingsDt = this.getSettingsObjFromTable(oTable);
        columnObj = this.getOptions(oTable.selector)[column_number];
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        this.resetExcludeRegexCheckboxes((0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)));
        this.clearStateSave(oTable, column_number, table_selector_jq_friendly);
        if (columnObj.null_check_box) {
            (0, jquery_1.default)('#' + fromId.replace('-from-date-', '-from-')).prop('disabled', false);
            (0, jquery_1.default)('#' + toId.replace('-to-date-', '-to-')).prop('disabled', false);
            if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                oTable.fnDraw();
            }
            else {
                oTable.fnFilter('', column_number_filter);
            }
        }
        currentFilterValues = this.exGetColumnFilterVal(oTable, column_number);
        if (currentFilterValues.from === '' && currentFilterValues.to === '') {
            return;
        }
        var buttonSelector = (0, jquery_1.default)(event.target).prop('nodeName') === 'BUTTON' ? (0, jquery_1.default)(event.target).parent() : (0, jquery_1.default)(event.target).parent().parent();
        if (columnObj.datepicker_type === 'daterangepicker') {
            (0, jquery_1.default)('#' + "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val('');
        }
        else {
            buttonSelector.find('.yadcf-filter-range').val('');
            if (buttonSelector.find('.yadcf-filter-range-number').length > 0) {
                (0, jquery_1.default)(buttonSelector.find('.yadcf-filter-range')[0]).trigger('focus');
            }
        }
        if (oTable.fnSettings().oFeatures.bServerSide !== true) {
            this.saveStateSave(oTable, column_number, table_selector_jq_friendly, '', '');
            oTable.fnDraw();
        }
        else {
            oTable.fnFilter('', column_number_filter);
        }
        if (!oTable.fnSettings().oLoadedState) {
            oTable.fnSettings().oLoadedState = {};
            oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
        }
        if (oTable.fnSettings().oFeatures.bStateSave === true) {
            if (oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number] = {
                    from: '',
                    to: ''
                };
            }
            else {
                yadcfState = {};
                yadcfState[table_selector_jq_friendly] = [];
                yadcfState[table_selector_jq_friendly][column_number] = {
                    from: '',
                    to: ''
                };
                oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
            }
            oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
        }
        this.resetIApiIndex();
        buttonSelector.parent().find('.yadcf-filter-range').removeClass('inuse inuse-exclude');
        if (columnObj.datepicker_type === 'bootstrap-datepicker') {
            $fromInput = (0, jquery_1.default)('#' + fromId);
            $toInput = (0, jquery_1.default)('#' + toId);
            $fromInput.datepicker('update');
            $toInput.datepicker('update');
        }
        else if (columnObj.datepicker_type === 'jquery-ui') {
            (0, jquery_1.default)('#' + fromId).datepicker('option', 'maxDate', null);
            (0, jquery_1.default)('#' + toId).datepicker('option', 'minDate', null);
        }
        return;
    };
    Yadcf.rangeNumberSliderClear = function (table_selector_jq_friendly, event) {
        var oTable = this.oTables[table_selector_jq_friendly];
        var min_val, max_val, currentFilterValues, column_number;
        event = this.eventTargetFixUp(event);
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        var buttonSelector = (0, jquery_1.default)(event.target).prop('nodeName') === 'BUTTON' ? (0, jquery_1.default)(event.target) : (0, jquery_1.default)(event.target).parent();
        column_number = parseInt(buttonSelector.prev().find('.yadcf-filter-range-number-slider').attr('id').replace("yadcf-filter-".concat(table_selector_jq_friendly, "-slider-"), ''), 10);
        min_val = +(0, jquery_1.default)(buttonSelector.parent().find('.yadcf-filter-range-number-slider-min-tip-hidden')).text();
        max_val = +(0, jquery_1.default)(buttonSelector.parent().find('.yadcf-filter-range-number-slider-max-tip-hidden')).text();
        currentFilterValues = this.exGetColumnFilterVal(oTable, column_number);
        if (+currentFilterValues.from === min_val && +currentFilterValues.to === max_val) {
            return;
        }
        buttonSelector.prev().find('.yadcf-filter-range-number-slider').slider('option', 'yadcf-reset', true);
        buttonSelector.prev().find('.yadcf-filter-range-number-slider').slider('option', 'values', [min_val, max_val]);
        (0, jquery_1.default)(buttonSelector.prev().find('.ui-slider-handle')[0]).attr('tabindex', -1).trigger('focus');
        (0, jquery_1.default)(buttonSelector.prev().find('.ui-slider-handle')[0]).removeClass('inuse');
        (0, jquery_1.default)(buttonSelector.prev().find('.ui-slider-handle')[1]).removeClass('inuse');
        buttonSelector.prev().find('.ui-slider-range').removeClass('inuse');
        oTable.fnDraw();
        this.resetIApiIndex();
        return;
    };
    Yadcf.dateKeyUP = function (table_selector_jq_friendly, date_format, event) {
        var oTable, date, dateId, column_number, columnObj;
        event = this.eventTargetFixUp(event);
        dateId = event.target.id;
        date = document.getElementById(dateId).value;
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        oTable = this.oTables[table_selector_jq_friendly];
        column_number = parseInt(dateId.replace('yadcf-filter-' + table_selector_jq_friendly + '-', ''), 10);
        columnObj = this.getOptions(oTable.selector)[column_number];
        try {
            if (columnObj.datepicker_type === 'jquery-ui') {
                if (date.length === (date_format.length + 2)) {
                    date = (date !== '') ? jquery_1.default.datepicker.parseDate(date_format, date) : date;
                }
            }
        }
        catch (err1) { }
        if (date instanceof Date || (0, moment_1.default)(date, columnObj.date_format).isValid()) {
            (0, jquery_1.default)('#' + dateId).addClass('inuse');
            if (columnObj.filter_type !== 'date_custom_func') {
                oTable.fnFilter(document.getElementById(dateId).value, column_number);
                this.resetIApiIndex();
            }
            else {
                this.doFilterCustomDateFunc({ value: date }, table_selector_jq_friendly, column_number);
            }
        }
        else if (date === '' || (0, trim_1.default)(event.target.value) === '') {
            (0, jquery_1.default)('#' + dateId).removeClass('inuse');
            (0, jquery_1.default)('#' + event.target.id).removeClass('inuse');
            oTable.fnFilter('', column_number);
            this.resetIApiIndex();
        }
    };
    Yadcf.rangeDateKeyUP = function (table_selector_jq_friendly, date_format, event) {
        var oTable, min, max, fromId, toId, column_number, columnObj, keyUp, settingsDt, column_number_filter, dpg, minTmp, maxTmp;
        event = this.eventTargetFixUp(event);
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        oTable = this.oTables[table_selector_jq_friendly];
        column_number = parseInt((0, jquery_1.default)(event.target).attr('id').replace('-from-date-', '').replace('-to-date-', '').replace("yadcf-filter-".concat(table_selector_jq_friendly), ''), 10);
        columnObj = this.getOptions(oTable.selector)[column_number];
        settingsDt = this.getSettingsObjFromTable(oTable);
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        if (columnObj.datepicker_type === 'bootstrap-datepicker') {
            // @ts-expect-error
            dpg = jquery_1.default.fn.datepicker.DPGlobal;
        }
        keyUp = function () {
            if (event.target.id.indexOf('-from-') !== -1) {
                fromId = event.target.id;
                toId = event.target.id.replace('-from-', '-to-');
            }
            else {
                toId = event.target.id;
                fromId = event.target.id.replace('-to-', '-from-');
            }
            min = document.getElementById(fromId).value;
            max = document.getElementById(toId).value;
            if (columnObj.datepicker_type === 'jquery-ui') {
                try {
                    if (min.length === (date_format.length + 2)) {
                        min = (min !== '') ? jquery_1.default.datepicker.parseDate(date_format, min) : min;
                    }
                }
                catch (err) { }
                try {
                    if (max.length === (date_format.length + 2)) {
                        max = (max !== '') ? jquery_1.default.datepicker.parseDate(date_format, max) : max;
                    }
                }
                catch (err) { }
            }
            else if (columnObj.datepicker_type === 'bootstrap-datetimepicker') {
                try {
                    min = (0, moment_1.default)(min, columnObj.date_format).toDate();
                    if (isNaN(min.getTime())) {
                        min = '';
                    }
                }
                catch (err) { }
                try {
                    max = (0, moment_1.default)(max, columnObj.date_format).toDate();
                    if (isNaN(max.getTime())) {
                        max = '';
                    }
                }
                catch (err) { }
            }
            else if (columnObj.datepicker_type === 'bootstrap-datepicker') {
                try {
                    min = dpg.parseDate(min, dpg.parseFormat(columnObj.date_format));
                    if (isNaN(min.getTime())) {
                        min = '';
                    }
                }
                catch (err) { }
                try {
                    max = dpg.parseDate(max, dpg.parseFormat(columnObj.date_format));
                    if (isNaN(max.getTime())) {
                        max = '';
                    }
                }
                catch (err) { }
            }
            if (((max instanceof Date) && (min instanceof Date) && (max >= min)) || !min || !max) {
                if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                    minTmp = document.getElementById(fromId).value;
                    maxTmp = document.getElementById(toId).value;
                    Yadcf.saveStateSave(oTable, column_number, table_selector_jq_friendly, !min ? '' : minTmp, !max ? '' : maxTmp);
                    oTable.fnDraw();
                }
                else {
                    oTable.fnFilter(document.getElementById(fromId).value + columnObj.custom_range_delimiter + document.getElementById(toId).value, column_number_filter);
                }
                if (min instanceof Date) {
                    (0, jquery_1.default)('#' + fromId).addClass('inuse');
                }
                else {
                    (0, jquery_1.default)('#' + fromId).removeClass('inuse');
                }
                if (max instanceof Date) {
                    (0, jquery_1.default)('#' + toId).addClass('inuse');
                }
                else {
                    (0, jquery_1.default)('#' + toId).removeClass('inuse');
                }
                if ((0, trim_1.default)(event.target.value) === '' && (0, jquery_1.default)(event.target).hasClass('inuse')) {
                    (0, jquery_1.default)('#' + event.target.id).removeClass('inuse');
                }
            }
            Yadcf.resetIApiIndex();
        };
        if (columnObj.filter_delay === undefined) {
            keyUp();
        }
        else {
            this.yadcfDelay(function () {
                keyUp();
            }, columnObj.filter_delay);
        }
    };
    Yadcf.rangeNumberKeyUP = function (table_selector_jq_friendly, event) {
        var oTable = this.oTables[table_selector_jq_friendly];
        var min, max, fromId, toId, yadcfState, column_number, columnObj, keyUp, settingsDt, column_number_filter, exclude_checked = false, null_checked = false, checkbox;
        event = this.eventTargetFixUp(event);
        checkbox = (0, jquery_1.default)(event.target).attr('type') === 'checkbox';
        var target = checkbox ? (0, jquery_1.default)(event.target).parent().parent().find('.yadcf-filter-range-number').first() : (0, jquery_1.default)(event.target);
        jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
        column_number = parseInt(target.attr('id').replace('-from-', '').replace('-to-', '').replace('yadcf-filter-' + table_selector_jq_friendly, ''), 10);
        columnObj = this.getOptions(oTable.selector)[column_number];
        settingsDt = this.getSettingsObjFromTable(oTable);
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        if (columnObj.exclude) {
            exclude_checked = (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('.yadcf-exclude-wrapper :checkbox').prop('checked');
        }
        // State save when exclude was fired last.
        if (columnObj.null_check_box) {
            null_checked = (0, jquery_1.default)("#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('.yadcf-null-wrapper :checkbox').prop('checked');
        }
        keyUp = function () {
            fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-").concat(column_number);
            toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-to-").concat(column_number);
            min = document.getElementById(fromId).value;
            max = document.getElementById(toId).value;
            min = (min !== '') ? (+min) : min;
            max = (max !== '') ? (+max) : max;
            if (null_checked) {
                if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                    oTable.fnDraw();
                }
                else {
                    var excludeString = columnObj.not_null_api_call_value ? columnObj.not_null_api_call_value : '!^@';
                    var nullString = columnObj.null_api_call_value ? columnObj.null_api_call_value : 'null';
                    var requestString = exclude_checked ? excludeString : nullString;
                    oTable.fnFilter(requestString, column_number_filter);
                }
                return;
            }
            if ((!isNaN(max) && !isNaN(min) && (max >= min)) || min === '' || max === '') {
                if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                    oTable.fnDraw();
                }
                else {
                    var exclude_delimeter = exclude_checked ? '!' : '';
                    oTable.fnFilter(exclude_delimeter + min + columnObj.custom_range_delimiter + max, column_number_filter);
                }
                (0, jquery_1.default)('#' + fromId).removeClass('inuse inuse-exclude');
                (0, jquery_1.default)('#' + toId).removeClass('inuse inuse-exclude');
                var inuse_class = exclude_checked ? 'inuse inuse-exclude' : 'inuse';
                if (document.getElementById(fromId).value !== '') {
                    (0, jquery_1.default)('#' + fromId).addClass(inuse_class);
                }
                if (document.getElementById(toId).value !== '') {
                    (0, jquery_1.default)('#' + toId).addClass(inuse_class);
                }
                if (!oTable.fnSettings().oLoadedState) {
                    oTable.fnSettings().oLoadedState = {};
                    oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
                }
                if (oTable.fnSettings().oFeatures.bStateSave === true) {
                    if (oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                        oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number] = {
                            from: min,
                            to: max,
                            exclude_checked: exclude_checked,
                            null_checked: null_checked
                        };
                    }
                    else {
                        yadcfState = {};
                        yadcfState[table_selector_jq_friendly] = [];
                        yadcfState[table_selector_jq_friendly][column_number] = {
                            from: min,
                            to: max
                        };
                        oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
                    }
                    oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
                }
            }
            this.resetIApiIndex();
        };
        if (columnObj.filter_delay === undefined) {
            keyUp();
        }
        else {
            this.yadcfDelay(function () {
                keyUp();
            }, columnObj.filter_delay);
        }
    };
    Yadcf.doFilterMultiTablesMultiSelect = function (tablesSelectors, event, column_number_str, clear) {
        var columnsObj = this.getOptions("".concat(tablesSelectors, "_").concat(column_number_str))[column_number_str];
        var regex = false, smart = true, caseInsen = true, tablesAsOne, tablesArray = this.oTables[tablesSelectors], selected_values = (0, jquery_1.default)(event.target).val(), i;
        event = this.eventTargetFixUp(event);
        tablesAsOne = new jquery_1.default.fn.dataTable.Api(tablesArray);
        if (clear !== undefined || !selected_values || selected_values.length === 0) {
            if (clear !== undefined) {
                (0, jquery_1.default)(event.target).parent().find('select').val('-1').trigger('focus');
                (0, jquery_1.default)(event.target).parent().find('selectn ').removeClass('inuse');
            }
            if (columnsObj.column_number instanceof Array) {
                tablesAsOne.columns(columnsObj.column_number).search('').draw();
            }
            else {
                tablesAsOne.search('').draw();
            }
            this.refreshSelectPlugin(columnsObj, (0, jquery_1.default)('#' + columnsObj.filter_container_id + ' select'), '-1');
            return;
        }
        (0, jquery_1.default)(event.target).addClass('inuse');
        regex = true;
        smart = false;
        caseInsen = columnsObj.case_insensitive;
        if (selected_values !== null && Array.isArray(selected_values)) {
            for (i = selected_values.length - 1; i >= 0; i--) {
                if (selected_values[i] === '-1') {
                    selected_values.splice(i, 1);
                    break;
                }
            }
            if (selected_values.length !== 0) {
                selected_values = selected_values.join('narutouzomaki');
                selected_values = selected_values.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
                selected_values = selected_values.split('narutouzomaki').join('|');
            }
        }
        if (columnsObj.filter_match_mode === 'exact') {
            selected_values = '^' + selected_values + '$';
        }
        else if (columnsObj.filter_match_mode === 'startsWith') {
            selected_values = '^' + selected_values;
        }
        if (columnsObj.column_number instanceof Array) {
            tablesAsOne.columns(columnsObj.column_number).search(selected_values, regex, smart, caseInsen).draw();
        }
        else {
            tablesAsOne.search(selected_values, regex, smart, caseInsen).draw();
        }
    };
    Yadcf.doFilterMultiTables = function (tablesSelectors, event, column_number_str, clear) {
        var columnsObj = this.getOptions(tablesSelectors + '_' + column_number_str)[column_number_str];
        var regex = false, smart = true, caseInsen = true, tablesArray = this.oTables[tablesSelectors], searchVal, tablesAsOne;
        event = this.eventTargetFixUp(event);
        tablesAsOne = new jquery_1.default.fn.dataTable.Api(tablesArray);
        if (clear !== undefined || event.target.value === '-1') {
            if (clear !== undefined) {
                (0, jquery_1.default)(event.target).parent().find('select').val('-1').trigger('focus');
                (0, jquery_1.default)(event.target).parent().find('select').removeClass('inuse');
            }
            if (columnsObj.column_number instanceof Array) {
                tablesAsOne.columns(columnsObj.column_number).search('').draw();
            }
            else {
                tablesAsOne.search('').draw();
            }
            this.refreshSelectPlugin(columnsObj, (0, jquery_1.default)('#' + columnsObj.filter_container_id + ' select'), '-1');
            return;
        }
        (0, jquery_1.default)(event.target).addClass('inuse');
        searchVal = event.target.value;
        smart = false;
        caseInsen = columnsObj.case_insensitive;
        if (columnsObj.filter_match_mode === 'contains') {
            regex = false;
        }
        else if (columnsObj.filter_match_mode === 'exact') {
            regex = true;
            searchVal = '^' + searchVal + '$';
        }
        else if (columnsObj.filter_match_mode === 'startsWith') {
            regex = true;
            searchVal = '^' + searchVal;
        }
        if (columnsObj.column_number instanceof Array) {
            tablesAsOne.columns(columnsObj.column_number).search(searchVal, regex, smart, caseInsen).draw();
        }
        else {
            tablesAsOne.search(searchVal, regex, smart, caseInsen).draw();
        }
    };
    Yadcf.textKeyUpMultiTables = function (tablesSelectors, event, column_number_str, clear) {
        var caseInsen = true, smart = true, regex = false, columnsObj = this.getOptions("".concat(tablesSelectors, "_").concat(column_number_str))[column_number_str], tablesArray = this.oTables[tablesSelectors], keyUp, serachVal, tablesAsOne;
        event = this.eventTargetFixUp(event);
        tablesAsOne = new jquery_1.default.fn.dataTable.Api(tablesArray);
        keyUp = function (tablesAsOne, event, clear) {
            if (clear !== undefined || event.target.value === '') {
                if (clear !== undefined) {
                    (0, jquery_1.default)(event.target).prev().val('').trigger('focus');
                    (0, jquery_1.default)(event.target).prev().removeClass('inuse');
                }
                else {
                    (0, jquery_1.default)(event.target).val('').trigger('focus');
                    (0, jquery_1.default)(event.target).removeClass('inuse');
                }
                if (columnsObj.column_number instanceof Array) {
                    tablesAsOne.columns(columnsObj.column_number).search('').draw();
                }
                else {
                    tablesAsOne.search('').draw();
                }
                return;
            }
            (0, jquery_1.default)(event.target).addClass('inuse');
            serachVal = event.target.value;
            smart = false;
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
            if (columnsObj.column_number instanceof Array) {
                tablesAsOne.columns(columnsObj.column_number).search(serachVal, regex, smart, caseInsen).draw();
            }
            else {
                tablesAsOne.search(serachVal, regex, smart, caseInsen).draw();
            }
        };
        if (columnsObj.filter_delay === undefined) {
            keyUp(tablesAsOne, event, clear);
        }
        else {
            this.yadcfDelay(function () {
                keyUp(tablesAsOne, event, clear);
            }, columnsObj.filter_delay);
        }
    };
    Yadcf.textKeyUP = function (ev, table_selector_jq_friendly, column_number, clear) {
        var oTable = this.oTables[table_selector_jq_friendly], settingsDt = this.getSettingsObjFromTable(oTable);
        var null_checked = false, keyCodes = [37, 38, 39, 40, 17], keyUp, columnObj, exclude, column_number_filter, regex_check_box;
        if (keyCodes.indexOf(ev.keyCode) !== -1 || this.ctrlPressed) {
            return;
        }
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        columnObj = this.getOptions(oTable.selector)[column_number];
        keyUp = function (table_selector_jq_friendly, column_number, clear) {
            var fixedPrefix = '';
            if (settingsDt.fixedHeader !== undefined && (0, jquery_1.default)('.fixedHeader-floating').is(':visible')) {
                fixedPrefix = '.fixedHeader-floating ';
            }
            if (columnObj.filters_position === 'tfoot' && settingsDt.nScrollFoot) {
                fixedPrefix = '.' + settingsDt.nScrollFoot.className + ' ';
            }
            jquery_1.default.extend(jquery_1.default.fn, { dataTable: { ext: { iApiIndex: Yadcf.oTablesIndex[table_selector_jq_friendly] } } });
            // Check checkboxes.
            if (columnObj.null_check_box === true) {
                null_checked = (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).closest('.yadcf-filter-wrapper').find('.yadcf-null-wrapper :checkbox').prop('checked');
            }
            if (columnObj.exclude === true) {
                exclude = (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).closest('.yadcf-filter-wrapper').find('.yadcf-exclude-wrapper :checkbox').prop('checked');
            }
            if (columnObj.regex_check_box === true) {
                regex_check_box = (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).closest('.yadcf-filter-wrapper').find('.yadcf-regex-wrapper :checkbox').prop('checked');
            }
            if (clear === 'clear' || (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val() === '') {
                if (clear === 'clear') {
                    // Uncheck checkboxes on reset button pressed.
                    Yadcf.resetExcludeRegexCheckboxes((0, jquery_1.default)(fixedPrefix + "#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)));
                    Yadcf.clearStateSave(oTable, column_number, table_selector_jq_friendly);
                    (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).prop('disabled', false);
                    if (columnObj.null_check_box) {
                        if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                            oTable.fnDraw();
                        }
                        else {
                            oTable.fnFilter('', column_number_filter);
                        }
                    }
                    if (Yadcf.exGetColumnFilterVal(oTable, column_number) === '') {
                        return;
                    }
                }
                if (null_checked && columnObj.exclude) {
                    if (oTable.fnSettings().oFeatures.bServerSide === true) {
                        if (exclude) {
                            columnObj.not_null_api_call_value = columnObj.not_null_api_call_value ? columnObj.not_null_api_call_value : '!^@';
                            oTable.fnFilter(columnObj.not_null_api_call_value, column_number_filter);
                        }
                        else {
                            columnObj.null_api_call_value = columnObj.null_api_call_value ? columnObj.null_api_call_value : 'null';
                            oTable.fnFilter(columnObj.null_api_call_value, column_number_filter);
                        }
                    }
                    else {
                        oTable.fnDraw();
                    }
                    Yadcf.saveTextKeyUpState(oTable, table_selector_jq_friendly, column_number, regex_check_box, null_checked, exclude);
                    return;
                }
                (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val('').trigger('focus');
                (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse inuse-exclude inuse-regex');
                oTable.fnFilter('', column_number_filter);
                this.resetIApiIndex();
                return;
            }
            // Delete class also on regex or exclude checkbox uncheck.
            (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse-exclude inuse-regex');
            var inuseClass = 'inuse';
            inuseClass = exclude ? inuseClass + ' inuse-exclude' : inuseClass;
            inuseClass = regex_check_box ? inuseClass + ' inuse-regex' : inuseClass;
            (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass(inuseClass);
            Yadcf.yadcfMatchFilter(oTable, (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(), regex_check_box ? 'regex' : columnObj.filter_match_mode, column_number_filter, exclude, column_number);
            // save regex_checkbox state
            Yadcf.saveTextKeyUpState(oTable, table_selector_jq_friendly, column_number, regex_check_box, null_checked, exclude);
            Yadcf.resetIApiIndex();
        };
        if (columnObj.filter_delay === undefined) {
            keyUp(table_selector_jq_friendly, column_number, clear);
        }
        else {
            this.yadcfDelay(function () {
                keyUp(table_selector_jq_friendly, column_number, clear);
            }, columnObj.filter_delay);
        }
    };
    Yadcf.saveTextKeyUpState = function (oTable, table_selector_jq_friendly, column_number, regex_check_box, null_checked, exclude) {
        var yadcfState;
        if (oTable.fnSettings().oFeatures.bStateSave === true &&
            oTable.fnSettings().oLoadedState &&
            oTable.fnSettings().oLoadedState.yadcfState) {
            if (oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number] = {
                    regex_check_box: regex_check_box,
                    null_checked: null_checked,
                    exclude_checked: exclude
                };
            }
            else {
                yadcfState = {};
                yadcfState[table_selector_jq_friendly] = [];
                yadcfState[table_selector_jq_friendly][column_number] = {
                    regex_check_box: regex_check_box,
                    exclude_checked: exclude,
                    null_checked: null_checked
                };
                oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
            }
            oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
        }
    };
    Yadcf.nullChecked = function (ev, table_selector_jq_friendly, column_number) {
        var oTable = this.oTables[table_selector_jq_friendly];
        var settingsDt = this.getSettingsObjFromTable(oTable), exclude_checked = false, column_number_filter, click, columnObj, yadcfState, null_checked;
        column_number_filter = this.calcColumnNumberFilter(settingsDt, column_number, table_selector_jq_friendly);
        columnObj = this.getOptions(oTable.selector)[column_number];
        var fixedPrefix = '';
        if (settingsDt.fixedHeader !== undefined && (0, jquery_1.default)('.fixedHeader-floating').is(':visible')) {
            fixedPrefix = '.fixedHeader-floating ';
        }
        if (columnObj.filters_position === 'tfoot' && settingsDt.nScrollFoot) {
            fixedPrefix = '.' + settingsDt.nScrollFoot.className + ' ';
        }
        null_checked = (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('.yadcf-null-wrapper :checkbox').prop('checked');
        if (columnObj.exclude) {
            exclude_checked = (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number)).find('.yadcf-exclude-wrapper :checkbox').prop('checked');
        }
        click = function (table_selector_jq_friendly, column_number) {
            // Remove input data and inuse classes.
            var inner = columnObj.filter_type === 'range_number' ? 'wrapper-inner-' : '';
            var inner_input = columnObj.filter_type === 'range_number' ? ' :input' : '';
            var input = (0, jquery_1.default)('#yadcf-filter-' + inner + table_selector_jq_friendly + '-' + column_number + inner_input);
            input.removeClass('inuse inuse-exclude inuse-regex');
            if (columnObj.filter_type === 'text') {
                (0, jquery_1.default)(fixedPrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val('').trigger('focus');
                if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                    oTable.fnFilter('', column_number_filter);
                }
            }
            if (columnObj.filter_type === 'range_number') {
                input.val('');
                if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                    oTable.fnDraw();
                }
            }
            // Disable inputs.
            if (!null_checked) {
                input.prop('disabled', false);
            }
            else {
                input.prop('disabled', true);
            }
            // Filter by null.
            if (oTable.fnSettings().oFeatures.bServerSide !== true) {
                oTable.fnDraw();
            }
            else {
                if (null_checked) {
                    if (!exclude_checked) {
                        columnObj.null_api_call_value = columnObj.null_api_call_value ? columnObj.null_api_call_value : 'null';
                        oTable.fnFilter(columnObj.null_api_call_value, column_number_filter);
                    }
                    else {
                        columnObj.not_null_api_call_value = columnObj.not_null_api_call_value ? columnObj.not_null_api_call_value : '!^@';
                        oTable.fnFilter(columnObj.not_null_api_call_value, column_number_filter);
                    }
                }
                else {
                    oTable.fnFilter('', column_number_filter);
                }
            }
            // Save `regex_checkbox` state.
            if (oTable.fnSettings().oFeatures.bStateSave === true) {
                if (oTable.fnSettings().oLoadedState) {
                    if (oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                        oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number] = {
                            null_checked: null_checked,
                            exclude_checked: exclude_checked
                        };
                    }
                    else {
                        yadcfState = {};
                        yadcfState[table_selector_jq_friendly] = [];
                        yadcfState[table_selector_jq_friendly][column_number] = {
                            null_checked: null_checked,
                            exclude_checked: exclude_checked
                        };
                        oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
                    }
                }
                oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
            }
            Yadcf.resetIApiIndex();
        };
        if (columnObj.filter_delay === undefined) {
            click(table_selector_jq_friendly, column_number);
        }
        else {
            this.yadcfDelay(function () {
                click(table_selector_jq_friendly, column_number);
            }, columnObj.filter_delay);
        }
    };
    Yadcf.autocompleteKeyUP = function (table_selector_jq_friendly, event) {
        var keyCodes = [37, 38, 39, 40];
        var oTable, column_number;
        event = this.eventTargetFixUp(event);
        if (keyCodes.indexOf(event.keyCode) !== -1) {
            return;
        }
        if (event.target.value === '' && event.keyCode === 8 && (0, jquery_1.default)(event.target).hasClass('inuse')) {
            jquery_1.default.fn.dataTable.ext.iApiIndex = this.oTablesIndex[table_selector_jq_friendly];
            oTable = this.oTables[table_selector_jq_friendly];
            column_number = parseInt((0, jquery_1.default)(event.target).attr('id').replace('yadcf-filter-' + table_selector_jq_friendly + '-', ''), 10);
            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse');
            (0, jquery_1.default)(document).removeData("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val"));
            oTable.fnFilter('', column_number);
            this.resetIApiIndex();
        }
    };
    Yadcf.isDOMSource = function (tableVar) {
        var settingsDt;
        settingsDt = this.getSettingsObjFromTable(tableVar);
        if (!settingsDt.sAjaxSource && !settingsDt.ajax && settingsDt.oFeatures.bServerSide !== true) {
            return true;
        }
        return false;
    };
    Yadcf.scrollXYHandler = function (oTable, table_selector) {
        var $tmpSelector, filters_position = (0, jquery_1.default)(document).data("".concat(table_selector, "_filters_position")), table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2(oTable);
        if (filters_position === 'thead') {
            filters_position = '.dataTables_scrollHead';
        }
        else {
            filters_position = '.dataTables_scrollFoot';
        }
        if (oTable.fnSettings().oScroll.sX !== '' || oTable.fnSettings().oScroll.sY !== '') {
            $tmpSelector = (0, jquery_1.default)(table_selector).closest('.dataTables_scroll').find(filters_position + ' table');
            $tmpSelector.addClass('yadcf-datatables-table-' + table_selector_jq_friendly);
        }
    };
    Yadcf.firstFromObject = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return key;
            }
        }
    };
    Yadcf.initAndBindTable = function (oTable, table_selector, index, pTableDT) {
        var table_selector_jq_friendly = this.generateTableSelectorJQFriendly2(oTable);
        var table_selector_tmp;
        this.oTables[table_selector_jq_friendly] = oTable;
        this.tablesDT[table_selector_jq_friendly] = pTableDT;
        this.oTablesIndex[table_selector_jq_friendly] = index;
        this.scrollXYHandler(oTable, table_selector);
        if (this.isDOMSource(oTable)) {
            table_selector_tmp = table_selector;
            if (table_selector.indexOf(':eq') !== -1) {
                table_selector_tmp = table_selector.substring(0, table_selector.lastIndexOf(':eq'));
            }
            this.appendFilters(oTable, this.getOptions(table_selector_tmp), table_selector);
            if (this.getOptions(table_selector_tmp)[this.firstFromObject(this.getOptions(table_selector_tmp))].cumulative_filtering === true) {
                // When filters should be populated only from visible rows (non filtered).
                (0, jquery_1.default)(document).off('search.dt', oTable.selector).on('search.dt', oTable.selector, function (e, settings, json) {
                    var table_selector_tmp = oTable.selector;
                    if (table_selector.indexOf(':eq') !== -1) {
                        table_selector_tmp = table_selector.substring(0, table_selector.lastIndexOf(':eq'));
                    }
                    Yadcf.appendFilters(oTable, Yadcf.getOptions(table_selector_tmp), oTable.selector, settings);
                });
            }
        }
        else {
            this.appendFilters(oTable, this.getOptions(table_selector), table_selector);
            if (this.yadcfVersionCheck('1.10')) {
                (0, jquery_1.default)(document).off('xhr.dt', oTable.selector).on('xhr.dt', oTable.selector, function (e, settings, json) {
                    var col_num, column_number_filter, table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2(oTable);
                    if (!json) {
                        console.log('datatables `xhr.dt` event came back with null as data (nothing for yadcf to do with it).');
                        return;
                    }
                    if (settings.oSavedState !== null) {
                        Yadcf.initColReorder2(settings, table_selector_jq_friendly);
                    }
                    for (col_num in Yadcf.getOptions(settings.oInstance.selector)) {
                        if (Yadcf.getOptions(settings.oInstance.selector).hasOwnProperty(col_num)) {
                            if (json['yadcf_data_' + col_num] !== undefined) {
                                column_number_filter = col_num;
                                if (settings.oSavedState !== null && Yadcf.plugins[table_selector_jq_friendly] !== undefined) {
                                    column_number_filter = Yadcf.plugins[table_selector_jq_friendly].ColReorder[col_num];
                                }
                                Yadcf.getOptions(settings.oInstance.selector)[col_num].data = json['yadcf_data_' + column_number_filter];
                            }
                        }
                    }
                    if (Yadcf.dTXhrComplete !== undefined) {
                        Yadcf.yadcfDelay(function () {
                            Yadcf.dTXhrComplete();
                            Yadcf.dTXhrComplete = undefined;
                        }, 100);
                    }
                });
            }
        }
        // Events that affects both DOM and Ajax.
        if (this.yadcfVersionCheck('1.10')) {
            (0, jquery_1.default)(document).off('stateLoaded.dt', oTable.selector).on('stateLoaded.dt', oTable.selector, function (event, settings) {
                var args = Yadcf.getOptions(settings.oInstance.selector);
                var columnObjKey;
                for (columnObjKey in args) {
                    if (args.hasOwnProperty(columnObjKey)) {
                        var columnObj = args[columnObjKey];
                        var column_number = columnObj.column_number;
                        column_number = +column_number;
                        var column_position = column_number;
                        var table_selector_jq_friendly_1 = Yadcf.generateTableSelectorJQFriendly2(oTable);
                        Yadcf.loadFromStateSaveTextFilter(oTable, settings, columnObj, table_selector_jq_friendly_1, column_position, column_number);
                    }
                }
            });
            (0, jquery_1.default)(document).off('draw.dt', oTable.selector).on('draw.dt', oTable.selector, function (event, settings) {
                Yadcf.appendFilters(oTable, Yadcf.getOptions(settings.oInstance.selector), settings.oInstance.selector, settings);
            });
            (0, jquery_1.default)(document).off('column-visibility.dt', oTable.selector).on('column-visibility.dt', oTable.selector, function (e, settings, col_num, state) {
                var obj = {}, columnsObj = Yadcf.getOptions(settings.oInstance.selector);
                // @ts-expect-error
                if (state === true && settings._oFixedColumns === undefined) {
                    if (Yadcf.plugins[table_selector_jq_friendly] !== undefined &&
                        Yadcf.plugins[table_selector_jq_friendly].ColReorder !== undefined) {
                        col_num = Yadcf.plugins[table_selector_jq_friendly].ColReorder[col_num];
                    }
                    else if (settings.oSavedState && settings.oSavedState.ColReorder !== undefined) {
                        col_num = settings.oSavedState.ColReorder[col_num];
                    }
                    obj[col_num] = Yadcf.getOptions(settings.oInstance.selector)[col_num];
                    if (obj[col_num] !== undefined) {
                        obj[col_num].column_number = col_num;
                        if (obj[col_num] !== undefined) {
                            Yadcf.appendFilters(Yadcf.oTables[Yadcf.generateTableSelectorJQFriendly2(settings)], obj, settings.oInstance.selector, settings);
                        }
                    }
                }
                // @ts-expect-error
                else if (settings._oFixedColumns !== undefined) {
                    Yadcf.appendFilters(Yadcf.oTables[Yadcf.generateTableSelectorJQFriendly2(settings)], columnsObj, settings.oInstance.selector, settings);
                }
            });
            (0, jquery_1.default)(document).off('column-reorder.dt', oTable.selector).on('column-reorder.dt', oTable.selector, function (e, settings, json) {
                var table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2(oTable);
                Yadcf.initColReorderFromEvent(table_selector_jq_friendly);
            });
            (0, jquery_1.default)(document).off('destroy.dt', oTable.selector).on('destroy.dt', oTable.selector, function (event, ui) {
                Yadcf.removeFilters(oTable);
                Yadcf.removeFilters(ui.oInstance);
            });
        }
        else {
            (0, jquery_1.default)(document).off('draw', oTable.selector).on('draw', oTable.selector, function (event, settings) {
                Yadcf.appendFilters(oTable, Yadcf.getOptions(settings.oInstance.selector), settings.oInstance.selector, settings);
            });
            (0, jquery_1.default)(document).off('destroy', oTable.selector).on('destroy', oTable.selector, function (event, ui) {
                Yadcf.removeFilters(oTable);
                Yadcf.removeFilters(ui.oInstance.selector);
            });
        }
        if (oTable.fnSettings().oFeatures.bStateSave === true) {
            if (this.yadcfVersionCheck('1.10')) {
                (0, jquery_1.default)(oTable.selector).off('stateSaveParams.dt').on('stateSaveParams.dt', function (e, settings, data) {
                    if (settings.oLoadedState && settings.oLoadedState.yadcfState !== undefined) {
                        data.yadcfState = settings.oLoadedState.yadcfState;
                    }
                    else {
                        data.naruto = 'kurama';
                    }
                });
            }
            else {
                (0, jquery_1.default)(oTable.selector).off('stateSaveParams').on('stateSaveParams', function (e, settings, data) {
                    if (settings.oLoadedState && settings.oLoadedState.yadcfState !== undefined) {
                        data.yadcfState = settings.oLoadedState.yadcfState;
                    }
                    else {
                        data.naruto = 'kurama';
                    }
                });
            }
            // When using DOM source.
            if (this.isDOMSource(oTable)) {
                //we need to make sure that the yadcf state will be saved after page reload
                oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
                //redraw the table in order to apply the filters
                oTable.fnDraw(false);
            }
        }
    };
    Yadcf.extendJQuery = function () {
        jquery_1.default.extend(jquery_1.default.fn, {
            yadcf: function (options_arg, params) {
                var tableSelector = '#' + this.fnSettings().sTableId;
                var i = 0, tmpParams, selector;
                // In case that instance.selector will be undefined (jQuery 3).
                if (this.selector === undefined) {
                    this.selector = tableSelector;
                }
                if (params === undefined) {
                    params = {};
                }
                if (typeof params === 'string') {
                    tmpParams = params;
                    params = {};
                    params.filters_position = tmpParams;
                }
                if (params.filters_position === undefined || params.filters_position === 'header') {
                    params.filters_position = 'thead';
                }
                else {
                    params.filters_position = 'tfoot';
                }
                (0, jquery_1.default)(document).data("".concat(this.selector, "_filters_position"), params.filters_position);
                if ((0, jquery_1.default)(this.selector).length === 1) {
                    Yadcf.setOptions(this.selector, options_arg, params);
                    Yadcf.initAndBindTable(this, this.selector, 0);
                }
                else {
                    for (i; i < (0, jquery_1.default)(this.selector).length; i++) {
                        jquery_1.default.fn.dataTable.ext.iApiIndex = i;
                        selector = "".concat(this.selector, ":eq(").concat(i, ")");
                        Yadcf.setOptions(this.selector, options_arg, params);
                        Yadcf.initAndBindTable(this, selector, i);
                    }
                    jquery_1.default.fn.dataTable.ext.iApiIndex = 0;
                }
                if (params.onInitComplete !== undefined) {
                    params.onInitComplete();
                }
                return this;
            }
        });
    };
    Yadcf.init = function (oTable, options_arg, params) {
        var instance = oTable.fnSettings()[0].oInstance, i = 0, tableSelector = '#' + oTable.table().node().id, selector, tmpParams;
        this.extendJQuery();
        // In case that instance.selector will be undefined (jQuery 3).
        if (!instance.selector) {
            instance.selector = tableSelector;
        }
        if (params === undefined) {
            params = {};
        }
        if (typeof params === 'string') {
            tmpParams = params;
            params = {};
            params.filters_position = tmpParams;
        }
        if (params.filters_position === undefined || params.filters_position === 'header') {
            params.filters_position = 'thead';
        }
        else {
            params.filters_position = 'tfoot';
        }
        (0, jquery_1.default)(document).data(instance.selector + '_filters_position', params.filters_position);
        if ((0, jquery_1.default)(instance.selector).length === 1) {
            this.setOptions(instance.selector, options_arg, params, oTable);
            this.initAndBindTable(instance, instance.selector, 0, oTable);
        }
        else {
            for (i; i < (0, jquery_1.default)(instance.selector).length; i++) {
                jquery_1.default.fn.dataTable.ext.iApiIndex = i;
                selector = instance.selector + ':eq(' + i + ')';
                Yadcf.setOptions(instance.selector, options_arg, params, oTable);
                Yadcf.initAndBindTable(instance, selector, i, oTable);
            }
            jquery_1.default.fn.dataTable.ext.iApiIndex = 0;
        }
        if (params.onInitComplete !== undefined) {
            params.onInitComplete();
        }
    };
    Yadcf.appendFiltersMultipleTables = function (tablesArray, tablesSelectors, colObjDummy) {
        var filter_selector_string = '#' + colObjDummy.filter_container_id, table_selector_jq_friendly = this.generateTableSelectorJQFriendlyNew(tablesSelectors), column_number_str = this.columnsArrayToString(colObjDummy.column_number).column_number_str.toString(), filterOptions = this.getOptions(tablesSelectors + '_' + column_number_str)[column_number_str], options_tmp, ii, tableTmp, tableTmpArr, tableTmpArrIndex, column_number_index, columnsTmpArr, settingsDt, tmpStr, columnForStateSaving;
        //add a wrapper to hold both filter and reset button
        (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<div>', {
            id: "yadcf-filter-wrapper-".concat(table_selector_jq_friendly, "-").concat(column_number_str),
            class: 'yadcf-filter-wrapper'
        }));
        filter_selector_string += ' div.yadcf-filter-wrapper';
        if (column_number_str.indexOf('_') !== -1) {
            columnForStateSaving = column_number_str.split('_')[0];
        }
        else {
            columnForStateSaving = column_number_str;
        }
        switch (filterOptions.filter_type) {
            case 'text':
                (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<input>', {
                    type: 'text',
                    id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str),
                    class: 'yadcf-filter',
                    onmousedown: Yadcf.stopPropagation,
                    onclick: Yadcf.stopPropagation,
                    placeholder: filterOptions.filter_default_label,
                    onkeyup: function (colNo) {
                        return function (event) {
                            Yadcf.stopPropagation(event);
                            Yadcf.textKeyUpMultiTables(tablesSelectors, event, colNo);
                            return false;
                        };
                    }(column_number_str),
                }));
                if (filterOptions.filter_reset_button_text !== false) {
                    (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').after(this.makeElement('<button>', {
                        type: 'button',
                        id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str, "-reset"),
                        onmousedown: Yadcf.stopPropagation,
                        onclick: function (colNo) {
                            return function (event) {
                                Yadcf.stopPropagation(event);
                                Yadcf.textKeyUpMultiTables(tablesSelectors, event, colNo, 'clear');
                                return false;
                            };
                        }(column_number_str),
                        class: "yadcf-filter-reset-button ".concat(filterOptions.reset_button_style_class),
                        text: filterOptions.filter_reset_button_text
                    }));
                }
                if (tablesArray[0].table !== undefined) {
                    tableTmp = (0, jquery_1.default)('#' + tablesArray[0].table().node().id).dataTable();
                }
                else {
                    tableTmp = tablesArray[0];
                }
                settingsDt = this.getSettingsObjFromTable(tableTmp);
                if (settingsDt.aoPreSearchCols[columnForStateSaving] &&
                    settingsDt.aoPreSearchCols[columnForStateSaving].sSearch !== '') {
                    tmpStr = settingsDt.aoPreSearchCols[columnForStateSaving].sSearch;
                    tmpStr = this.yadcfParseMatchFilter(tmpStr, filterOptions.filter_match_mode);
                    (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str)).val(tmpStr).addClass('inuse');
                }
                break;
            case 'select':
            case 'multi_select':
                if (filterOptions.select_type === undefined) {
                    options_tmp = (0, jquery_1.default)('<option>', {
                        'data-placeholder': 'true',
                        value: '-1',
                        text: filterOptions.filter_default_label
                    });
                }
                else {
                    options_tmp = (0, jquery_1.default)();
                }
                if (filterOptions.select_type === 'select2' &&
                    filterOptions.select_type_options.placeholder !== undefined &&
                    filterOptions.select_type_options.allowClear === true) {
                    options_tmp = (0, jquery_1.default)('<option>', { value: '' });
                }
                if (filterOptions.data === undefined) {
                    filterOptions.data = [];
                    tableTmpArr = tablesSelectors.split(',');
                    for (tableTmpArrIndex = 0; tableTmpArrIndex < tableTmpArr.length; tableTmpArrIndex++) {
                        if (tablesArray[tableTmpArrIndex].table !== undefined) {
                            // @ts-expect-error
                            tableTmp = (0, jquery_1.default)('#' + tablesArray[tableTmpArrIndex].table().node().id).dataTable();
                        }
                        else {
                            tableTmp = tablesArray[tableTmpArrIndex];
                        }
                        if (this.isDOMSource(tableTmp)) {
                            // Check if ajax source, if so, listen for dt.draw.
                            columnsTmpArr = filterOptions.column_number;
                            for (column_number_index = 0; column_number_index < [columnsTmpArr].length; column_number_index++) {
                                filterOptions.column_number = columnsTmpArr[column_number_index];
                                filterOptions.data = filterOptions.data.concat(this.parseTableColumn(tableTmp, filterOptions, table_selector_jq_friendly));
                            }
                            filterOptions.column_number = columnsTmpArr;
                        }
                        else {
                            (0, jquery_1.default)(document).off('draw.dt', '#' + tablesArray[tableTmpArrIndex].table().node().id).on('draw.dt', '#' + tablesArray[tableTmpArrIndex].table().node().id, function (event, ui) {
                                var options_tmp = (0, jquery_1.default)(), ii;
                                columnsTmpArr = filterOptions.column_number;
                                for (column_number_index = 0; column_number_index < [columnsTmpArr].length; column_number_index++) {
                                    filterOptions.column_number = columnsTmpArr[column_number_index];
                                    filterOptions.data = filterOptions.data.concat(this.parseTableColumn(tableTmp, filterOptions, table_selector_jq_friendly, ui));
                                }
                                filterOptions.column_number = columnsTmpArr;
                                filterOptions.data = this.sortColumnData(filterOptions.data, filterOptions);
                                for (ii = 0; ii < filterOptions.data.length; ii++) {
                                    options_tmp = options_tmp.add((0, jquery_1.default)('<option>', {
                                        value: filterOptions.data[ii],
                                        text: filterOptions.data[ii]
                                    }));
                                }
                                (0, jquery_1.default)('#' + filterOptions.filter_container_id + ' select').empty().append(options_tmp);
                                if (filterOptions.select_type !== undefined) {
                                    this.initializeSelectPlugin(filterOptions.select_type, (0, jquery_1.default)('#' + filterOptions.filter_container_id + ' select'), filterOptions.select_type_options);
                                    if (filterOptions.cumulative_filtering === true && filterOptions.select_type === 'chosen') {
                                        this.refreshSelectPlugin(filterOptions, (0, jquery_1.default)('#' + filterOptions.filter_container_id + ' select'));
                                    }
                                }
                            });
                        }
                    }
                }
                filterOptions.data = this.sortColumnData(filterOptions.data, filterOptions);
                if (tablesArray[0].table !== undefined) {
                    tableTmp = (0, jquery_1.default)('#' + tablesArray[0].table().node().id).dataTable();
                }
                else {
                    tableTmp = tablesArray[0];
                }
                settingsDt = this.getSettingsObjFromTable(tableTmp);
                if (typeof filterOptions.data[0] === 'object') {
                    for (ii = 0; ii < filterOptions.data.length; ii++) {
                        options_tmp = options_tmp.add((0, jquery_1.default)('<option>', {
                            value: filterOptions.data[ii].value,
                            text: filterOptions.data[ii].label
                        }));
                    }
                }
                else {
                    for (ii = 0; ii < filterOptions.data.length; ii++) {
                        options_tmp = options_tmp.add((0, jquery_1.default)('<option>', {
                            value: filterOptions.data[ii],
                            text: filterOptions.data[ii]
                        }));
                    }
                }
                if (filterOptions.filter_type === 'select') {
                    (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<select>', {
                        id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str),
                        class: 'yadcf-filter',
                        onchange: function (colNo) {
                            return function (event) {
                                Yadcf.stopPropagation(event);
                                Yadcf.doFilterMultiTables(tablesSelectors, event, colNo);
                            };
                        }(column_number_str),
                        onmousedown: Yadcf.stopPropagation,
                        onclick: Yadcf.stopPropagation,
                        html: options_tmp
                    }));
                    if (settingsDt.aoPreSearchCols[columnForStateSaving].sSearch !== '') {
                        tmpStr = settingsDt.aoPreSearchCols[columnForStateSaving].sSearch;
                        tmpStr = this.yadcfParseMatchFilter(tmpStr, filterOptions.filter_match_mode);
                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str)).val(tmpStr).addClass('inuse');
                    }
                }
                else if (filterOptions.filter_type === 'multi_select') {
                    (0, jquery_1.default)(filter_selector_string).append(this.makeElement('<select>', {
                        multiple: true,
                        'data-placeholder': filterOptions.filter_default_label,
                        id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str),
                        class: 'yadcf-filter',
                        onchange: function (colNo) {
                            return function (event) {
                                Yadcf.stopPropagation(event);
                                Yadcf.doFilterMultiTablesMultiSelect(tablesSelectors, event, colNo);
                            };
                        }(column_number_str),
                        onmousedown: this.stopPropagation,
                        onclick: this.stopPropagation,
                        html: options_tmp
                    }));
                    if (settingsDt.aoPreSearchCols[columnForStateSaving].sSearch !== '') {
                        tmpStr = settingsDt.aoPreSearchCols[columnForStateSaving].sSearch;
                        tmpStr = this.yadcfParseMatchFilterMultiSelect(tmpStr, filterOptions.filter_match_mode);
                        tmpStr = tmpStr.replace(/\\/g, '');
                        tmpStr = tmpStr.split('|');
                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str)).val(tmpStr);
                    }
                }
                if (filterOptions.filter_type === 'select') {
                    if (filterOptions.filter_reset_button_text !== false) {
                        (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').after(this.makeElement('<button>', {
                            type: 'button',
                            id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str, "-reset"),
                            onmousedown: this.stopPropagation,
                            onclick: function (colNo) {
                                return function (event) {
                                    Yadcf.stopPropagation(event);
                                    Yadcf.doFilterMultiTables(tablesSelectors, event, colNo, true);
                                    return false;
                                };
                            }(column_number_str),
                            class: 'yadcf-filter-reset-button ' + filterOptions.reset_button_style_class,
                            text: filterOptions.filter_reset_button_text
                        }));
                    }
                }
                else if (filterOptions.filter_type === 'multi_select') {
                    if (filterOptions.filter_reset_button_text !== false) {
                        (0, jquery_1.default)(filter_selector_string).find('.yadcf-filter').after(this.makeElement('<button>', {
                            type: 'button',
                            id: "yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str, "-reset"),
                            onmousedown: Yadcf.stopPropagation,
                            onclick: function (colNo) {
                                return function (event) {
                                    Yadcf.stopPropagation(event);
                                    Yadcf.doFilterMultiTablesMultiSelect(tablesSelectors, event, colNo, true);
                                    return false;
                                };
                            }(column_number_str),
                            class: "yadcf-filter-reset-button ".concat(filterOptions.reset_button_style_class),
                            text: filterOptions.filter_reset_button_text
                        }));
                    }
                }
                if (filterOptions.select_type !== undefined) {
                    this.initializeSelectPlugin(filterOptions.select_type, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str)), filterOptions.select_type_options);
                    if (filterOptions.cumulative_filtering === true && filterOptions.select_type === 'chosen') {
                        this.refreshSelectPlugin(filterOptions, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number_str)));
                    }
                }
                break;
            default:
                alert('Filters Multiple Tables does not support ' + filterOptions.filter_type);
        }
    };
    Yadcf.initMultipleTables = function (tablesArray, filtersOptions) {
        var i, tablesSelectors = '', default_options = {
            filter_type: 'text',
            filter_container_id: '',
            filter_reset_button_text: 'x',
            case_insensitive: true
        }, columnsObj, columnsArrIndex, column_number_str, dummyArr;
        for (columnsArrIndex = 0; columnsArrIndex < filtersOptions.length; columnsArrIndex++) {
            dummyArr = [];
            columnsObj = filtersOptions[columnsArrIndex];
            if (columnsObj.filter_default_label === undefined) {
                if (columnsObj.filter_type === 'select' || columnsObj.filter_type === 'custom_func') {
                    columnsObj.filter_default_label = 'Select value';
                }
                else if (columnsObj.filter_type === 'multi_select' || columnsObj.filter_type === 'multi_select_custom_func') {
                    columnsObj.filter_default_label = 'Select values';
                }
                else if (columnsObj.filter_type === 'auto_complete' || columnsObj.filter_type === 'text') {
                    columnsObj.filter_default_label = 'Type to filter';
                }
                else if (columnsObj.filter_type === 'range_number' || columnsObj.filter_type === 'range_date') {
                    columnsObj.filter_default_label = ['from', 'to'];
                }
                else if (columnsObj.filter_type === 'date') {
                    columnsObj.filter_default_label = 'Select a date';
                }
            }
            columnsObj = jquery_1.default.extend({}, default_options, columnsObj);
            column_number_str = this.columnsArrayToString(columnsObj.column_number).column_number_str;
            columnsObj.column_number_str = column_number_str;
            dummyArr.push(columnsObj);
            tablesSelectors = '';
            for (i = 0; i < tablesArray.length; i++) {
                if (tablesArray[i].table !== undefined) {
                    tablesSelectors += tablesArray[i].table().node().id + ',';
                }
                else {
                    tablesSelectors += this.getSettingsObjFromTable(tablesArray[i]).sTableId;
                }
            }
            tablesSelectors = tablesSelectors.substring(0, tablesSelectors.length - 1);
            this.setOptions(tablesSelectors + '_' + column_number_str, dummyArr, {});
            // @ts-ignore
            this.oTables[tablesSelectors] = tablesArray;
            this.appendFiltersMultipleTables(tablesArray, tablesSelectors, columnsObj);
        }
    };
    Yadcf.initMultipleColumns = function (table, filtersOptions) {
        var tablesArray = [];
        tablesArray.push(table);
        this.initMultipleTables(tablesArray, filtersOptions);
    };
    Yadcf.close3rdPPluginsNeededClose = function (evt) {
        if (this.closeBootstrapDatepickerRange) {
            (0, jquery_1.default)('.yadcf-filter-range-date').not((0, jquery_1.default)(evt.target)).datepicker('hide');
        }
        if (this.closeBootstrapDatepicker) {
            (0, jquery_1.default)('.yadcf-filter-date').not((0, jquery_1.default)(evt.target)).datepicker('hide');
        }
        if (this.closeSelect2) {
            var currentSelect2_1;
            if (evt.target.className.indexOf('yadcf-filter-reset-button') !== -1) {
                (0, jquery_1.default)('select.yadcf-filter').each(function (index) {
                    if ((0, jquery_1.default)(this).data('select2')) {
                        (0, jquery_1.default)(this).select2('close');
                    }
                });
            }
            else {
                currentSelect2_1 = (0, jquery_1.default)((0, jquery_1.default)(evt.target).closest('.yadcf-filter-wrapper').find('select'));
                (0, jquery_1.default)('select.yadcf-filter').each(function (index) {
                    if (!(0, jquery_1.default)(this).is(currentSelect2_1) && (0, jquery_1.default)(this).data('select2')) {
                        (0, jquery_1.default)(this).select2('close');
                    }
                });
            }
        }
    };
    Yadcf.stopPropagation = function (evt) {
        this.close3rdPPluginsNeededClose(evt);
        if (evt.stopPropagation !== undefined) {
            evt.stopPropagation();
        }
        else {
            evt.cancelable = true;
        }
    };
    Yadcf.preventDefaultForEnter = function (evt) {
        this.ctrlPressed = false;
        if (evt.keyCode === 13) {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            else {
                evt.returnValue = false;
            }
        }
        if (evt.keyCode == 65 && evt.ctrlKey) {
            this.ctrlPressed = true;
            evt.target.select();
            return;
        }
        if (evt.ctrlKey && (evt.keyCode == 67 || evt.keyCode == 88)) {
            this.ctrlPressed = true;
            return;
        }
    };
    //--------------------------------------------------------
    Yadcf.exInternalFilterColumnAJAXQueue = function (table_arg, col_filter_arr) {
        return function () {
            Yadcf.exFilterColumn(table_arg, col_filter_arr, true);
        };
    };
    Yadcf.exFilterColumn = function (table_arg, col_filter_arr, ajaxSource) {
        if (ajaxSource === void 0) { ajaxSource = true; }
        var table_selector_jq_friendly, j, tmpStr, column_number, column_position, filter_value, fromId, toId, sliderId, optionsObj, min, max, exclude = false;
        // Check if the table arg is from new datatables API (capital 'D').
        if (table_arg.settings !== undefined) {
            table_arg = table_arg.settings()[0].oInstance;
        }
        table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2(table_arg);
        if (this.isDOMSource(table_arg) || ajaxSource === true) {
            for (j = 0; j < col_filter_arr.length; j++) {
                column_number = col_filter_arr[j][0];
                column_position = column_number;
                exclude = false;
                if (this.plugins[table_selector_jq_friendly] !== undefined &&
                    (this.plugins[table_selector_jq_friendly] !== undefined &&
                        this.plugins[table_selector_jq_friendly].ColReorder !== undefined)) {
                    column_position = this.plugins[table_selector_jq_friendly].ColReorder[column_number];
                }
                optionsObj = this.getOptions(table_arg.selector)[column_number];
                filter_value = col_filter_arr[j][1];
                switch (optionsObj.filter_type) {
                    case 'auto_complete':
                    case 'text':
                    case 'date':
                        if (filter_value !== undefined && filter_value.indexOf('_exclude_') !== -1) {
                            exclude = true;
                            filter_value = filter_value.replace('_exclude_', '');
                        }
                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(filter_value);
                        if (filter_value !== '') {
                            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse');
                        }
                        else {
                            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse');
                        }
                        tmpStr = this.yadcfMatchFilterString(table_arg, column_position, filter_value, optionsObj.filter_match_mode, false, exclude);
                        table_arg.fnSettings().aoPreSearchCols[column_position].sSearch = tmpStr;
                        break;
                    case 'select':
                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(filter_value);
                        if (filter_value !== '') {
                            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse');
                        }
                        else {
                            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse');
                        }
                        tmpStr = this.yadcfMatchFilterString(table_arg, column_position, filter_value, optionsObj.filter_match_mode, false);
                        table_arg.fnSettings().aoPreSearchCols[column_position].sSearch = tmpStr;
                        if (optionsObj.select_type !== undefined) {
                            this.refreshSelectPlugin(optionsObj, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)), filter_value);
                        }
                        break;
                    case 'multi_select':
                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(filter_value);
                        tmpStr = this.yadcfMatchFilterString(table_arg, column_position, filter_value, optionsObj.filter_match_mode, true);
                        table_arg.fnSettings().aoPreSearchCols[column_position].sSearch = tmpStr;
                        if (optionsObj.select_type !== undefined) {
                            this.refreshSelectPlugin(optionsObj, (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)), filter_value);
                        }
                        break;
                    case 'range_date':
                        fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-date-").concat(column_number);
                        toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-to-date-").concat(column_number);
                        (0, jquery_1.default)('#' + fromId).val(filter_value.from);
                        if (filter_value.from !== '') {
                            (0, jquery_1.default)('#' + fromId).addClass('inuse');
                        }
                        else {
                            (0, jquery_1.default)('#' + fromId).removeClass('inuse');
                        }
                        (0, jquery_1.default)('#' + toId).val(filter_value.to);
                        if (filter_value.to !== '') {
                            (0, jquery_1.default)('#' + toId).addClass('inuse');
                        }
                        else {
                            (0, jquery_1.default)('#' + toId).removeClass('inuse');
                        }
                        if (table_arg.fnSettings().oFeatures.bServerSide === true) {
                            min = filter_value.from;
                            max = filter_value.to;
                            table_arg.fnSettings().aoPreSearchCols[column_position].sSearch = min + optionsObj.custom_range_delimiter + max;
                        }
                        this.saveStateSave(table_arg, column_number, table_selector_jq_friendly, filter_value.from, filter_value.to);
                        break;
                    case 'range_number':
                        fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-").concat(column_number);
                        toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-to-").concat(column_number);
                        (0, jquery_1.default)('#' + fromId).val(filter_value.from);
                        if (filter_value.from !== '') {
                            (0, jquery_1.default)('#' + fromId).addClass('inuse');
                        }
                        else {
                            (0, jquery_1.default)('#' + fromId).removeClass('inuse');
                        }
                        (0, jquery_1.default)('#' + toId).val(filter_value.to);
                        if (filter_value.to !== '') {
                            (0, jquery_1.default)('#' + toId).addClass('inuse');
                        }
                        else {
                            (0, jquery_1.default)('#' + toId).removeClass('inuse');
                        }
                        if (table_arg.fnSettings().oFeatures.bServerSide === true) {
                            table_arg.fnSettings().aoPreSearchCols[column_position].sSearch = filter_value.from + optionsObj.custom_range_delimiter + filter_value.to;
                        }
                        this.saveStateSave(table_arg, column_number, table_selector_jq_friendly, filter_value.from, filter_value.to);
                        break;
                    case 'range_number_slider':
                        sliderId = "yadcf-filter-".concat(table_selector_jq_friendly, "-slider-").concat(column_number);
                        fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-min_tip-").concat(column_number);
                        toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-max_tip-").concat(column_number);
                        if (filter_value.from !== '') {
                            min = (0, jquery_1.default)('#' + fromId).closest('.yadcf-filter-range-number-slider').find('.yadcf-filter-range-number-slider-min-tip-hidden').text();
                            max = (0, jquery_1.default)('#' + fromId).closest('.yadcf-filter-range-number-slider').find('.yadcf-filter-range-number-slider-max-tip-hidden').text();
                            (0, jquery_1.default)('#' + fromId).text(filter_value.from);
                            if (min !== filter_value.from) {
                                (0, jquery_1.default)('#' + fromId).parent().addClass('inuse');
                                (0, jquery_1.default)('#' + fromId).parent().parent().find('ui-slider-range').addClass('inuse');
                            }
                            else {
                                (0, jquery_1.default)('#' + fromId).parent().removeClass('inuse');
                                (0, jquery_1.default)('#' + fromId).parent().parent().find('ui-slider-range').removeClass('inuse');
                            }
                            (0, jquery_1.default)('#' + sliderId).slider('values', 0, filter_value.from);
                        }
                        if (filter_value.to !== '') {
                            (0, jquery_1.default)('#' + toId).text(filter_value.to);
                            if (max !== filter_value.to) {
                                (0, jquery_1.default)('#' + toId).parent().addClass('inuse');
                                (0, jquery_1.default)('#' + toId).parent().parent().find('.ui-slider-range').addClass('inuse');
                            }
                            else {
                                (0, jquery_1.default)('#' + toId).parent().removeClass('inuse');
                                (0, jquery_1.default)('#' + toId).parent().parent().find('.ui-slider-range').removeClass('inuse');
                            }
                            (0, jquery_1.default)('#' + sliderId).slider('values', 1, filter_value.to);
                        }
                        if (table_arg.fnSettings().oFeatures.bServerSide === true) {
                            table_arg.fnSettings().aoPreSearchCols[column_position].sSearch = filter_value.from + optionsObj.custom_range_delimiter + filter_value.to;
                        }
                        this.saveStateSave(table_arg, column_number, table_selector_jq_friendly, filter_value.from, filter_value.to);
                        break;
                    case 'custom_func':
                    case 'multi_select_custom_func':
                    case 'date_custom_func':
                        (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).val(filter_value);
                        if (filter_value !== '') {
                            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).addClass('inuse');
                        }
                        else {
                            (0, jquery_1.default)("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number)).removeClass('inuse');
                        }
                        if (table_arg.fnSettings().oFeatures.bServerSide === true) {
                            table_arg.fnSettings().aoPreSearchCols[column_position].sSearch = filter_value;
                        }
                        if (optionsObj.select_type !== undefined) {
                            this.refreshSelectPlugin(optionsObj, "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number), filter_value);
                        }
                        this.saveStateSave(table_arg, column_number, table_selector_jq_friendly, filter_value, '');
                        break;
                }
            }
            if (table_arg.fnSettings().oFeatures.bServerSide !== true) {
                table_arg.fnDraw();
            }
            else {
                setTimeout(function () {
                    table_arg.fnDraw();
                }, 10);
            }
        }
        else {
            this.exFilterColumnQueue.push(this.exInternalFilterColumnAJAXQueue(table_arg, col_filter_arr));
        }
    };
    Yadcf.exGetColumnFilterVal = function (table_arg, column_number) {
        var retVal, fromId, toId, table_selector_jq_friendly, optionsObj, $filterElement;
        // Check if the table arg is from new datatables API (capital 'D').
        if (table_arg.settings !== undefined) {
            table_arg = table_arg.settings()[0].oInstance;
        }
        optionsObj = this.getOptions(table_arg.selector)[column_number];
        table_selector_jq_friendly = Yadcf.generateTableSelectorJQFriendly2(table_arg);
        var selectorePrefix = '';
        var settingsDt = this.getSettingsObjFromTable(table_arg);
        if (optionsObj.filters_position === 'tfoot' && settingsDt.oScroll.sX) {
            selectorePrefix = '.dataTables_scrollFoot ';
        }
        $filterElement = (0, jquery_1.default)(selectorePrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number));
        switch (optionsObj.filter_type) {
            case 'select':
            case 'custom_func':
                retVal = $filterElement.val();
                if (retVal === '-1') {
                    retVal = '';
                }
                break;
            case 'auto_complete':
            case 'text':
            case 'date':
            case 'date_custom_func':
                retVal = $filterElement.val();
                if ($filterElement.prev().hasClass('yadcf-exclude-wrapper') && $filterElement.prev().find('input').prop('checked') === true) {
                    retVal = '_exclude_' + retVal;
                }
                break;
            case 'multi_select':
            case 'multi_select_custom_func':
                retVal = $filterElement.val();
                if (retVal === null) {
                    retVal = '';
                }
                break;
            case 'range_date':
                retVal = {};
                fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-date-").concat(column_number);
                toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-to-date-").concat(column_number);
                retVal.from = (0, jquery_1.default)(selectorePrefix + '#' + fromId).val();
                retVal.to = (0, jquery_1.default)(selectorePrefix + '#' + toId).val();
                break;
            case 'range_number':
                retVal = {};
                fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-").concat(column_number);
                toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-to-").concat(column_number);
                retVal.from = (0, jquery_1.default)(selectorePrefix + '#' + fromId).val();
                retVal.to = (0, jquery_1.default)(selectorePrefix + '#' + toId).val();
                break;
            case 'range_number_slider':
                retVal = {};
                fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-min_tip-").concat(column_number);
                toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-max_tip-").concat(column_number);
                retVal.from = (0, jquery_1.default)(selectorePrefix + '#' + fromId).text();
                retVal.to = (0, jquery_1.default)(selectorePrefix + '#' + toId).text();
                break;
            default:
                console.log('exGetColumnFilterVal error: no such filter_type: ' + optionsObj.filter_type);
        }
        return retVal;
    };
    Yadcf.clearStateSave = function (oTable, column_number, table_selector_jq_friendly) {
        var yadcfState;
        if (oTable.fnSettings().oFeatures.bStateSave === true) {
            if (!oTable.fnSettings().oLoadedState) {
                oTable.fnSettings().oLoadedState = {};
                oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
            }
            if (oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number] = undefined;
            }
            else {
                yadcfState = {};
                yadcfState[table_selector_jq_friendly] = [];
                yadcfState[table_selector_jq_friendly][column_number] = undefined;
                oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
            }
            oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
        }
    };
    Yadcf.saveStateSave = function (oTable, column_number, table_selector_jq_friendly, from, to) {
        var yadcfState;
        if (oTable.fnSettings().oFeatures.bStateSave === true) {
            if (!oTable.fnSettings().oLoadedState) {
                oTable.fnSettings().oLoadedState = {};
            }
            if (oTable.fnSettings().oLoadedState.yadcfState !== undefined &&
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly] !== undefined) {
                oTable.fnSettings().oLoadedState.yadcfState[table_selector_jq_friendly][column_number] = {
                    from: from,
                    to: to
                };
            }
            else {
                yadcfState = {};
                yadcfState[table_selector_jq_friendly] = [];
                yadcfState[table_selector_jq_friendly][column_number] = {
                    from: from,
                    to: to
                };
                oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
            }
            oTable.fnSettings().oApi._fnSaveState(oTable.fnSettings());
        }
    };
    Yadcf.exResetAllFilters = function (table_arg, noRedraw, columns) {
        var table_selector_jq_friendly, column_number, fromId, toId, sliderId, tableOptions, optionsObj, columnObjKey, settingsDt, i, $filterElement;
        // Check if the table arg is from new datatables API (capital 'D').
        if (table_arg.settings !== undefined) {
            table_arg = table_arg.settings()[0].oInstance;
        }
        tableOptions = this.getOptions(table_arg.selector);
        table_selector_jq_friendly = this.generateTableSelectorJQFriendly2(table_arg);
        settingsDt = this.getSettingsObjFromTable(table_arg);
        for (columnObjKey in tableOptions) {
            if (tableOptions.hasOwnProperty(columnObjKey)) {
                optionsObj = tableOptions[columnObjKey];
                column_number = optionsObj.column_number;
                if (columns !== undefined && jquery_1.default.inArray(column_number, columns) === -1) {
                    continue;
                }
                (0, jquery_1.default)(document).removeData("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val"));
                var selectorePrefix = '';
                if (optionsObj.filters_position === 'tfoot' && settingsDt.oScroll.sX) {
                    selectorePrefix = '.dataTables_scrollFoot ';
                }
                $filterElement = (0, jquery_1.default)(selectorePrefix + "#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number));
                switch (optionsObj.filter_type) {
                    case 'select':
                    case 'custom_func':
                        this.resetExcludeRegexCheckboxes($filterElement.parent());
                        this.clearStateSave(table_arg, column_number, table_selector_jq_friendly);
                        $filterElement.val('-1').removeClass('inuse');
                        table_arg.fnSettings().aoPreSearchCols[column_number].sSearch = '';
                        if (optionsObj.select_type !== undefined) {
                            this.refreshSelectPlugin(optionsObj, $filterElement, '-1');
                        }
                        break;
                    case 'auto_complete':
                    case 'text':
                        $filterElement.prop('disabled', false);
                        $filterElement.val('').removeClass('inuse inuse-exclude inuse-regex');
                        table_arg.fnSettings().aoPreSearchCols[column_number].sSearch = '';
                        this.resetExcludeRegexCheckboxes($filterElement.parent());
                        this.clearStateSave(table_arg, column_number, table_selector_jq_friendly);
                        break;
                    case 'date':
                        $filterElement.val('').removeClass('inuse');
                        table_arg.fnSettings().aoPreSearchCols[column_number].sSearch = '';
                        if ($filterElement.prev().hasClass('yadcf-exclude-wrapper')) {
                            $filterElement.prev().find('input').prop('checked', false);
                        }
                        break;
                    case 'multi_select':
                    case 'multi_select_custom_func':
                        $filterElement.val('-1');
                        (0, jquery_1.default)(document).data("#yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(column_number, "_val"), undefined);
                        table_arg.fnSettings().aoPreSearchCols[column_number].sSearch = '';
                        if (optionsObj.select_type !== undefined) {
                            this.refreshSelectPlugin(optionsObj, $filterElement, '-1');
                        }
                        break;
                    case 'range_date':
                        fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-date-").concat(column_number);
                        toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-to-date-").concat(column_number);
                        (0, jquery_1.default)(selectorePrefix + '#' + fromId).val('');
                        (0, jquery_1.default)(selectorePrefix + '#' + fromId).removeClass('inuse');
                        (0, jquery_1.default)(selectorePrefix + '#' + toId).val('');
                        (0, jquery_1.default)(selectorePrefix + '#' + toId).removeClass('inuse');
                        if (table_arg.fnSettings().oFeatures.bServerSide === true) {
                            table_arg.fnSettings().aoPreSearchCols[column_number].sSearch = '';
                        }
                        this.clearStateSave(table_arg, column_number, table_selector_jq_friendly);
                        break;
                    case 'range_number':
                        fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-from-").concat(column_number);
                        toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-to-").concat(column_number);
                        (0, jquery_1.default)(selectorePrefix + '#' + fromId).prop('disabled', false);
                        (0, jquery_1.default)(selectorePrefix + '#' + fromId).val('');
                        (0, jquery_1.default)(selectorePrefix + '#' + fromId).removeClass('inuse inuse-exclude');
                        (0, jquery_1.default)(selectorePrefix + '#' + toId).prop('disabled', false);
                        (0, jquery_1.default)(selectorePrefix + '#' + toId).val('');
                        (0, jquery_1.default)(selectorePrefix + '#' + toId).removeClass('inuse inuse-exclude');
                        if (table_arg.fnSettings().oFeatures.bServerSide === true) {
                            table_arg.fnSettings().aoPreSearchCols[column_number].sSearch = '';
                        }
                        this.resetExcludeRegexCheckboxes((0, jquery_1.default)(selectorePrefix + '#' + fromId).parent().parent());
                        this.clearStateSave(table_arg, column_number, table_selector_jq_friendly);
                        break;
                    case 'range_number_slider':
                        sliderId = "yadcf-filter-".concat(table_selector_jq_friendly, "-slider-").concat(column_number);
                        fromId = "yadcf-filter-".concat(table_selector_jq_friendly, "-min_tip-").concat(column_number);
                        toId = "yadcf-filter-".concat(table_selector_jq_friendly, "-max_tip-").concat(column_number);
                        (0, jquery_1.default)(selectorePrefix + '#' + fromId).text('');
                        (0, jquery_1.default)(selectorePrefix + '#' + fromId).parent().removeClass('inuse');
                        (0, jquery_1.default)(selectorePrefix + '#' + fromId).parent().parent().find('ui-slider-range').removeClass('inuse');
                        (0, jquery_1.default)(selectorePrefix + '#' + toId).text('');
                        (0, jquery_1.default)(selectorePrefix + '#' + toId).parent().removeClass('inuse');
                        (0, jquery_1.default)(selectorePrefix + '#' + toId).parent().parent().find('.ui-slider-range').removeClass('inuse');
                        (0, jquery_1.default)(selectorePrefix + '#' + sliderId).slider('option', 'values', [(0, jquery_1.default)('#' + fromId).parent().parent().find('.yadcf-filter-range-number-slider-min-tip-hidden').text(), (0, jquery_1.default)('#' + fromId).parent().parent().find('.yadcf-filter-range-number-slider-max-tip-hidden').text()]);
                        if (table_arg.fnSettings().oFeatures.bServerSide === true) {
                            table_arg.fnSettings().aoPreSearchCols[column_number].sSearch = '';
                        }
                        this.clearStateSave(table_arg, column_number, table_selector_jq_friendly);
                        break;
                }
            }
        }
        if (noRedraw !== true) {
            // Clear global filter.
            settingsDt.oPreviousSearch.sSearch = '';
            if (typeof settingsDt.aanFeatures.f !== 'undefined') {
                for (i = 0; i < settingsDt.aanFeatures.f.length; i++) {
                    (0, jquery_1.default)('input', settingsDt.aanFeatures.f[i]).val('');
                }
            }
            // End of clear global filter.
            table_arg.fnDraw(settingsDt);
        }
    };
    Yadcf.exResetFilters = function (table_arg, columns, noRedraw) {
        this.exResetAllFilters(table_arg, noRedraw, columns);
    };
    Yadcf.exFilterExternallyTriggered = function (table_arg) {
        var columnsObj, columnObjKey, columnObj, filterValue, filtersValuesSingleElem, filtersValuesArr = [];
        // Check if the table arg is from new datatables API (capital 'D').
        if (table_arg.settings !== undefined) {
            table_arg = table_arg.settings()[0].oInstance;
        }
        columnsObj = this.getOptions(table_arg.selector);
        for (columnObjKey in columnsObj) {
            if (columnsObj.hasOwnProperty(columnObjKey)) {
                columnObj = columnsObj[columnObjKey];
                filterValue = this.exGetColumnFilterVal(table_arg, columnObj.column_number);
                filtersValuesSingleElem = [];
                filtersValuesSingleElem.push(columnObj.column_number);
                filtersValuesSingleElem.push(filterValue);
                filtersValuesArr.push(filtersValuesSingleElem);
            }
        }
        this.exFilterColumn(table_arg, filtersValuesArr, true);
    };
    Yadcf.getProp = function (nestedObj, keys) {
        var pathArr = Array.isArray(keys) ? keys : keys.split('.');
        return pathArr.reduce(function (obj, key) { return (obj && obj[key] !== 'undefined') ? obj[key] : undefined; }, nestedObj);
    };
    Yadcf.setProp = function (object, keys, val) {
        keys = Array.isArray(keys) ? keys : keys.split('.');
        if (keys.length > 1) {
            object[keys[0]] = object[keys[0]] || {};
            Yadcf.setProp(object[keys[0]], keys.slice(1), val);
            return;
        }
        object[keys[0]] = val;
    };
    Yadcf.resetExcludeRegexCheckboxes = function (selector) {
        var $selector = typeof selector === 'string' ? (0, jquery_1.default)(selector) : selector;
        $selector.find('.yadcf-exclude-wrapper :checkbox').prop('checked', false);
        $selector.find('.yadcf-regex-wrapper :checkbox').prop('checked', false);
        $selector.find('.yadcf-null-wrapper :checkbox').prop('checked', false);
    };
    Yadcf.exRefreshColumnFilterWithDataProp = function (table_arg, col_num, updatedData) {
        if (table_arg.settings !== undefined) {
            table_arg = table_arg.settings()[0].oInstance;
        }
        var columnsObj = this.getOptions(table_arg.selector);
        var columnObj = columnsObj[col_num];
        columnObj.data = updatedData;
        var table_selector_jq_friendly = this.generateTableSelectorJQFriendly2(table_arg);
        this.refreshSelectPlugin(columnObj, (0, jquery_1.default)("yadcf-filter-".concat(table_selector_jq_friendly, "-").concat(col_num)));
    };
    Yadcf._instance = null;
    Yadcf.$ = jQuery;
    Yadcf.tablesDT = {};
    Yadcf.oTables = {};
    Yadcf.oTablesIndex = {};
    Yadcf.options = {};
    Yadcf.plugins = {};
    Yadcf.exFilterColumnQueue = [];
    Yadcf.default_options = {
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
            range: ['From', 'To'],
            date: 'Select a date'
        }
    };
    /**
     * Map an instantiated table to its specified settings.
     *
     * @since 0.0.1
     */
    Yadcf.settingsMap = {};
    Yadcf.ctrlPressed = false;
    Yadcf.closeBootstrapDatepicker = false;
    Yadcf.closeBootstrapDatepickerRange = false;
    Yadcf.closeSelect2 = false;
    return Yadcf;
}());
var yadcf = Yadcf.instance();
exports.default = yadcf;
