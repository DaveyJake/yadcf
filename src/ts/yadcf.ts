  const exFilterColumnQueue = [],
        options: Record<string, any> = {},
        oTables: Record<string, any> = {},
        oTablesIndex        = {},
        plugins: Record<string, any> = {},
        settingsMap: Record<string, any> = {},
        tablesDT: Record<string, any> = {},
        default_options = {
          filter_type: 'select',
          enable_auto_complete: false,
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

  let dTXhrComplete,
      selectElementCustomInitFunc,
      selectElementCustomRefreshFunc,
      selectElementCustomDestroyFunc,
      yadcfDelay;

  let ctrlPressed: boolean = false;
  let closeBootstrapDatepicker: boolean = false;
  let closeBootstrapDatepickerRange: boolean = false;
  let closeSelect2: boolean = false;

  //From ColReorder (SpryMedia Ltd (www.sprymedia.co.uk))
  function getSettingsObjFromTable( dt: any ) {
    let oDTSettings;

    if ( $.fn.dataTable.Api ) {
      oDTSettings = new $.fn.dataTable.Api( dt ).settings()[ 0 ];
    }
    else if ( dt.fnSettings ) { // 1.9 compatibility
      // DataTables object, convert to the settings object
      oDTSettings = dt.fnSettings();
    }
    else if ( typeof dt === 'string' ) { // jQuery selector
      if ( $.fn.dataTable.isDataTable( $( dt )[ 0 ] ) ) {
        oDTSettings = $( dt ).eq( 0 ).dataTable().settings();
      }
    }
    else if ( dt.nodeName && dt.nodeName.toLowerCase() === 'table' ) {
      // Table node
      if ( $.fn.dataTable.isDataTable( dt.nodeName ) ) {
        oDTSettings = $( dt.nodeName ).dataTable().settings();
      }
    }
    else if ( dt instanceof jQuery ) {
      // jQuery object
      if ( $.fn.dataTable.isDataTable( dt[ 0 ] ) ) {
        oDTSettings = dt.eq( 0 ).dataTable().settings();
      }
    }
    else {
      // DataTables settings object
      oDTSettings = dt;
    }

    return oDTSettings;
  }

  function arraySwapValueWithIndex( pArray: Array<any> ) {
    let tmp = {},
          i;

    for ( i = 0; i < pArray.length; i++ ) {
      tmp[ pArray[ i ] ] = i;
    }

    return tmp;
  }

  function arraySwapValueWithIndex2( pArray: Array<any> ) {
    let tmp = {},
          i;

    for ( i = 0; i < pArray.length; i++ ) {
      tmp[ pArray[ i ]._ColReorder_iOrigCol ] = i;
    }

    return tmp;
  }

  function initColReorder2( settingsDt: InstanceType<typeof $.fn.dataTable.Api>, table_selector_jq_friendly: string ) {
    if ( settingsDt.oSavedState && settingsDt.oSavedState.ColReorder !== undefined ) {
      if ( plugins[ table_selector_jq_friendly ] === undefined ) {
        plugins[ table_selector_jq_friendly ] = {};
        plugins[ table_selector_jq_friendly ].ColReorder = arraySwapValueWithIndex( settingsDt.oSavedState.ColReorder );
      }
    } else if ( settingsDt.aoColumns[ 0 ]._ColReorder_iOrigCol !== undefined ) {
      if ( plugins[ table_selector_jq_friendly ] === undefined ) {
        plugins[ table_selector_jq_friendly ] = {};
        plugins[ table_selector_jq_friendly ].ColReorder = arraySwapValueWithIndex2( settingsDt.aoColumns );
      }
    }
  }

  function initColReorderFromEvent( table_selector_jq_friendly: string ) {
    plugins[ table_selector_jq_friendly ] = undefined;
  }

  function columnsArrayToString( column_number: number ) {
    let column_number_obj = {};
    if ( column_number !== undefined ) {
      if ( column_number instanceof Array ) {
        column_number_obj.column_number_str = column_number.join( '_' );
      } else {
        column_number_obj.column_number_str = column_number;
        column_number = [];
        column_number.push( column_number_obj.column_number_str );
      }
    } else {
      column_number_obj.column_number_str = 'global';
    }
    column_number_obj.column_number = column_number;
    return column_number_obj;
  }

  /** @see default_options */
  function initDefaults( params: Record<string, any> ) {
    return $.extend( true, default_options, params );
  }

  /** @see options */
  function getOptions<O = typeof options, K extends keyof O>( selector: K ): O[ K ] {
    return options[ selector ];
  }

  function getAllOptions<T = typeof options>(): T {
    return options;
  }

  function eventTargetFixUp( pEvent: any ): Event {
    if ( pEvent.target === undefined ) {
      pEvent.target = pEvent.srcElement;
    }

    return pEvent;
  }

  function dot2obj( tmpObj: any, dot_refs: any ): string | Record<string, any> {
    let i = 0;

    dot_refs = dot_refs.split( '.' );

    for ( i = 0; i < dot_refs.length; i++ ) {
      if ( tmpObj[ dot_refs[ i ] ] !== undefined && tmpObj[ dot_refs[ i ] ] !== null ) {
        tmpObj = tmpObj[ dot_refs[ i ] ];
      } else {
        return '';
      }
    }

    return tmpObj;
  }

  /**
   * Set the current options.
   *
   * @see check3rdPPluginsNeededClose()
   *
   * @param {string}              selector_arg
   * @param {any}                 options_arg
   * @param {Record<string, any>} params
   * @param {JQuery}              table
   */
  function setOptions( selector_arg: string, options_arg: any, params: Record<string, any>, table: Api<any> ): void {
    let tmpOptions = {},
        i,
        col_num_as_int;
    //adaptContainerCssClassImpl = function (dummy) { return ''; };

    $.extend( true, default_options, params );

    if ( options_arg.length === undefined ) {
      options[ selector_arg ] = options_arg;
      return;
    }

    for ( i = 0; i < options_arg.length; i++ ) {
      if ( options_arg[ i ].date_format !== undefined && options_arg[ i ].moment_date_format === undefined ) {
        options_arg[ i ].moment_date_format = options_arg[ i ].date_format;
      }

      if ( options_arg[ i ].select_type === 'select2' ) {
        default_options.select_type_options = {
          //adaptContainerCssClass: adaptContainerCssClassImpl
        };
      }

      //no individual reset button for externally_triggered mode
      if ( default_options.externally_triggered === true ) {
        options_arg[ i ].filter_reset_button_text = false;
      }

      //validate custom function required attributes
      if ( options_arg[ i ].filter_type !== undefined && options_arg[ i ].filter_type.indexOf( 'custom_func' ) !== -1 ) {
        if ( options_arg[ i ].custom_func === undefined ) {
          console.log( `Error: You are trying to use filter_type: "custom_func / multi_select_custom_func" for column ${options_arg[ i ].column_number} but there is no such custom_func attribute provided (custom_func: "function reference goes here...")` );
          return;
        }
      }

      if ( !options_arg[ i ].column_selector ) {
        col_num_as_int = +options_arg[ i ].column_number;
        if ( isNaN( col_num_as_int ) ) {
          tmpOptions[ options_arg[ i ].column_number_str ] = $.extend( true, {}, default_options, options_arg[ i ] );
        } else {
          tmpOptions[ col_num_as_int ] = $.extend( true, {}, default_options, options_arg[ i ] );
        }
      } else {
        if ( table && table.column ) {
          //translate from column_selector to column_number
          let columnNumber = table.column( options_arg[ i ].column_selector );
          if ( columnNumber.index() >= 0 ) {
            options_arg[ i ].column_number = columnNumber.index();
            tmpOptions[ options_arg[ i ].column_number ] = $.extend( true, {}, default_options, options_arg[ i ] );
          }
        }
      }
    }

    options[ selector_arg ] = tmpOptions;

    check3rdPPluginsNeededClose();
  }

  /**
   * Check for missing third-party plugins.
   *
   * @see getAllOptions()
   */
  function check3rdPPluginsNeededClose(): void {
    Object.entries( getAllOptions() ).forEach( function( tableEntry ) {
      Object.entries( tableEntry[ 1 ] ).forEach( function( columnEntry ) {
        if ( columnEntry[ 1 ].datepicker_type === 'bootstrap-datepicker' ) {
          if ( columnEntry[ 1 ].filter_type === 'range_date' ) {
            closeBootstrapDatepickerRange = true;
          } else {
            closeBootstrapDatepicker = true;
          }
        } else if ( columnEntry[ 1 ].select_type === 'select2' ) {
          closeSelect2 = true;
        }
      });
    });
  }

  //taken and modified from DataTables 1.10.0-beta.2 source
  function yadcfVersionCheck( version: string ): boolean {
    let aThis = $.fn.dataTable.ext.sVersion.split( '.' ),
      aThat = version.split( '.' ),
      iThis,
      iThat,
      i,
      iLen;

    for ( i = 0, iLen = aThat.length; i < iLen; i++ ) {
      iThis = parseInt( aThis[ i ], 10 ) || 0;
      iThat = parseInt( aThat[ i ], 10 ) || 0;

      // Parts are the same, keep comparing
      if ( iThis === iThat ) {
        continue;
      }

      // Parts are different, return immediately
      return iThis > iThat;
    }

    return true;
  }

  function resetIApiIndex(): void {
    $.fn.dataTableExt.iApiIndex = 0;
  }

  function escapeRegExp( string ) {
    return string.replace( /([.*+?^=!:${}()|'\[\]\/\\])/g, '\\$1' );
  }

  function escapeRegExpInArray( arr ) {
    let i;
    for ( i = 0; i < arr.length; i++ ) {
      arr[ i ] = arr[ i ].replace( /([.*+?^=!:${}()|'\[\]\/\\])/g, '\\$1' );
    }
    return arr;
  }

  function replaceAll( string, find, replace ) {
    return string.replace( new RegExp( escapeRegExp( find ), 'g' ), replace );
  }

  function getTableId( obj ) {
    let tableId;
    if ( obj.table !== undefined ) {
      tableId = obj.table().node().id;
    } else {
      tableId = getSettingsObjFromTable( obj ).sTableId;
    }
    return tableId;
  }

  function generateTableSelectorJQFriendly2( obj ) {
    let tmpStr;
    if ( obj.oInstance !== undefined && obj.oInstance.selector !== undefined ) {
      tmpStr = obj.oInstance.selector;
    } else if ( obj.selector !== undefined ) {
      tmpStr = obj.selector;
    } else if ( obj.table !== undefined ) {
      tmpStr = obj.table().node().id;
    } else {
      return '';
    }
    tmpStr = replaceAll( tmpStr, '.', '-' );
    tmpStr = replaceAll( tmpStr, ' ', '' );
    return tmpStr.replace( ':', '-' ).replace( '(', '' ).replace( ')', '' ).replace( '#', '-' );
  }

  function generateTableSelectorJQFriendlyNew( tmpStr ) {
    tmpStr = replaceAll( tmpStr, ':', '-' );
    tmpStr = replaceAll( tmpStr, '(', '' );
    tmpStr = replaceAll( tmpStr, ')', '' );
    tmpStr = replaceAll( tmpStr, ',', '' );
    tmpStr = replaceAll( tmpStr, '.', '-' );
    tmpStr = replaceAll( tmpStr, '#', '-' );
    tmpStr = replaceAll( tmpStr, ' ', '' );
    return tmpStr;
  }

  yadcfDelay = ( function() {
    let timer = 0;
    return function( callback, ms, param ) {
      clearTimeout( timer );
      timer = setTimeout( function() {
        callback( param );
      }, ms );
      return timer;
    };
  }() );

  function initializeSelectPlugin( selectType, $selectObject, select_type_options ) {
    if ( selectType === 'chosen' ) {
      $selectObject.chosen( select_type_options );
      $selectObject.next().on( 'click', yadcf.stopPropagation ).on( 'mousedown', yadcf.stopPropagation );
      refreshSelectPlugin( {
        select_type: selectType,
        select_type_options: select_type_options
      }, $selectObject );
    } else if ( selectType === 'select2' ) {
      if ( !$selectObject.data( 'select2' ) ) {
        $selectObject.select2( select_type_options );
      }
      if ( $selectObject.next().hasClass( 'select2-container' ) ) {
        $selectObject.next().on( 'click', yadcf.stopPropagation ).on( 'mousedown', yadcf.stopPropagation );
      }
    } else if ( selectType === 'custom_select' ) {
      selectElementCustomInitFunc( $selectObject );
      $selectObject.next().on( 'click', yadcf.stopPropagation ).on( 'mousedown', yadcf.stopPropagation );
    }
  }

  function refreshSelectPlugin( columnObj, $selectObject, val ) {
    let selectType = columnObj.select_type,
      select_type_options = columnObj.select_type_options;
    if ( selectType === 'chosen' ) {
      $selectObject.trigger( 'chosen:updated' );
    } else if ( selectType === 'select2' ) {
      if ( !$selectObject.data( 'select2' ) ) {
        $selectObject.select2( select_type_options );
      }
      if ( val !== undefined ) {
        $selectObject.val( val );
      }
      $selectObject.trigger( 'change' );
    } else if ( selectType === 'custom_select' ) {
      selectElementCustomRefreshFunc( $selectObject );
    }
  }

  function initSelectPluginCustomTriggers( initFunc, refreshFunc, destroyFunc ) {
    selectElementCustomInitFunc = initFunc;
    selectElementCustomRefreshFunc = refreshFunc;
    selectElementCustomDestroyFunc = destroyFunc;
  }

  function initOnDtXhrComplete( initFunc ) {
    dTXhrComplete = initFunc;
  }

  //Used by exFilterColumn for translating readable search value into proper search string for datatables filtering
  function yadcfMatchFilterString( table_arg, column_number: number, selected_value, filter_match_mode, multiple, exclude ) {
    let case_insensitive = yadcf.getOptions( table_arg.selector )[ column_number ].case_insensitive,
      ret_val;

    if ( !selected_value ) {
      return '';
    }

    table_arg.fnSettings().aoPreSearchCols[ column_number ].bSmart = false;
    table_arg.fnSettings().aoPreSearchCols[ column_number ].bRegex = true;
    table_arg.fnSettings().aoPreSearchCols[ column_number ].bCaseInsensitive = case_insensitive;

    if ( multiple === undefined || multiple === false ) {
      if ( exclude !== true ) {
        if ( filter_match_mode === 'contains' ) {
          table_arg.fnSettings().aoPreSearchCols[ column_number ].bSmart = true;
          table_arg.fnSettings().aoPreSearchCols[ column_number ].bRegex = false;
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
        selected_value = escapeRegExpInArray( selected_value );
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

  function yadcfMatchFilter( oTable, selected_value, filter_match_mode, column_number: number, exclude, original_column_number: number ) {
    let columnObj = getOptions( oTable.selector )[ original_column_number ],
      case_insensitive = columnObj.case_insensitive;
    if ( exclude !== true ) {
      if ( filter_match_mode === 'contains' ) {
        oTable.fnFilter( selected_value, column_number: number, false, false, true, case_insensitive );
      } else if ( filter_match_mode === 'exact' ) {
        let prefix = '^';
        let suffix = '$';
        if ( columnObj.text_data_delimiter !== undefined ) {
          let text_data_delimiter = escapeRegExp( columnObj.text_data_delimiter );
          prefix = '(' + prefix + '|' + text_data_delimiter + ')';
          suffix = '(' + suffix + '|' + text_data_delimiter + ')';
        }
        selected_value = escapeRegExp( selected_value );
        oTable.fnFilter( prefix + selected_value + suffix, column_number: number, true, false, true, case_insensitive );
      } else if ( filter_match_mode === 'startsWith' ) {
        selected_value = escapeRegExp( selected_value );
        oTable.fnFilter( '^' + selected_value, column_number: number, true, false, true, case_insensitive );
      } else if ( filter_match_mode === 'regex' ) {
        try {
          //validate regex, only call fnFilter if valid
          new RegExp( selected_value );
        } catch ( error ) {
          return;
        }
        oTable.fnFilter( selected_value, column_number: number, true, false, true, case_insensitive );
      }
    } else {
      if ( filter_match_mode === 'exact' ) {
        selected_value = '^' + escapeRegExp( selected_value ) + '$';
      } else if ( filter_match_mode === 'startsWith' ) {
        selected_value = '^' + escapeRegExp( selected_value );
      }
      oTable.fnFilter( '^((?!' + selected_value + ').)*$', column_number: number, true, false, true, case_insensitive );
    }
  }

  function yadcfParseMatchFilter( tmpStr, filter_match_mode ) {
    let retVal;
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

  function doFilterCustomDateFunc( arg, table_selector_jq_friendly: string, column_number: number ) {
    let oTable = oTables[ table_selector_jq_friendly ],
      yadcfState,
      columnObj = getOptions( oTable.selector )[ column_number ];

    if ( arg === 'clear' && exGetColumnFilterVal( oTable, column_number ) === '' ) {
      return;
    }

    if ( arg.value !== undefined && arg.value !== '-1' ) {
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );
    } else {
      //when arg === 'clear' or arg.value === '-1'
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '-1' ).trigger( 'focus' );
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
      refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), '-1' );
    }

    if ( !oTable.fnSettings().oLoadedState ) {
      oTable.fnSettings().oLoadedState = {};
      oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
    }
    if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
      if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
        oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
          from: arg.value
        };
      } else {
        yadcfState = {};
        yadcfState[ table_selector_jq_friendly ] = [];
        yadcfState[ table_selector_jq_friendly ][ column_number ] = {
          from: arg.value
        };
        oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
      }
      oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
    }

    oTable.fnDraw();
  }

  function calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly: string ) {
    let column_number_filter;
    if ( ( settingsDt.oSavedState && settingsDt.oSavedState.ColReorder !== undefined ) ||
      settingsDt._colReorder ||
      ( plugins[ table_selector_jq_friendly ] !== undefined && plugins[ table_selector_jq_friendly ].ColReorder !== undefined ) ) {
      initColReorder2( settingsDt, table_selector_jq_friendly );
      column_number_filter = plugins[ table_selector_jq_friendly ].ColReorder[ column_number ];
    } else {
      column_number_filter = column_number;
    }
    return column_number_filter;
  }

  function doFilter( arg, table_selector_jq_friendly: string, column_number: number, filter_match_mode ) {
    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];

    let oTable: InstanceType<typeof DataTable> = oTables[ table_selector_jq_friendly ],
          exclude_checked = false,
          settingsDt = getSettingsObjFromTable( oTable ),
          selected_key: string,
          selected_value: any,
          column_number_filter,
          columnObj;

    column_number_filter = calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly: string );

    columnObj = getOptions( oTable.selector )[ column_number ];
    if ( columnObj.exclude ) {
      exclude_checked = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
    }

    if ( arg === 'clear' ) {
      clearStateSave( oTable, column_number: number, table_selector_jq_friendly );
      if ( exclude_checked ) {
        resetExcludeRegexCheckboxes( $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ) );
        clearStateSave( oTable, column_number: number, table_selector_jq_friendly );
      }
      if ( exGetColumnFilterVal( oTable, column_number ) === '' ) {
        return;
      }
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '-1' ).trigger( 'focus' );
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
      $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val', '-1' );
      oTable.fnFilter( '', column_number_filter );
      resetIApiIndex();

      refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), '-1' );
      return;
    }

    if ( arg === 'exclude' && ($( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).find( 'option:selected' ).val() as string).trim() === '-1' ) {
      return;
    }

    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );

    selected_key   = arg === 'exclude' ? `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` : arg;
    selected_value = ($( selected_key ).find( 'option:selected' ).val() as string).trim();

    $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val', ( arg === 'exclude' || exclude_checked ) ? selected_value : arg.value );

    if ( arg.value !== '-1' && selected_value !== columnObj.select_null_option ) {
      if ( oTable.fnSettings().oFeatures.bServerSide === false ) {
        oTable.fnDraw();
      }
      yadcfMatchFilter( oTable, selected_value, filter_match_mode, column_number_filter, exclude_checked, column_number );
    } else if ( selected_value === columnObj.select_null_option ) {
      if ( oTable.fnSettings().oFeatures.bServerSide === false ) {
        oTable.fnFilter( '', column_number_filter );
        addNullFilterCapability( table_selector_jq_friendly, column_number: number, true );
        oTable.fnDraw();
      } else {
        yadcfMatchFilter( oTable, selected_value, filter_match_mode, column_number_filter, exclude_checked, column_number );
      }
      if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
        stateSaveNullSelect( oTable, columnObj, table_selector_jq_friendly: string, column_number: number, filter_match_mode, exclude_checked );
        oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
      }
    } else {
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
      oTable.fnFilter( '', column_number_filter );
    }
    resetIApiIndex();
  }

  function stateSaveNullSelect( oTable, columnObj, table_selector_jq_friendly: string, column_number: number, filter_match_mode, exclude_checked ) {
    let null_str = columnObj.select_null_option;
    switch ( filter_match_mode ) {
      case 'exact':
        null_str = '^' + escapeRegExp( null_str ) + '$';
        break;
      case 'startsWith':
        null_str = '^' + escapeRegExp( null_str );
        break;
      default:
        break;
    }
    let excludeStrStart = '^((?!';
    let excludeStrEnd = ').)*$';
    null_str = exclude_checked ? ( excludeStrStart + null_str + excludeStrEnd ) : null_str;
    if ( oTable.fnSettings().oLoadedState ) {
      if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
        oTable.fnSettings().aoPreSearchCols[ column_number ].sSearch = null_str;
      }
    }
  }

  function doFilterMultiSelect( arg: any, table_selector_jq_friendly: string, column_number: number, filter_match_mode ) {
    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
    let oTable = oTables[ table_selector_jq_friendly ],
      selected_values = $( arg ).val(),
      selected_values_trimmed = [],
      i,
      stringForSearch,
      column_number_filter,
      settingsDt = getSettingsObjFromTable( oTable );

    column_number_filter = calcColumnNumberFilter( settingsDt: InstanceType<>, column_number: number, table_selector_jq_friendly );
    $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val', selected_values );

    if ( selected_values !== null ) {
      for ( i = selected_values.length - 1; i >= 0; i-- ) {
        if ( selected_values[ i ] === '-1' ) {
          selected_values.splice( i, 1 );
          break;
        }
      }
      for ( i = 0; i < selected_values.length; i++ ) {
        selected_values_trimmed.push( (selected_values[ i ] as string).trim() );
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
    resetIApiIndex();
  }

  function yadcfParseMatchFilterMultiSelect( tmpStr, filter_match_mode ) {
    let retVal;

    if ( filter_match_mode === 'contains' ) {
      retVal = tmpStr;
    } else if ( filter_match_mode === 'exact' ) {
      retVal = tmpStr.substring( 1, tmpStr.length - 1 );
      retVal = retVal.substring( 1, retVal.length - 1 );
    } else if ( filter_match_mode === 'startsWith' ) {
      retVal = tmpStr.substring( 1, tmpStr.length );
      retVal = retVal.substring( 1, retVal.length - 1 );
    } else if ( filter_match_mode === 'regex' ) {
      retVal = tmpStr;
    }

    return retVal;
  }

  function doFilterAutocomplete( arg, table_selector_jq_friendly: string, column_number: number, filter_match_mode ) {
    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
    let oTable = oTables[ table_selector_jq_friendly ],
      column_number_filter,
      settingsDt = getSettingsObjFromTable( oTable );

    column_number_filter = calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly );

    if ( arg === 'clear' ) {
      if ( exGetColumnFilterVal( oTable, column_number ) === '' ) {
        return;
      }
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' ).trigger( 'focus' );
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
      $( document ).removeData( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val' );
      oTable.fnFilter( '', column_number_filter );
      resetIApiIndex();
      return;
    }

    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );

    $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val', arg.value );

    yadcfMatchFilter( oTable, arg.value, filter_match_mode, column_number_filter, false, column_number );

    resetIApiIndex();
  }

  function autocompleteSelect( event, ui ) {
    let table_column,
      dashIndex,
      table_selector_jq_friendly,
      col_num,
      filter_match_mode;

    event = eventTargetFixUp( event );
    table_column = event.target.id.replace( 'yadcf-filter-', '' );
    dashIndex = table_column.lastIndexOf( '-' );
    table_selector_jq_friendly = table_column.substring( 0, dashIndex );
    col_num = parseInt( table_column.substring( dashIndex + 1 ), 10 );
    filter_match_mode = $( event.target ).attr( 'filter_match_mode' );

    doFilterAutocomplete( ui.item, table_selector_jq_friendly: string, col_num, filter_match_mode );
  }

  function sortNumAsc( a, b ) {
    return a - b;
  }

  function sortNumDesc( a, b ) {
    return b - a;
  }

  function findMinInArray( array, columnObj ) {
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
          num = num[ 0 ];
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

  function findMaxInArray( array, columnObj ) {
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
          num = num[ 1 ];
        }
        if ( !isNaN( num ) ) {
          narray.push( num );
        }
      }
    }
    max = Math.max( ...narray );
    if ( !isFinite( max ) ) {
      max = 0;
    } else {
      max = Math.ceil( max );
    }
    return max;
  }

  function addRangeNumberAndSliderFilterCapability( table_selector_jq_friendly, fromId, toId, col_num, ignore_char, sliderMaxMin ) {

    $.fn.dataTableExt.afnFiltering.push(
      function( settingsDt, aData, iDataIndex, rowData ) {
        let min,
          max,
          val,
          retVal = false,
          table_selector_jq_friendly_local = table_selector_jq_friendly,
          current_table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( settingsDt ),
          ignore_char_local = ignore_char,
          column_data_type,
          html_data_type,
          columnObj,
          column_number_filter,
          valFrom,
          valTo,
          exclude_checked = false;

        if ( table_selector_jq_friendly_local !== current_table_selector_jq_friendly: string ) {
          return true;
        }
        columnObj = getOptions( settingsDt.oInstance.selector )[ col_num ];
        if ( columnObj.filter_type === 'range_number_slider' ) {
          min = $( '#' + fromId ).text();
          max = $( '#' + toId ).text();
        } else {
          min = $( '#' + fromId ).val();
          max = $( '#' + toId ).val();
        }

        if ( columnObj.exclude ) {
          exclude_checked = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${col_num}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
        }

        column_number_filter = calcColumnNumberFilter( settingsDt, col_num, table_selector_jq_friendly );

        if ( rowData !== undefined ) {
          let rowDataRender;
          if ( columnObj.column_number_render ) {
            rowDataRender = $.extend( true, [], rowData );
            let index = columnObj.column_number_data ? columnObj.column_number_data : column_number_filter;
            let meta = {
              row: iDataIndex,
              col: columnObj.column_number,
              settings: settingsDt
            };
            if ( typeof index === 'string' && typeof rowDataRender === 'object' ) {
              let cellDataRender = columnObj.column_number_render( getProp( rowDataRender, index ), 'filter', rowData, meta );
              setProp( rowDataRender, index, ( cellDataRender !== undefined && cellDataRender !== null ) ? cellDataRender : getProp( rowData, index ) );
            } else {
              let cellDataRender = columnObj.column_number_render( rowDataRender[ index ], 'filter', rowData, meta );
              rowDataRender[ index ] = ( cellDataRender !== undefined && cellDataRender !== null ) ? cellDataRender : rowData[ index ];
            }
          }
          aData = rowDataRender ? rowDataRender : rowData;
          if ( columnObj.column_number_data !== undefined ) {
            column_number_filter = columnObj.column_number_data;
            val = dot2obj( aData, column_number_filter );
          } else {
            val = aData[ column_number_filter ];
          }
        } else {
          val = aData[ column_number_filter ];
        }
        if ( !isFinite( min ) || !isFinite( max ) ) {
          return true;
        }
        column_data_type = columnObj.column_data_type;
        html_data_type = columnObj.html_data_type;

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
          if ( typeof val === 'object' ) {
            if ( columnObj.html5_data !== undefined ) {
              val = val[ '@' + columnObj.html5_data ];
            }
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
        //omit empty rows when filtering
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
        if ( !exclude_checked ) {
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
            val = val.split( columnObj.range_data_type_delim );
            valFrom = ( val[ 0 ] !== '' ) ? ( +val[ 0 ] ) : val[ 0 ];
            valTo = ( val[ 1 ] !== '' ) ? ( +val[ 1 ] ) : val[ 1 ];
            if ( !columnObj.range_data_operator ) {
              if ( min === '' && max === '' ) {
                retVal = true;
              } else if ( min === '' && valTo <= max ) {
                retVal = true;
              } else if ( min <= valFrom && '' === max ) {
                retVal = true;
              } else if ( min <= valFrom && valTo <= max ) {
                retVal = true;
              } else if ( ( valFrom === '' || isNaN( valFrom ) ) && ( valTo === '' || isNaN( valTo ) ) ) {
                retVal = true;
              }
            }
          } else if ( columnObj.range_data_type === 'delimiter' ) {
            if ( columnObj.text_data_delimiter !== undefined ) {
              let valSplitted = val.split( columnObj.text_data_delimiter );
              let anyNumberInRange = function( fromToObj ) {
                return function( element, index, array ) {
                  return element >= fromToObj.from && element <= fromToObj.to;
                };
              };
              retVal = valSplitted.some( anyNumberInRange( { from: min, to: max } ) );
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
            val = val.split( columnObj.range_data_type_delim );
            valFrom = ( val[ 0 ] !== '' ) ? ( +val[ 0 ] ) : val[ 0 ];
            valTo = ( val[ 1 ] !== '' ) ? ( +val[ 1 ] ) : val[ 1 ];
            if ( min === '' && max === '' ) {
              retVal = true;
            } else if ( min === '' && valTo > max ) {
              retVal = true;
            } else if ( min > valFrom && '' === max ) {
              retVal = true;
            } else if ( !( min <= valFrom && valTo <= max ) && ( '' !== max && '' !== min ) ) {
              retVal = true;
            } else if ( ( valFrom === '' || isNaN( valFrom ) ) && ( valTo === '' || isNaN( valTo ) ) ) {
              retVal = true;
            }
          }
          return retVal;
        }
      }
    );
  }

  function addCustomFunctionFilterCapability( table_selector_jq_friendly, filterId, col_num ) {

    $.fn.dataTableExt.afnFiltering.push(
      function( settingsDt, aData, iDataIndex, stateVal ) {
        let filterVal = $( '#' + filterId ).val(),
          columnVal,
          retVal = false,
          table_selector_jq_friendly_local = table_selector_jq_friendly,
          current_table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( settingsDt ),
          custom_func,
          column_number_filter;

        if ( table_selector_jq_friendly_local !== current_table_selector_jq_friendly || filterVal === '-1' ) {
          return true;
        }

        column_number_filter = calcColumnNumberFilter( settingsDt, col_num, table_selector_jq_friendly );

        columnVal = aData[ column_number_filter ] === '-' ? 0 : aData[ column_number_filter ];

        custom_func = getOptions( settingsDt.oInstance.selector )[ col_num ].custom_func;

        retVal = custom_func( filterVal, columnVal, aData, stateVal );

        return retVal;
      }
    );
  }

  function addRangeDateFilterCapability( table_selector_jq_friendly, fromId, toId, col_num, date_format ) {

    $.fn.dataTableExt.afnFiltering.push(
      function( settingsDt, aData, iDataIndex, rowData ) {
        let min = document.getElementById( fromId ) !== null ? document.getElementById( fromId ).value : '',
          max = document.getElementById( toId ) !== null ? document.getElementById( toId ).value : '',
          val,
          retVal = false,
          table_selector_jq_friendly_local = table_selector_jq_friendly,
          current_table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( settingsDt ),
          column_data_type,
          html_data_type,
          columnObj,
          column_number_filter,
          min_time,
          max_time,
          dataRenderFunc,
          dpg;
        //'2019/01/30 - 2019/01/30'
        if ( table_selector_jq_friendly_local !== current_table_selector_jq_friendly: string ) {
          return true;
        }
        columnObj = getOptions( settingsDt.oInstance.selector )[ col_num ];
        if ( columnObj.filters_position === 'tfoot' && settingsDt.oScroll.sX ) {
          let selectorePrefix = '.dataTables_scrollFoot ';
          min = document.querySelector( selectorePrefix + '#' + fromId ) ? document.querySelector( selectorePrefix + '#' + fromId ).value : '';
          max = document.querySelector( selectorePrefix + '#' + toId ) ? document.querySelector( selectorePrefix + '#' + toId ).value : '';
        }
        if ( columnObj.datepicker_type === 'daterangepicker' ) {
          min = min.substring( 0, min.indexOf( '-' ) ).trim();
          max = max.substring( max.indexOf( '-' ) + 1 ).trim();
        }
        if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
          dpg = $.fn.datepicker.DPGlobal;
        }
        column_number_filter = calcColumnNumberFilter( settingsDt, col_num, table_selector_jq_friendly );
        if ( typeof columnObj.column_number_data === 'function' || typeof columnObj.column_number_render === 'function' ) {
          dataRenderFunc = true;
        }
        if ( rowData !== undefined && dataRenderFunc !== true ) {
          if ( columnObj.column_number_data !== undefined ) {
            column_number_filter = columnObj.column_number_data;
            val = dot2obj( rowData, column_number_filter );
          } else {
            val = rowData[ column_number_filter ];
          }
        } else {
          val = aData[ column_number_filter ];
        }

        column_data_type = columnObj.column_data_type;
        html_data_type = columnObj.html_data_type;

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

        //omit empty rows when filtering
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
          max_time = max_time.minutes() + max_time.hours() * 60;
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

  function addNullFilterCapability( table_selector_jq_friendly, col_num, isSelect ) {

    $.fn.dataTableExt.afnFiltering.push(
      function( settingsDt, aData, iDataIndex, rowData ) {
        let val,
            retVal = false,
            table_selector_jq_friendly_local = table_selector_jq_friendly,
            current_table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( settingsDt ),
            columnObj,
            column_number_filter,
            null_checked,
            exclude_checked;

        if ( table_selector_jq_friendly_local !== current_table_selector_jq_friendly: string ) {
          return true;
        }
        columnObj = getOptions( settingsDt.oInstance.selector )[ col_num ];

        column_number_filter = calcColumnNumberFilter( settingsDt, col_num, table_selector_jq_friendly );

        let fixedPrefix = '';
        if ( settingsDt._fixedHeader !== undefined && $( '.fixedHeader-floating' ).is( ':visible' ) ) {
          fixedPrefix = '.fixedHeader-floating ';
        }
        if ( columnObj.filters_position === 'tfoot' && settingsDt.nScrollFoot ) {
          fixedPrefix = `.${settingsDt.nScrollFoot.className} `;
        }

        null_checked = $( fixedPrefix + `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${col_num}` ).find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked' );
        null_checked = isSelect ? ( $( `#yadcf-filter-${table_selector_jq_friendly}-${col_num}` ).find( 'option:selected' ).val().trim() === columnObj.select_null_option ) : null_checked;

        if ( !null_checked ) {
          return true;
        }
        if ( columnObj.exclude ) {
          exclude_checked = $( fixedPrefix + `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${col_num}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
        }
        if ( rowData !== undefined ) {
          // support dt render fn, usecase structured data when top is null inner property will return undefined
          // e.g data = person.cat.name && person.cat = null
          let rowDataRender;
          if ( columnObj.column_number_render ) {
            rowDataRender = $.extend( true, [], rowData );
            let index = columnObj.column_number_data ? columnObj.column_number_data : column_number_filter;
            let meta = {
              row: iDataIndex,
              col: columnObj.column_number,
              settings: settingsDt
            };
            if ( typeof index === 'string' && typeof rowDataRender === 'object' ) {
              let cellDataRender = columnObj.column_number_render( getProp( rowDataRender, index ), 'filter', rowData, meta );
              setProp( rowDataRender, index, ( cellDataRender !== undefined ) ? cellDataRender : getProp( rowData, index ) );
            } else {
              let cellDataRender = columnObj.column_number_render( rowDataRender[ index ], 'filter', rowData, meta );
              rowDataRender[ index ] = ( cellDataRender !== undefined ) ? cellDataRender : rowData[ index ];
            }
          }
          aData = rowDataRender ? rowDataRender : rowData;
          if ( columnObj.column_number_data !== undefined ) {
            column_number_filter = columnObj.column_number_data;
            val = getProp( aData, column_number_filter );
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

  function addRangeNumberFilter( filter_selector_string, table_selector_jq_friendly: string, column_number: number, filter_reset_button_text, filter_default_label, ignore_char ) {
    let fromId = `yadcf-filter-${table_selector_jq_friendly}-from-${column_number}`,
      toId = `yadcf-filter-${table_selector_jq_friendly}-to-${column_number}`,
      filter_selector_string_tmp,
      filter_wrapper_id,
      oTable,
      columnObj,
      filterActionFn,
      null_str,
      exclude_str;

    filter_wrapper_id = `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}`;

    if ( $( '#' + filter_wrapper_id ).length > 0 ) {
      return;
    }
    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
    oTable = oTables[ table_selector_jq_friendly ];
    columnObj = getOptions( oTable.selector )[ column_number ];

    //add a wrapper to hold both filter and reset button
    $( filter_selector_string ).append( makeElement( '<div>', {
      onmousedown: yadcf.stopPropagation,
      onclick: yadcf.stopPropagation,
      id: filter_wrapper_id,
      class: 'yadcf-filter-wrapper ' + columnObj.style_class
    } ) );
    filter_selector_string += ' div.yadcf-filter-wrapper';
    filter_selector_string_tmp = filter_selector_string;


    $( filter_selector_string ).append( makeElement( '<div>', {
      id: `yadcf-filter-wrapper-inner-${table_selector_jq_friendly}-${column_number}`,
      class: `yadcf-filter-wrapper-inner-${table_selector_jq_friendly}-${column_number}`
    } ) );
    filter_selector_string += ' div.yadcf-filter-wrapper-inner';

    filterActionFn = function( tableSel ) {
      return function( event ) {
        yadcf.rangeNumberKeyUP( tableSel, event );
      };
    }( table_selector_jq_friendly );
    if ( columnObj.externally_triggered === true ) {
      filterActionFn = function() {};
    }

    $( filter_selector_string ).append( makeElement( '<input>', {
      onkeydown: yadcf.preventDefaultForEnter,
      placeholder: filter_default_label[ 0 ],
      id: fromId,
      class: 'yadcf-filter-range-number yadcf-filter-range',
      onkeyup: filterActionFn
    } ) );
    $( filter_selector_string ).append( makeElement( '<span>', {
      class: 'yadcf-filter-range-number-seperator'
    } ) );
    $( filter_selector_string ).append( makeElement( '<input>', {
      onkeydown: yadcf.preventDefaultForEnter,
      placeholder: filter_default_label[ 1 ],
      id: toId,
      class: 'yadcf-filter-range-number yadcf-filter-range',
      onkeyup: filterActionFn
    } ) );

    if ( filter_reset_button_text !== false ) {
      $( filter_selector_string_tmp ).append( makeElement( '<button>', {
        type: 'button',
        id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}-reset`,
        onmousedown: yadcf.stopPropagation,
        onclick: function( colNo, tableSel ) {
          return function( event ) {
            yadcf.stopPropagation( event );
            yadcf.rangeClear( tableSel, event, colNo );
            return false;
          };
        }( column_number, table_selector_jq_friendly ),
        class: `yadcf-filter-reset-button ${columnObj.reset_button_style_class}`,
        text: filter_reset_button_text
      } ) );
    }

    if ( columnObj.externally_triggered_checkboxes_text && typeof columnObj.externally_triggered_checkboxes_function === 'function' ) {
      $( filter_selector_string_tmp ).append( makeElement( '<button>', {
        type: 'button',
        id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}-externally_triggered_checkboxes-button`,
        onmousedown: yadcf.stopPropagation,
        onclick: yadcf.stopPropagation,
        class: `yadcf-filter-externally_triggered_checkboxes-button ${columnObj.externally_triggered_checkboxes_button_style_class}`,
        text: columnObj.externally_triggered_checkboxes_text
      } ) );
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}-externally_triggered_checkboxes-button` ).on( 'click', columnObj.externally_triggered_checkboxes_function );
    }

    exclude_str = $();
    if ( columnObj.exclude === true ) {
      if ( columnObj.externally_triggered !== true ) {
        exclude_str = makeElement( '<div>', {
          class: 'yadcf-exclude-wrapper',
          onmousedown: yadcf.stopPropagation,
          onclick: yadcf.stopPropagation
        } ).append( makeElement( '<span>', {
          class: 'yadcf-label small',
          text: columnObj.exclude_label
        } ) ).append( makeElement( '<input>', {
          type: 'checkbox',
          title: columnObj.exclude_label,
          onclick: function( tableSel ) {
            return function( event ) {
              yadcf.stopPropagation( event );
              yadcf.rangeNumberKeyUP( tableSel, event );
            };
          }( table_selector_jq_friendly )
        } ) );
      } else {
        exclude_str = makeElement( '<div>', {
          class: 'yadcf-exclude-wrapper',
          onmousedown: yadcf.stopPropagation,
          onclick: yadcf.stopPropagation
        } ).append( makeElement( '<span>', {
          class: 'yadcf-label small',
          text: columnObj.exclude_label
        } ) ).append( makeElement( '<input>', {
          type: 'checkbox',
          title: columnObj.exclude_label,
          onclick: yadcf.stopPropagation
        } ) );
      }
    }

    null_str = $();
    if ( columnObj.null_check_box === true ) {
      null_str = makeElement( '<div>', {
        class: 'yadcf-null-wrapper',
        onmousedown: yadcf.stopPropagation,
        onclick: yadcf.stopPropagation
      } ).append( makeElement( '<spam>', {
        class: 'yadcf-label small',
        text: columnObj.null_label
      } ) ).append( makeElement( '<input>', {
        type: 'checkbox',
        title: columnObj.null_label,
        onclick: function( colNo, tableSel ) {
          return function( event ) {
            yadcf.stopPropagation( event );
            yadcf.nullChecked( event, tableSel, colNo );
          };
        }( column_number, table_selector_jq_friendly )
      } ) );
      if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
        addNullFilterCapability( table_selector_jq_friendly, column_number: number, false );
      }
    }

    if ( columnObj.checkbox_position_after ) {
      exclude_str.addClass( 'after' );
      null_str.addClass( 'after' );
      $( filter_selector_string_tmp ).append( exclude_str, null_str );
    } else {
      $( filter_selector_string ).before( exclude_str, null_str );
    }
    // hide on load
    if ( columnObj.externally_triggered_checkboxes_text && typeof columnObj.externally_triggered_checkboxes_function === 'function' ) {
      let sel = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` );
      sel.find( '.yadcf-exclude-wrapper' ).hide();
      sel.find( '.yadcf-null-wrapper' ).hide();
    }

    if ( oTable.fnSettings().oFeatures.bStateSave === true && oTable.fnSettings().oLoadedState ) {
      if ( oTable.fnSettings().oLoadedState.yadcfState && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
        let exclude_checked = false;
        let null_checked = false;
        if ( columnObj.null_check_box ) {
          null_checked = oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].null_checked;
          $( '#' + filter_wrapper_id ).find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked', null_checked );
          if ( columnObj.exclude ) {
            exclude_checked = oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].exclude_checked;
            $( '#' + filter_wrapper_id ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked', exclude_checked );
          }
        }

        if ( null_checked ) {
          $( '#' + fromId ).prop( 'disabled', true );
          $( '#' + toId ).prop( 'disabled', true );
        } else {
          let inuseClass = exclude_checked ? ' inuse inuse-exclude' : ' inuse ';
          if ( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from ) {
            $( '#' + fromId ).val( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from );
            if ( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from !== '' ) {
              $( '#' + fromId ).addClass( inuseClass );
            }
          }
          if ( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to ) {
            $( '#' + toId ).val( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to );
            if ( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to !== '' ) {
              $( '#' + toId ).addClass( inuseClass );
            }
          }
        }
      }
    }
    resetIApiIndex();

    if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
      addRangeNumberAndSliderFilterCapability( table_selector_jq_friendly, fromId, toId, column_number: number, ignore_char );
    }
  }

  function dateSelectSingle( pDate, pEvent, clear ) {
    let oTable,
      date,
      event,
      column_number,
      dashIndex,
      table_selector_jq_friendly,
      column_number_filter,
      settingsDt,
      columnObj,
      yadcfState;

    if ( pDate ) {
      if ( pDate.type === 'dp' ) {
        event = pDate.target;
      } else if ( pDate.type === 'changeDate' ) {
        event = pDate.currentTarget;
      } else if ( $( clear ).length === 1 ) { // dt-datetime
        date = pDate;
        event = clear;
        clear = undefined;
      } else {
        date = pDate;
        event = pEvent;
      }
    }

    column_number = $( event ).attr( 'id' ).replace( 'yadcf-filter-', '' ).replace( '-date', '' ).replace( '-reset', '' );
    dashIndex = column_number.lastIndexOf( '-' );
    table_selector_jq_friendly = column_number.substring( 0, dashIndex );

    column_number = column_number.substring( dashIndex + 1 );
    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
    oTable = oTables[ table_selector_jq_friendly ];
    settingsDt = getSettingsObjFromTable( oTable );
    columnObj = getOptions( oTable.selector )[ column_number ];

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

    column_number_filter = calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly );

    if ( clear === undefined ) {
      if ( columnObj.filter_type !== 'date_custom_func' ) {
        oTable.fnFilter( date, column_number_filter );
      } else {
        doFilterCustomDateFunc( { value: date }, table_selector_jq_friendly: string, column_number );
      }
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );
    } else if ( clear === 'clear' ) {
      if ( exGetColumnFilterVal( oTable, column_number ) === '' ) {
        return;
      }
      if ( columnObj.filter_type === 'date_custom_func' ) {
        //handle state saving
        if ( oTable.fnSettings().oFeatures.bStateSave === true && oTable.fnSettings().oLoadedState ) {
          if ( !oTable.fnSettings().oLoadedState ) {
            oTable.fnSettings().oLoadedState = {};
            oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
          }
          if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
            if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
              oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
                from: ''
              };
            } else {
              yadcfState = {};
              yadcfState[ table_selector_jq_friendly ] = [];
              yadcfState[ table_selector_jq_friendly ][ column_number ] = {
                from: ''
              };
              oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
            }
            oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
          }
        }
      }
      if ( columnObj.datepicker_type === 'daterangepicker' && oTable.fnSettings().oFeatures.bServerSide !== true ) {
        rangeClear( table_selector_jq_friendly, event, column_number );
      } else {
        if ( columnObj.filter_type !== 'date_custom_func' ) {
          oTable.fnFilter( '', column_number_filter );
        } else {
          $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' );
          doFilterCustomDateFunc( { value: date }, table_selector_jq_friendly: string, column_number );
        }
      }
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' ).removeClass( 'inuse' );
      if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
        $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).datepicker( 'update' );
      }
    }

    resetIApiIndex();
  }

  function dateSelect( pDate, pEvent ) {
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

    column_number = $( event ).attr( 'id' ).replace( 'yadcf-filter-', '' ).replace( '-from-date', '' ).replace( '-to-date', '' );
    dashIndex = column_number.lastIndexOf( '-' );
    table_selector_jq_friendly = column_number.substring( 0, dashIndex );

    column_number = column_number.substring( dashIndex + 1 );


    oTable = oTables[ table_selector_jq_friendly ];
    settingsDt = getSettingsObjFromTable( oTable );
    column_number_filter = calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly );

    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];

    columnObj = getOptions( oTable.selector )[ column_number ];

    if ( pDate.type === 'dp' ) {
      event = pDate.target;
      if ( pDate.date === false || !moment( $( event ).val(), columnObj.date_format ).isValid() ) {
        $( event ).removeClass( 'inuse' );
        $( event ).data( 'DateTimePicker' ).minDate( false );
      } else {
        $( event ).addClass( 'inuse' );
      }
      $( event ).trigger( 'blur' );
    } else if ( pDate.type === 'changeDate' ) {
      if ( pDate.date !== undefined ) {
        $( event ).addClass( 'inuse' );
      } else {
        $( event ).removeClass( 'inuse' );
      }
    } else {
      $( event ).addClass( 'inuse' );
    }
    if ( pDate.namespace === 'daterangepicker' ) {
      from = moment( pEvent.startDate ).format( columnObj.date_format );
      to = moment( pEvent.endDate ).format( columnObj.date_format );
    } else {
      if ( $( event ).attr( 'id' ).indexOf( '-from-' ) !== -1 ) {
        from = document.getElementById( $( event ).attr( 'id' ) ).value;
        to = document.getElementById( $( event ).attr( 'id' ).replace( '-from-', '-to-' ) ).value;
      } else {
        to = document.getElementById( $( event ).attr( 'id' ) ).value;
        from = document.getElementById( $( event ).attr( 'id' ).replace( '-to-', '-from-' ) ).value;
      }
    }

    keyUp = function() {
      if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
        oTable.fnDraw();
      } else {
        oTable.fnFilter( from + columnObj.custom_range_delimiter + to, column_number_filter );
      }

      if ( !oTable.fnSettings().oLoadedState ) {
        oTable.fnSettings().oLoadedState = {};
        oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
      }
      if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
        if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
          oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
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
          oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
        }
        oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
      }
      if ( from !== '' || to !== '' ) {
        $( '#' + event.id ).addClass( 'inuse' );
      }
      resetIApiIndex();
    };
    if ( columnObj.filter_delay === undefined ) {
      keyUp();
    } else {
      yadcfDelay( function() {
        keyUp();
      }, columnObj.filter_delay );
    }
  }

  function addRangeDateFilter( filter_selector_string, table_selector_jq_friendly: string, column_number: number, filter_reset_button_text, filter_default_label, date_format ) {
    let fromId = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`,
      toId = `yadcf-filter-${table_selector_jq_friendly}-to-date-${column_number}`,
      filter_selector_string_tmp,
      filter_wrapper_id,
      oTable,
      columnObj,
      datepickerObj = {},
      filterActionFn,
      $fromInput,
      $toInput,
      innerWrapperAdditionalClass = '';

    filter_wrapper_id = 'yadcf-filter-wrapper-' + table_selector_jq_friendly + '-' + column_number;

    if ( $( '#' + filter_wrapper_id ).length > 0 ) {
      return;
    }
    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
    oTable = oTables[ table_selector_jq_friendly ];
    columnObj = getOptions( oTable.selector )[ column_number ];
    if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      innerWrapperAdditionalClass = 'input-daterange';
    }
    //add a wrapper to hold both filter and reset button
    $( filter_selector_string ).append( makeElement( '<div>', {
      onmousedown: yadcf.stopPropagation,
      onclick: yadcf.stopPropagation,
      id: filter_wrapper_id,
      class: 'yadcf-filter-wrapper'
    } ) );
    filter_selector_string += ' div.yadcf-filter-wrapper';
    filter_selector_string_tmp = filter_selector_string;

    $( filter_selector_string ).append( makeElement( '<div>', {
      id: 'yadcf-filter-wrapper-inner-' + table_selector_jq_friendly + '-' + column_number,
      class: 'yadcf-filter-wrapper-inner ' + innerWrapperAdditionalClass
    } ) );
    filter_selector_string += ' div.yadcf-filter-wrapper-inner';

    filterActionFn = function( tableSel ) {
      return function( event ) {
        yadcf.rangeDateKeyUP( tableSel, date_format, event );
      };
    }( table_selector_jq_friendly );
    if ( columnObj.externally_triggered === true ) {
      filterActionFn = function() {};
    }

    $( filter_selector_string ).append( makeElement( '<input>', {
      onkeydown: yadcf.preventDefaultForEnter,
      placeholder: filter_default_label[ 0 ],
      id: fromId,
      class: 'yadcf-filter-range-date yadcf-filter-range yadcf-filter-range-start ' + columnObj.style_class,
      onkeyup: filterActionFn
    } ) );
    $( filter_selector_string ).append( makeElement( '<span>', {
      class: 'yadcf-filter-range-date-seperator'
    } ) );
    $( filter_selector_string ).append( makeElement( '<input>', {
      onkeydown: yadcf.preventDefaultForEnter,
      placeholder: filter_default_label[ 1 ],
      id: toId,
      class: 'yadcf-filter-range-date yadcf-filter-range yadcf-filter-range-end ' + columnObj.style_class,
      onkeyup: filterActionFn
    } ) );

    $fromInput = $( '#' + fromId );
    $toInput = $( '#' + toId );

    if ( filter_reset_button_text !== false ) {
      $( filter_selector_string_tmp ).append( makeElement( '<button>', {
        type: 'button',
        onmousedown: yadcf.stopPropagation,
        onclick: function( colNo, tableSel ) {
          return function( event ) {
            yadcf.stopPropagation( event );
            yadcf.rangeClear( tableSel, event, colNo );
            return false;
          };
        }( column_number, table_selector_jq_friendly ),
        class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
        text: filter_reset_button_text
      } ) );
    }

    if ( columnObj.datepicker_type === 'jquery-ui' ) {
      datepickerObj.dateFormat = date_format;
    } else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' ) {
      datepickerObj.format = date_format;
    }

    if ( columnObj.externally_triggered !== true ) {
      if ( columnObj.datepicker_type === 'jquery-ui' ) {
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
        onClose: function( selectedDate ) {
          $toInput.datepicker( 'option', 'minDate', selectedDate );
        }
      } ) );
      $toInput.datepicker( $.extend( datepickerObj, {
        onClose: function( selectedDate ) {
          $fromInput.datepicker( 'option', 'maxDate', selectedDate );
        }
      } ) );
    } else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' ) {
      datepickerObj.useCurrent = false;
      $fromInput.datetimepicker( datepickerObj );
      $toInput.datetimepicker( datepickerObj );
      if ( columnObj.externally_triggered !== true ) {
        $fromInput.add( $toInput ).on( 'dp.hide', dateSelect );
      }
    } else if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      if ( date_format ) {
        $.extend( datepickerObj, { format: date_format });
      }
      $fromInput.datepicker( datepickerObj ).on( 'changeDate', function( e ) {
        dateSelect( e );
        $( this ).datepicker( 'hide' );
      });
      $toInput.datepicker( datepickerObj ).on( 'changeDate', function( e ) {
        dateSelect( e );
        $( this ).datepicker( 'hide' );
      });
    }

    if ( oTable.fnSettings().oFeatures.bStateSave === true && oTable.fnSettings().oLoadedState ) {
      if ( oTable.fnSettings().oLoadedState.yadcfState && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
        $( '#' + fromId ).val( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from );
        if ( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from !== '' ) {
          $( '#' + fromId ).addClass( 'inuse' );
        }
        $( '#' + toId ).val( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to );
        if ( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to !== '' ) {
          $( '#' + toId ).addClass( 'inuse' );
        }
      }
    }

    if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
      addRangeDateFilterCapability( table_selector_jq_friendly, fromId, toId, column_number: number, date_format );
    }

    resetIApiIndex();
  }

  function addDateFilter( filter_selector_string, table_selector_jq_friendly: string, column_number: number, filter_reset_button_text, filter_default_label, date_format ) {
    let dateId = `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
      filter_selector_string_tmp,
      filter_wrapper_id,
      oTable,
      columnObj,
      datepickerObj = {},
      filterActionFn,
      settingsDt;

    filter_wrapper_id = 'yadcf-filter-wrapper-' + table_selector_jq_friendly + '-' + column_number;

    if ( $( '#' + filter_wrapper_id ).length > 0 ) {
      return;
    }
    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
    oTable = oTables[ table_selector_jq_friendly ];
    columnObj = getOptions( oTable.selector )[ column_number ];

    //add a wrapper to hold both filter and reset button
    $( filter_selector_string ).append( makeElement( '<div>', {
      onmousedown: yadcf.stopPropagation,
      onclick: yadcf.stopPropagation,
      id: filter_wrapper_id,
      class: 'yadcf-filter-wrapper'
    } ) );
    filter_selector_string += ' div.yadcf-filter-wrapper';
    filter_selector_string_tmp = filter_selector_string;

    filterActionFn = function( tableSel ) {
      return function( event ) {
        yadcf.dateKeyUP( table_selector_jq_friendly, date_format, event );
      };
    }( table_selector_jq_friendly );
    if ( columnObj.externally_triggered === true ) {
      filterActionFn = function() {};
    }

    $( filter_selector_string ).append( makeElement( '<input>', {
      onkeydown: yadcf.preventDefaultForEnter,
      placeholder: filter_default_label,
      id: dateId,
      class: 'yadcf-filter-date ' + columnObj.style_class,
      onkeyup: filterActionFn
    } ) );

    if ( filter_reset_button_text !== false ) {
      $( filter_selector_string_tmp ).append( makeElement( '<button>', {
        type: 'button',
        id: dateId + '-reset',
        onmousedown: yadcf.stopPropagation,
        onclick: function( tableSel ) {
          return function( event ) {
            yadcf.stopPropagation( event );
            yadcf.dateSelectSingle( tableSel, yadcf.eventTargetFixUp( event ).target, 'clear' );
            return false;
          };
        }( table_selector_jq_friendly ),
        class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
        text: filter_reset_button_text
      } ) );
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
      $( '#' + dateId ).datepicker( datepickerObj );
    } else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' ) {
      datepickerObj.useCurrent = false;
      $( '#' + dateId ).datetimepicker( datepickerObj );
      if ( columnObj.externally_triggered !== true ) {
        if ( datepickerObj.format.toLowerCase() !== 'hh:mm' ) {
          $( '#' + dateId ).on( 'dp.change', dateSelectSingle );
        } else {
          $( '#' + dateId ).on( 'dp.hide', dateSelectSingle );
        }
      }
    } else if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      $( '#' + dateId ).datepicker( datepickerObj ).on( 'changeDate', function( e ) {
        dateSelectSingle( e );
        $( this ).datepicker( 'hide' );
      });
    } else if ( columnObj.datepicker_type === 'dt-datetime' ) {
      new $.fn.DataTable.Editor.DateTime(
        $( '#' + dateId ), {
          format: date_format,
          onChange: dateSelectSingle
        }
      );
    } else if ( columnObj.datepicker_type === 'daterangepicker' ) {
      $( '#' + dateId ).daterangepicker( datepickerObj );
      $( '#' + dateId ).on( 'apply.daterangepicker, hide.daterangepicker', function( ev, picker ) {
        dateSelect( ev, picker );
      });
    }

    if ( oTable.fnSettings().aoPreSearchCols[ column_number ].sSearch !== '' ) {
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( oTable.fnSettings().aoPreSearchCols[ column_number ].sSearch ).addClass( 'inuse' );
    }

    if ( columnObj.filter_type === 'date_custom_func' ) {
      settingsDt = getSettingsObjFromTable( oTable );

      if ( oTable.fnSettings().oFeatures.bStateSave === true && oTable.fnSettings().oLoadedState ) {
        if ( oTable.fnSettings().oLoadedState.yadcfState && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
          $( '#' + dateId ).val( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from );
          if ( oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from !== '' ) {
            $( '#' + dateId ).addClass( 'inuse' );
          }
        }
      }

      if ( settingsDt.oFeatures.bServerSide !== true ) {
        addCustomFunctionFilterCapability( table_selector_jq_friendly, `yadcf-filter-${table_selector_jq_friendly}-${column_number}`, column_number );
      }
    }

    if ( columnObj.datepicker_type === 'daterangepicker' && oTable.fnSettings().oFeatures.bServerSide !== true ) {
      addRangeDateFilterCapability( table_selector_jq_friendly, dateId, dateId, column_number: number, date_format );
    }

    resetIApiIndex();
  }

  function rangeNumberSldierDrawTips( min_tip_val, max_tip_val, min_tip_id, max_tip_id, table_selector_jq_friendly: string, column_number: number ) {
    let first_handle = $( '.yadcf-number-slider-filter-wrapper-inner.-' + table_selector_jq_friendly + '-' + column_number ), // + ' .ui-slider-handle:first'),
      last_handle = $( '.yadcf-number-slider-filter-wrapper-inner.-' + table_selector_jq_friendly + '-' + column_number ), // + ' .ui-slider-handle:last'),
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
      first_handle = $( '.yadcf-number-slider-filter-wrapper-inner.-' + table_selector_jq_friendly + '-' + column_number + ' .ui-slider-handle:first' );
      $( first_handle ).addClass( 'yadcf-filter-range-number-slider-min-tip' ).html( min_tip_inner );

      last_handle = $( '.yadcf-number-slider-filter-wrapper-inner.-' + table_selector_jq_friendly + '-' + column_number + ' .ui-slider-handle:last' );
      $( last_handle ).addClass( 'yadcf-filter-range-number-slider-max-tip' ).html( max_tip_inner );
    } else {
      //might happen when scrollX is used or when filter row is being duplicated by DT
      $( $( first_handle )[ 0 ] ).find( '.ui-slider-handle:first' ).addClass( 'yadcf-filter-range-number-slider-min-tip' ).html( min_tip_inner );
      $( $( last_handle )[ 0 ] ).find( '.ui-slider-handle:last' ).addClass( 'yadcf-filter-range-number-slider-max-tip' ).html( max_tip_inner );

      $( $( first_handle )[ 1 ] ).find( '.ui-slider-handle:first' ).addClass( 'yadcf-filter-range-number-slider-min-tip' ).html( min_tip_inner );
      $( $( last_handle )[ 1 ] ).find( '.ui-slider-handle:last' ).addClass( 'yadcf-filter-range-number-slider-max-tip' ).html( max_tip_inner );
    }
  }

  function rangeNumberSliderChange( table_selector_jq_friendly, event, ui ) {
    let oTable,
      min_val,
      max_val,
      slider_inuse,
      yadcfState,
      column_number,
      columnObj,
      keyUp,
      settingsDt,
      column_number_filter;

    event = eventTargetFixUp( event );
    column_number = $( event.target ).attr( 'id' ).replace( 'yadcf-filter-', '' ).replace( table_selector_jq_friendly, '' ).replace( '-slider-', '' );

    oTable = oTables[ table_selector_jq_friendly ];
    settingsDt = getSettingsObjFromTable( oTable );
    column_number_filter = calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly );

    columnObj = getOptions( oTable.selector )[ column_number ];

    keyUp = function() {

      $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];

      if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
        oTable.fnDraw();
      } else {
        oTable.fnFilter( ui.values[ 0 ] + columnObj.custom_range_delimiter + ui.values[ 1 ], column_number_filter );
      }
      min_val = +$( $( event.target ).parent().find( '.yadcf-filter-range-number-slider-min-tip-hidden' ) ).text();
      max_val = +$( $( event.target ).parent().find( '.yadcf-filter-range-number-slider-max-tip-hidden' ) ).text();

      if ( min_val !== ui.values[ 0 ] ) {
        $( $( event.target ).find( '.ui-slider-handle' )[ 0 ] ).addClass( 'inuse' );
        slider_inuse = true;
      } else {
        $( $( event.target ).find( '.ui-slider-handle' )[ 0 ] ).removeClass( 'inuse' );
      }
      if ( max_val !== ui.values[ 1 ] ) {
        $( $( event.target ).find( '.ui-slider-handle' )[ 1 ] ).addClass( 'inuse' );
        slider_inuse = true;
      } else {
        $( $( event.target ).find( '.ui-slider-handle' )[ 1 ] ).removeClass( 'inuse' );
      }

      if ( slider_inuse === true ) {
        $( event.target ).find( '.ui-slider-range' ).addClass( 'inuse' );
      } else {
        $( event.target ).find( '.ui-slider-range' ).removeClass( 'inuse' );
      }

      if ( !oTable.fnSettings().oLoadedState ) {
        oTable.fnSettings().oLoadedState = {};
        oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
      }
      if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
        if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
          oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
            from: ui.values[ 0 ],
            to: ui.values[ 1 ]
          };
        } else {
          yadcfState = {};
          yadcfState[ table_selector_jq_friendly ] = [];
          yadcfState[ table_selector_jq_friendly ][ column_number ] = {
            from: ui.values[ 0 ],
            to: ui.values[ 1 ]
          };
          oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
        }
        oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
      }

      resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      keyUp();
    } else {
      yadcfDelay( function() {
        keyUp();
      }, columnObj.filter_delay );
    }
  }

  function addRangeNumberSliderFilter( filter_selector_string, table_selector_jq_friendly: string, column_number: number, filter_reset_button_text, min_val, max_val, ignore_char ) {
    let sliderId = `yadcf-filter-${table_selector_jq_friendly}-slider-${column_number}`,
      min_tip_id = `yadcf-filter-${table_selector_jq_friendly}-min_tip-${column_number}`,
      max_tip_id = `yadcf-filter-${table_selector_jq_friendly}-max_tip-${column_number}`,
      filter_selector_string_tmp,
      filter_wrapper_id,
      oTable,
      min_state_val = min_val,
      max_state_val = max_val,
      columnObj,
      slideFunc,
      changeFunc,
      sliderObj,
      sliderMaxMin = {
        min: min_val,
        max: max_val
      },
      settingsDt,
      // currSliderMin = $( '#' + sliderId ).slider( 'option', 'min' ),
      // currSliderMax = $( '#' + sliderId ).slider( 'option', 'max' ),
      redrawTable;

    filter_wrapper_id = 'yadcf-filter-wrapper-' + table_selector_jq_friendly + '-' + column_number;

    if ( $( '#' + filter_wrapper_id ).length > 0 && ( currSliderMin === min_val && currSliderMax === max_val ) ) {
      return;
    }

    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
    oTable = oTables[ table_selector_jq_friendly ];
    settingsDt = settingsMap[ generateTableSelectorJQFriendly2( oTable ) ];

    if ( $( '#' + filter_wrapper_id ).length > 0 ) {
      // $( '#' + sliderId ).slider( 'destroy' );
      $( '#' + filter_wrapper_id ).remove();
      redrawTable = true;
    }

    columnObj = getOptions( oTable.selector )[ column_number ];

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

    if ( isFinite( min_val ) && isFinite( max_val ) && isFinite( min_state_val ) && isFinite( max_state_val ) ) {

      //add a wrapper to hold both filter and reset button
      $( filter_selector_string ).append( makeElement( '<div>', {
        onmousedown: yadcf.stopPropagation,
        onclick: yadcf.stopPropagation,
        id: filter_wrapper_id,
        class: 'yadcf-filter-wrapper ' + columnObj.style_class
      } ) );
      filter_selector_string += ' div.yadcf-filter-wrapper';
      filter_selector_string_tmp = filter_selector_string;

      $( filter_selector_string ).append( makeElement( '<div>', {
        id: 'yadcf-filter-wrapper-inner-' + table_selector_jq_friendly + '-' + column_number,
        class: 'yadcf-number-slider-filter-wrapper-inner' + ' -' + table_selector_jq_friendly + '-' + column_number
      } ) );
      filter_selector_string += ' div.yadcf-number-slider-filter-wrapper-inner';

      $( filter_selector_string ).append( makeElement( '<div>', {
        id: sliderId,
        class: 'yadcf-filter-range-number-slider'
      } ) );
      filter_selector_string += ' #' + sliderId;

      $( filter_selector_string ).append( makeElement( '<span>', {
        class: 'yadcf-filter-range-number-slider-min-tip-hidden hide',
        text: min_val
      } ) );
      $( filter_selector_string ).append( makeElement( '<span>', {
        class: 'yadcf-filter-range-number-slider-max-tip-hidden hide',
        text: max_val
      } ) );

      if ( columnObj.externally_triggered !== true ) {
        slideFunc = function( event, ui ) {
          rangeNumberSldierDrawTips( ui.values[ 0 ], ui.values[ 1 ], min_tip_id, max_tip_id, table_selector_jq_friendly: string, column_number );
          rangeNumberSliderChange( table_selector_jq_friendly, event, ui );
        };
        changeFunc = function( event, ui ) {
          rangeNumberSldierDrawTips( ui.values[ 0 ], ui.values[ 1 ], min_tip_id, max_tip_id, table_selector_jq_friendly: string, column_number );
          // if ( event.originalEvent || $( event.target ).slider( 'option', 'yadcf-reset' ) === true ) {
            // $( event.target ).slider( 'option', 'yadcf-reset', false );
            rangeNumberSliderChange( table_selector_jq_friendly, event, ui );
          }
        };
      } else {
        slideFunc = function( event, ui ) {
          rangeNumberSldierDrawTips( ui.values[ 0 ], ui.values[ 1 ], min_tip_id, max_tip_id, table_selector_jq_friendly: string, column_number );
        };
        changeFunc = function( event, ui ) {
          rangeNumberSldierDrawTips( ui.values[ 0 ], ui.values[ 1 ], min_tip_id, max_tip_id, table_selector_jq_friendly: string, column_number );
        };
      }
      sliderObj = {
        range: true,
        min: min_val,
        max: max_val,
        values: [ min_state_val, max_state_val ],
        create: function( event, ui ) {
          rangeNumberSldierDrawTips( min_state_val, max_state_val, min_tip_id, max_tip_id, table_selector_jq_friendly: string, column_number );
        },
        slide: slideFunc,
        change: changeFunc
      };

      if ( columnObj.filter_plugin_options !== undefined ) {
        $.extend( sliderObj, columnObj.filter_plugin_options );
      }

      // $( '#' + sliderId ).slider( sliderObj );

      if ( filter_reset_button_text !== false ) {
        $( filter_selector_string_tmp ).append( makeElement( '<button>', {
          type: 'button',
          onmousedown: yadcf.stopPropagation,
          onclick: function( tableSel ) {
            return function( event ) {
              yadcf.stopPropagation( event );
              yadcf.rangeNumberSliderClear( tableSel, event );
              return false;
            };
          }( table_selector_jq_friendly ),
          class: 'yadcf-filter-reset-button range-number-slider-reset-button ' + columnObj.reset_button_style_class,
          text: filter_reset_button_text
        } ) );
      }
    }

    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
    oTable = oTables[ table_selector_jq_friendly ];
    if ( settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState ) {
      if ( settingsDt.oLoadedState.yadcfState && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
        if ( isFinite( min_val ) && min_val !== settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from ) {
          $( $( filter_selector_string ).find( '.ui-slider-handle' )[ 0 ] ).addClass( 'inuse' );
        }
        if ( isFinite( max_val ) && max_val !== settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to ) {
          $( $( filter_selector_string ).find( '.ui-slider-handle' )[ 1 ] ).addClass( 'inuse' );
        }
        if ( ( isFinite( min_val ) && isFinite( max_val ) ) && ( min_val !== settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from || max_val !== settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].to ) ) {
          $( $( filter_selector_string ).find( '.ui-slider-range' ) ).addClass( 'inuse' );
        }
      }
    }
    resetIApiIndex();

    if ( settingsDt.oFeatures.bServerSide !== true ) {
      addRangeNumberAndSliderFilterCapability( table_selector_jq_friendly, min_tip_id, max_tip_id, column_number: number, ignore_char, sliderMaxMin );
    }
    if ( redrawTable === true ) {
      oTable.fnDraw( false );
    }
  }

  function destroyThirdPartyPlugins( table_arg ) {

    let tableOptions,
      table_selector_jq_friendly,
      columnObjKey,
      column_number,
      optionsObj,
      fromId,
      toId;

    //check if the table arg is from new datatables API (capital 'D')
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[ 0 ].oInstance;
    }
    tableOptions = getOptions( table_arg.selector );
    table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( table_arg );

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
                if ( selectElementCustomDestroyFunc !== undefined ) {
                  selectElementCustomDestroyFunc( $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ) );
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
                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).destroy();
                break;
            }
            break;
          case 'range_date':
            fromId = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`;
            toId = `yadcf-filter-${table_selector_jq_friendly}-to-date-${column_number}`;
            switch ( optionsObj.select_type ) {
              case 'jquery-ui':
                $( '#' + fromId ).datepicker( 'destroy' );
                $( '#' + toId ).datepicker( 'destroy' );
                break;
              case 'bootstrap-datetimepicker':
                $( '#' + fromId ).destroy();
                $( '#' + toId ).destroy();
                break;
            }
            break;
          case 'range_number_slider':
            // $( '#yadcf-filter-' + table_selector_jq_friendly + '-slider-' + column_number ).slider( 'destroy' );
            break;
        }
      }
    }
  }

  function removeFilters( oTable ) {
    let tableId = getTableId( oTable );
    $( '#' + tableId + ' .yadcf-filter-wrapper' ).remove();
    if ( yadcfVersionCheck( '1.10' ) ) {
      $( document ).off( 'draw.dt', oTable.selector );
      $( document ).off( 'xhr.dt', oTable.selector );
      $( document ).off( 'column-visibility.dt', oTable.selector );
      $( document ).off( 'destroy.dt', oTable.selector );
      $( document ).off( 'stateLoaded.dt', oTable.selector );
    } else {
      $( document ).off( 'draw', oTable.selector );
      $( document ).off( 'destroy', oTable.selector );
    }
    if ( $.fn.dataTableExt.afnFiltering.length > 0 ) {
      $.fn.dataTableExt.afnFiltering.splice( 0, $.fn.dataTableExt.afnFiltering.length );
    }
    destroyThirdPartyPlugins( oTable );
  }

  /* alphanum.js (C) Brian Huisman
    Based on the Alphanum Algorithm by David Koelle
    The Alphanum Algorithm is discussed at http://www.DaveKoelle.com
  */
  function sortAlphaNum( a, b ) {
    function chunkify( t ) {
      let tz = [];
      let x = 0,
        y = -1,
        n = 0,
        i, j;

      while ( i = ( j = t.charAt( x++ ) ).charCodeAt( 0 ) ) {
        let m = ( i == 46 || ( i >= 48 && i <= 57 ) );
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

    let aa = chunkify( a.toLowerCase() );
    let bb = chunkify( b.toLowerCase() );

    for ( let x = 0; aa[ x ] && bb[ x ]; x++ ) {
      if ( aa[ x ] !== bb[ x ] ) {
        let c = Number( aa[ x ] ),
          d = Number( bb[ x ] );
        if ( c == aa[ x ] && d == bb[ x ] ) {
          return c - d;
        } else return ( aa[ x ] > bb[ x ] ) ? 1 : -1;
      }
    }
    return aa.length - bb.length;
  }

  function sortColumnData( column_data, columnObj ) {
    if ( columnObj.filter_type === 'select' || columnObj.filter_type === 'auto_complete' || columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'multi_select_custom_func' || columnObj.filter_type === 'custom_func' ) {
      if ( columnObj.sort_as === 'alpha' ) {
        if ( columnObj.sort_order === 'asc' ) {
          column_data.sort();
        } else if ( columnObj.sort_order === 'desc' ) {
          column_data.sort();
          column_data.reverse();
        }
      } else if ( columnObj.sort_as === 'num' ) {
        if ( columnObj.sort_order === 'asc' ) {
          column_data.sort( sortNumAsc );
        } else if ( columnObj.sort_order === 'desc' ) {
          column_data.sort( sortNumDesc );
        }
      } else if ( columnObj.sort_as === 'alphaNum' ) {
        if ( columnObj.sort_order === 'asc' ) {
          column_data.sort( sortAlphaNum );
        } else if ( columnObj.sort_order === 'desc' ) {
          column_data.sort( sortAlphaNum );
          column_data.reverse();
        }
      } else if ( columnObj.sort_as === 'custom' ) {
        column_data.sort( columnObj.sort_as_custom_func );
      }
    }
    return column_data;
  }

  function getFilteredRows( table ) {
    let dataTmp,
      data = [],
      i;
    if ( table.rows ) {
      dataTmp = table.rows( { filter: 'applied' } ).data().toArray();
    } else {
      dataTmp = table._( 'tr', { filter: 'applied' });
    }
    for ( i = 0; i < dataTmp.length; i++ ) {
      data.push( {
        _aData: dataTmp[ i ]
      });
    }
    return data;
  }

  function parseTableColumn( pTable: DataTableInstance, columnObj: ColNum | ColSel, table_selector_jq_friendly: string, pSettings ) {
    let col_filter_array = {},
        column_data = [],
        col_inner_elements,
        col_inner_data,
        col_inner_data_helper,
        j,
        k,
        data,
        data_length,
        settingsDt,
        column_number_filter;

    if ( pSettings !== undefined ) {
      settingsDt = pSettings;
    } else {
      settingsDt = getSettingsObjFromTable( pTable );
    }

    if ( columnObj.cumulative_filtering !== true ) {
      data = settingsDt.aoData;
      data_length = data.length;
    } else {
      data = getFilteredRows( pTable );
      data_length = data.length;
    }

    if ( columnObj.col_filter_array !== undefined ) {
      col_filter_array = columnObj.col_filter_array;
    }

    column_number_filter = calcColumnNumberFilter( settingsDt, columnObj.column_number, table_selector_jq_friendly );

    if ( isNaN( settingsDt.aoColumns[ column_number_filter ].mData ) && typeof settingsDt.aoColumns[ column_number_filter ].mData !== 'object' ) {
      columnObj.column_number_data = settingsDt.aoColumns[ column_number_filter ].mData;
    }

    if ( isNaN( settingsDt.aoColumns[ column_number_filter ].mRender ) && typeof settingsDt.aoColumns[ column_number_filter ].mRender !== 'object' ) {
      columnObj.column_number_render = settingsDt.aoColumns[ column_number_filter ].mRender;
    }

    for ( j = 0; j < data_length; j++ ) {
      if ( columnObj.column_data_type === 'html' ) {
        if ( columnObj.column_number_data === undefined ) {
          col_inner_elements = $( data[ j ]._aData[ column_number_filter ] );
        } else {
          col_inner_elements = dot2obj( data[ j ]._aData, columnObj.column_number_data );
          col_inner_elements = $( col_inner_elements );
        }

        if ( col_inner_elements.length > 0 ) {
          for ( k = 0; k < col_inner_elements.length; k++ ) {
            col_inner_data = null;
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
                {
                  let len = $( col_inner_elements[ k ] ).find( columnObj.html_data_selector ).length;

                  if ( len === 1 ) {
                    col_inner_data = $( col_inner_elements[ k ] ).find( columnObj.html_data_selector ).text();
                  } else if ( len > 1 ) {
                    col_inner_data_helper = $( col_inner_elements[ k ] ).find( columnObj.html_data_selector );
                  }
                  break;
                }
            }

            if ( col_inner_data || col_inner_data_helper ) {
              if ( !col_inner_data_helper ) {
                if ( col_inner_data.trim() !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
                  col_filter_array[ col_inner_data ] = col_inner_data;
                  column_data.push( col_inner_data );
                }
              } else {
                col_inner_data = col_inner_data_helper;
                col_inner_data_helper.each( function( index ) {
                  let elm = $( col_inner_data[ index ] ).text();
                  if ( elm.trim() !== '' && !( col_filter_array.hasOwnProperty( elm ) ) ) {
                    col_filter_array[ elm ] = elm;
                    column_data.push( elm );
                  }
                });
              }
            }
          }
        } else {
          if ( col_inner_elements.selector ) {
            col_inner_data = col_inner_elements.selector;
          } else {
            col_inner_data = data[ j ]._aData[ column_number_filter ];
          }

          if ( col_inner_data.trim() !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
            col_filter_array[ col_inner_data ] = col_inner_data;
            column_data.push( col_inner_data );
          }
        }
      }
      else if ( columnObj.column_data_type === 'text' ) {
        if ( columnObj.text_data_delimiter !== undefined ) {
          if ( columnObj.column_number_data === undefined ) {
            col_inner_elements = data[ j ]._aData[ column_number_filter ].split( columnObj.text_data_delimiter );
          } else {
            col_inner_elements = dot2obj( data[ j ]._aData, columnObj.column_number_data );
            col_inner_elements = ( col_inner_elements + '' ).split( columnObj.text_data_delimiter );
          }

          for ( k = 0; k < col_inner_elements.length; k++ ) {
            col_inner_data = col_inner_elements[ k ];

            if ( col_inner_data.trim() !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
              col_filter_array[ col_inner_data ] = col_inner_data;
              column_data.push( col_inner_data );
            }
          }
        } else {
          if ( columnObj.column_number_data === undefined ) {
            col_inner_data = data[ j ]._aData[ column_number_filter ];
            if ( col_inner_data !== null && typeof col_inner_data === 'object' ) {
              if ( columnObj.html5_data !== undefined ) {
                col_inner_data = col_inner_data[ '@' + columnObj.html5_data ];
              } else if ( col_inner_data && col_inner_data.display ) {
                col_inner_data = col_inner_data.display;
              } else {
                console.log( 'Warning: Looks like you have forgot to define the html5_data attribute for the ' + columnObj.column_number + ' column' );
                return [];
              }
            }
          } else if ( data[ j ]._aFilterData !== undefined && data[ j ]._aFilterData !== null ) {
            col_inner_data = data[ j ]._aFilterData[ column_number_filter ];
          } else {
            col_inner_data = dot2obj( data[ j ]._aData, columnObj.column_number_data );
          }

          if ( col_inner_data.trim() !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
            col_filter_array[ col_inner_data ] = col_inner_data;
            column_data.push( col_inner_data );
          }
        }
      }
      else if ( columnObj.column_data_type === 'rendered_html' ) {
        if ( data[ j ]._aFilterData ) {
          col_inner_elements = data[ j ]._aFilterData[ column_number_filter ];
        } else if ( columnObj.column_data_render ) {
          col_inner_elements = columnObj.column_data_render( data[ j ]._aData );
        } else {
          console.log( `Looks like you missing column_data_render function for the column ${column_number_filter}` );
        }

        if ( typeof col_inner_elements !== 'string' ) {
          col_inner_elements = $( col_inner_elements );
          if ( col_inner_elements.length > 0 ) {
            for ( k = 0; k < col_inner_elements.length; k++ ) {
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
            col_inner_data = col_inner_elements.selector;
          }
        } else {
          col_inner_data = col_inner_elements;
        }

        if ( columnObj.text_data_delimiter !== undefined ) {
          col_inner_elements = col_inner_elements.split( columnObj.text_data_delimiter );
          for ( k = 0; k < col_inner_elements.length; k++ ) {
            col_inner_data = col_inner_elements[ k ];
            if ( col_inner_data.trim() !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
              col_filter_array[ col_inner_data ] = col_inner_data;
              column_data.push( col_inner_data );
            }
          }
        } else {
          if ( col_inner_data.trim() !== '' && !( col_filter_array.hasOwnProperty( col_inner_data ) ) ) {
            col_filter_array[ col_inner_data ] = col_inner_data;
            column_data.push( col_inner_data );
          }
        }
      }
      else if ( columnObj.column_data_type === 'html5_data_complex' ) {
        col_inner_data = data[ j ]._aData[ column_number_filter ];
        col_inner_data_helper = col_inner_data[ '@' + columnObj.html5_data ];
        if ( !col_filter_array.hasOwnProperty( col_inner_data_helper ) ) {
          col_filter_array[ col_inner_data_helper ] = col_inner_data_helper;
          column_data.push( {
            value: col_inner_data_helper,
            label: col_inner_data.display
          });
        }
      }
    }
    columnObj.col_filter_array = col_filter_array;
    if ( column_data && columnObj.ignore_char !== undefined ) {
      column_data = column_data.map( function( element ) { return element.toString().replace( columnObj.ignore_char, '' ); });
    }
    return column_data;
  }

  function makeElement( element, opts ) {
    /* Wrap making an element so all event handlers are dynamically bound. */
    let onclick = opts.onclick;
    let onkeyup = opts.onkeyup;
    let onmousedown = opts.onmousedown;
    let onkeydown = opts.onkeydown;
    let onchange = opts.onchange;
    delete opts.onclick;
    delete opts.onkeyup;
    delete opts.onmousedown;
    delete opts.onkeydown;
    delete opts.onchange;
    let el = $( element, opts );
    if ( onclick ) { el.on( 'click', onclick ); }
    if ( onkeyup ) { el.on( 'keyup', onkeyup ); }
    if ( onkeydown ) { el.on( 'keydown', onkeydown ); }
    if ( onmousedown ) { el.on( 'mousedown', onmousedown ); }
    if ( onchange ) { el.on( 'change', onchange ); }
    return el;
  }

  function appendFilters( oTable, args, table_selector, pSettings ) {
    let $filter_selector,
      filter_selector_string,
      data,
      filter_container_id,
      column_number_data,
      column_number,
      column_position,
      filter_default_label,
      filter_reset_button_text,
      enable_auto_complete,
      date_format,
      ignore_char,
      filter_match_mode,
      column_data,
      column_data_temp,
      options_tmp,
      ii,
      table_selector_jq_friendly,
      min_val,
      max_val,
      col_num_visible,
      col_num_visible_iter,
      tmpStr,
      columnObjKey,
      columnObj,
      filters_position,
      unique_th,
      settingsDt,
      filterActionFn,
      custom_func_filter_value_holder,
      exclude_str,
      regex_str,
      null_str,
      externally_triggered_checkboxes_text,
      externally_triggered_checkboxes_function;

    if ( pSettings === undefined ) {
      settingsDt = getSettingsObjFromTable( oTable );
    } else {
      settingsDt = pSettings;
    }
    settingsMap[ generateTableSelectorJQFriendly2( oTable ) ] = settingsDt;

    table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( oTable );

    initColReorder2( settingsDt, table_selector_jq_friendly );

    filters_position = $( document ).data( table_selector + '_filters_position' );
    if ( settingsDt.oScroll.sX !== '' || settingsDt.oScroll.sY !== '' ) {
      table_selector = '.yadcf-datatables-table-' + table_selector_jq_friendly;
      if ( $( table_selector ).length === 0 ) {
        scrollXYHandler( oTable, '#' + getTableId( oTable ) );
      }
    }
    if ( settingsDt.oApi._fnGetUniqueThs !== undefined ) {
      unique_th = settingsDt.oApi._fnGetUniqueThs( settingsDt );
    }
    for ( columnObjKey in args ) {
      if ( args.hasOwnProperty( columnObjKey ) ) {
        columnObj = args[ columnObjKey ];

        options_tmp = $();
        tmpStr = '';
        data = columnObj.data;
        column_data = [];
        column_data_temp = [];
        filter_container_id = columnObj.filter_container_id;
        column_number = columnObj.column_number;
        column_number = +column_number;
        column_position = column_number;

        if ( plugins[ table_selector_jq_friendly ] !== undefined && ( plugins[ table_selector_jq_friendly ] !== undefined && plugins[ table_selector_jq_friendly ].ColReorder !== undefined ) ) {
          column_position = plugins[ table_selector_jq_friendly ].ColReorder[ column_number ];
        }

        columnObj.column_number = column_number;
        column_number_data = undefined;
        if ( isNaN( settingsDt.aoColumns[ column_position ].mData ) && ( typeof settingsDt.aoColumns[ column_position ].mData !== 'object' ) ) {
          column_number_data = settingsDt.aoColumns[ column_position ].mData;
          columnObj.column_number_data = column_number_data;
        } else if ( settingsDt.aoColumns[ column_position ].mData && settingsDt.aoColumns[ column_position ].mData.filter ) {
          column_number_data = settingsDt.aoColumns[ column_position ].mData.filter;
          columnObj.column_number_data = column_number_data;
        }
        if ( isNaN( settingsDt.aoColumns[ column_position ].mRender ) && typeof settingsDt.aoColumns[ column_position ].mRender !== 'object' ) {
          columnObj.column_number_render = settingsDt.aoColumns[ column_position ].mRender;
        }
        filter_default_label = columnObj.filter_default_label;
        filter_reset_button_text = columnObj.filter_reset_button_text;
        externally_triggered_checkboxes_text = columnObj.externally_triggered_checkboxes_text;
        externally_triggered_checkboxes_function = columnObj.externally_triggered_checkboxes_function;
        enable_auto_complete = columnObj.enable_auto_complete;
        date_format = columnObj.date_format;
        if ( columnObj.datepicker_type === 'jquery-ui' ) {
          date_format = date_format.replace( 'yyyy', 'yy' );
        }
        if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' && columnObj.filter_plugin_options !== undefined && columnObj.filter_plugin_options.format !== undefined ) {
          date_format = columnObj.filter_plugin_options.format;
        }
        columnObj.date_format = date_format;

        if ( columnObj.ignore_char !== undefined && !( columnObj.ignore_char instanceof RegExp ) ) {
          ignore_char = new RegExp( columnObj.ignore_char, 'g' );
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
            filter_default_label = default_options.language.select;
          } else if ( columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'multi_select_custom_func' ) {
            filter_default_label = default_options.language.select_multi;
          } else if ( columnObj.filter_type === 'auto_complete' || columnObj.filter_type === 'text' ) {
            filter_default_label = default_options.language.filter;
          } else if ( columnObj.filter_type === 'range_number' || columnObj.filter_type === 'range_date' ) {
            filter_default_label = default_options.language.range;
          } else if ( columnObj.filter_type === 'date' || columnObj.filter_type === 'date_custom_func' ) {
            filter_default_label = default_options.language.date;
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
          column_data_temp = parseTableColumn( oTable, columnObj, table_selector_jq_friendly: string, settingsDt );
          if ( columnObj.append_data_to_table_data !== 'before' ) {
            column_data = column_data.concat( column_data_temp );
          } else {
            column_data_temp = sortColumnData( column_data_temp, columnObj );
            column_data = column_data.concat( column_data_temp );
          }
        }

        if ( columnObj.append_data_to_table_data === undefined || columnObj.append_data_to_table_data === 'sorted' ) {
          column_data = sortColumnData( column_data, columnObj );
        }

        if ( columnObj.filter_type === 'range_number_slider' ) {
          let column_data_render;
          if ( columnObj.column_number_render ) {
            column_data_render = $.extend( true, [], column_data );
            column_data_render.forEach( ( data, index ) => {
              let meta = {
                row: index,
                col: columnObj.column_number,
                settings: settingsDt
              };
              let indexData = columnObj.column_number_data ? columnObj.column_number_data : index;
              if ( typeof indexData === 'string' && typeof column_data_render === 'object' ) {
                let cellDataRender = columnObj.column_number_render( getProp( column_data_render, indexData ), 'filter', column_data, meta );
                setProp( column_data_render, indexData, ( cellDataRender !== undefined && cellDataRender !== null ) ? cellDataRender : getProp( column_data, indexData ) );
              } else {
                let cellDataRender = columnObj.column_number_render( column_data_render[ indexData ], 'filter', column_data, meta );
                column_data_render[ indexData ] = ( cellDataRender !== undefined && cellDataRender !== null ) ? cellDataRender : column_data[ indexData ];
              }
            });
          }
          min_val = findMinInArray( column_data_render ? column_data_render : column_data, columnObj );
          max_val = findMaxInArray( column_data_render ? column_data_render : column_data, columnObj );
        }

        if ( filter_container_id === undefined && columnObj.filter_container_selector === undefined ) {
          //Can't show filter inside a column for a hidden one (place it outside using filter_container_id)
          if ( settingsDt.aoColumns[ column_position ].bVisible === false ) {
            //console.log('Yadcf warning: Can\'t show filter inside a column N#' + column_number + ' for a hidden one (place it outside using filter_container_id)');
            continue;
          }

          if ( filters_position !== 'thead' ) {
            if ( unique_th === undefined ) {
              //handle hidden columns
              col_num_visible = column_position;
              for ( col_num_visible_iter = 0; col_num_visible_iter < settingsDt.aoColumns.length && col_num_visible_iter < column_position; col_num_visible_iter++ ) {
                if ( settingsDt.aoColumns[ col_num_visible_iter ].bVisible === false ) {
                  col_num_visible--;
                }
              }
              column_position = col_num_visible;
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

        if ( columnObj.filter_type === 'select' || columnObj.filter_type === 'custom_func' || columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'multi_select_custom_func' ) {
          if ( columnObj.data_as_is !== true ) {
            if ( columnObj.omit_default_label !== true ) {
              if ( columnObj.filter_type === 'select' || columnObj.filter_type === 'custom_func' ) {
                options_tmp = $( '<option>', {
                  value: '-1',
                  text: filter_default_label
                });

                if ( columnObj.select_type === 'select2' && columnObj.select_type_options.placeholder !== undefined && columnObj.select_type_options.allowClear === true ) {
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
              if ( typeof column_data[ 0 ] === 'object' ) {
                for ( ii = 0; ii < column_data.length; ii++ ) {
                  options_tmp = options_tmp.add( $( '<option>', {
                    value: column_data[ ii ].value,
                    text: column_data[ ii ].label
                  } ) );
                }
              } else {
                for ( ii = 0; ii < column_data.length; ii++ ) {
                  options_tmp = options_tmp.add( $( '<option>', {
                    value: column_data[ ii ],
                    text: column_data[ ii ]
                  } ) );
                }
              }
            } else {
              for ( ii = 0; ii < column_data.length; ii++ ) {
                if ( typeof column_data[ ii ] === 'object' ) {
                  options_tmp = options_tmp.add( $( '<option>', {
                    value: column_data[ ii ].value,
                    text: column_data[ ii ].label
                  } ) );
                } else {
                  options_tmp = options_tmp.add( $( '<option>', {
                    value: column_data[ ii ],
                    text: column_data[ ii ]
                  } ) );
                }
              }
            }
          } else {
            options_tmp = columnObj.data;
          }
          column_data = options_tmp;
        }
        if ( $filter_selector.length === 1 ) {
          if ( columnObj.filter_type === 'select' || columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'custom_func' || columnObj.filter_type === 'multi_select_custom_func' ) {
            if ( columnObj.filter_type === 'custom_func' || columnObj.filter_type === 'multi_select_custom_func' ) {
              custom_func_filter_value_holder = $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val();
            }
            if ( !columnObj.select_type_options || !columnObj.select_type_options.ajax ) {
              $filter_selector.empty();
              $filter_selector.append( column_data );
              if ( settingsDt.aoPreSearchCols[ column_position ].sSearch !== '' ) {
                tmpStr = settingsDt.aoPreSearchCols[ column_position ].sSearch;
                if ( columnObj.filter_type === 'select' ) {
                  tmpStr = yadcfParseMatchFilter( tmpStr, getOptions( oTable.selector )[ column_number ].filter_match_mode );
                  let foundEntry = $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + ' option' ).filter( function() {
                    return $( this ).val() === tmpStr;
                  } ).prop( 'selected', true );
                  if ( foundEntry && foundEntry.length > 0 ) {
                    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );
                  }
                } else if ( columnObj.filter_type === 'multi_select' ) {
                  tmpStr = yadcfParseMatchFilterMultiSelect( tmpStr, getOptions( oTable.selector )[ column_number ].filter_match_mode );
                  tmpStr = tmpStr.replace( /\\/g, '' );
                  tmpStr = tmpStr.split( '|' );
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

            initializeSelectPlugin( columnObj.select_type, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), columnObj.select_type_options );
            if ( columnObj.cumulative_filtering === true && columnObj.select_type === 'chosen' ) {
              refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ) );
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
            if ( $( '#yadcf-filter-wrapper-' + generateTableSelectorJQFriendlyNew( columnObj.filter_container_selector ) ).length === 0 ) {
              $( columnObj.filter_container_selector ).append( makeElement( '<div>', {
                id: 'yadcf-filter-wrapper-' + generateTableSelectorJQFriendlyNew( columnObj.filter_container_selector )
              } ) );
            }
            filter_selector_string = '#yadcf-filter-wrapper-' + generateTableSelectorJQFriendlyNew( columnObj.filter_container_selector );
          }

          if ( columnObj.filter_type === 'select' || columnObj.filter_type === 'custom_func' ) {

            //add a wrapper to hold both filter and reset button
            $( filter_selector_string ).append( makeElement( '<div>', {
              id: 'yadcf-filter-wrapper-' + table_selector_jq_friendly + '-' + column_number,
              class: 'yadcf-filter-wrapper'
            } ) );
            filter_selector_string += ' div.yadcf-filter-wrapper';

            if ( columnObj.filter_type === 'select' ) {
              filterActionFn = function( colNo, tableSel ) {
                return function( event ) {
                  yadcf.doFilter( this, tableSel, colNo, filter_match_mode );
                };
              }( column_number, table_selector_jq_friendly );
              if ( columnObj.externally_triggered === true ) {
                filterActionFn = function() {};
              }
              $( filter_selector_string ).append( makeElement( '<select>', {
                id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
                class: `yadcf-filter ${columnObj.style_class}`,
                onchange: filterActionFn,
                onkeydown: yadcf.preventDefaultForEnter,
                onmousedown: yadcf.stopPropagation,
                onclick: yadcf.stopPropagation,
                html: column_data
              } ) );
              if ( filter_reset_button_text !== false ) {
                $( filter_selector_string ).find( '.yadcf-filter' ).after( makeElement( '<button>', {
                  type: 'button',
                  id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '-reset',
                  onmousedown: yadcf.stopPropagation,
                  onclick: function( colNo, tableSel ) {
                    return function( event ) {
                      yadcf.doFilter( 'clear', tableSel, colNo );
                      return false;
                    }
                  }( column_number, table_selector_jq_friendly ),
                  class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                  text: filter_reset_button_text
                } ) );
              }
              if ( columnObj.externally_triggered_checkboxes_text && typeof columnObj.externally_triggered_checkboxes_function === 'function' ) {
                $( filter_selector_string ).append( makeElement( '<button>', {
                  type: 'button',
                  id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '-externally_triggered_checkboxes-button',
                  onmousedown: yadcf.stopPropagation,
                  onclick: yadcf.stopPropagation,
                  class: 'yadcf-filter-externally_triggered_checkboxes-button ' + columnObj.externally_triggered_checkboxes_button_style_class,
                  text: columnObj.externally_triggered_checkboxes_text
                } ) );
                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '-externally_triggered_checkboxes-button' ).on( 'click', columnObj.externally_triggered_checkboxes_function );
              }
              exclude_str = $();
              if ( columnObj.exclude === true ) {
                exclude_str = makeElement( '<div>', {
                  class: 'yadcf-exclude-wrapper',
                  onmousedown: yadcf.stopPropagation,
                  onclick: yadcf.stopPropagation
                } ).append( makeElement( '<span>', {
                  class: 'yadcf-label small',
                  text: columnObj.exclude_label
                } ) ).append( makeElement( '<input>', {
                  type: 'checkbox',
                  title: columnObj.exclude_label,
                  onclick: function( colNo, tableSel ) {
                    return function( event ) {
                      yadcf.stopPropagation( event );
                      yadcf.doFilter( 'exclude', tableSel, colNo, filter_match_mode );
                    };
                  }( column_number, table_selector_jq_friendly )
                } ) );
              }

              if ( columnObj.checkbox_position_after ) {
                exclude_str.addClass( 'after' );
                $( filter_selector_string ).append( exclude_str );
              } else {
                $( filter_selector_string ).prepend( exclude_str );
              }
              // hide on load
              if ( columnObj.externally_triggered_checkboxes_text && typeof columnObj.externally_triggered_checkboxes_function === 'function' ) {
                let sel = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` );
                sel.find( '.yadcf-exclude-wrapper' ).hide();
              }
            } else {
              filterActionFn = function( colNo, tableSel ) {
                return function( event ) {
                  yadcf.doFilterCustomDateFunc( this, tableSel, colNo );
                }
              }( column_number, table_selector_jq_friendly );
              if ( columnObj.externally_triggered === true ) {
                filterActionFn = function() {};
              }
              $( filter_selector_string ).append( makeElement( '<select>', {
                id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
                class: `yadcf-filter ${columnObj.style_class}`,
                onchange: filterActionFn,
                onkeydown: yadcf.preventDefaultForEnter,
                onmousedown: yadcf.stopPropagation,
                onclick: yadcf.stopPropagation,
                html: column_data
              } ) );
              if ( filter_reset_button_text !== false ) {
                $( filter_selector_string ).find( '.yadcf-filter' ).after( makeElement( '<button>', {
                  type: 'button',
                  onmousedown: yadcf.stopPropagation,
                  onclick: function( colNo, tableSel ) {
                    return function( event ) {
                      yadcf.stopPropagation( event );
                      yadcf.doFilterCustomDateFunc( 'clear', tableSel, colNo );
                      return false;
                    };
                  }( column_number, table_selector_jq_friendly ),
                  class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                  text: filter_reset_button_text
                } ) );
              }

              if ( settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState ) {
                if ( settingsDt.oLoadedState.yadcfState && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
                  tmpStr = settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from;
                  if ( tmpStr === '-1' || tmpStr === undefined ) {
                    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr );
                  } else {
                    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr ).addClass( 'inuse' );
                  }
                }
              }
              if ( settingsDt.oFeatures.bServerSide !== true ) {
                addCustomFunctionFilterCapability( table_selector_jq_friendly, `yadcf-filter-${table_selector_jq_friendly}-${column_number}`, column_number );
              }
            }

            if ( settingsDt.aoPreSearchCols[ column_position ].sSearch !== '' ) {
              tmpStr = settingsDt.aoPreSearchCols[ column_position ].sSearch;
              tmpStr = yadcfParseMatchFilter( tmpStr, getOptions( oTable.selector )[ column_number ].filter_match_mode );

              let match_mode = getOptions( oTable.selector )[ column_number ].filter_match_mode;

              let null_str = columnObj.select_null_option;
              let excludeStrStart = '^((?!';
              let excludeStrEnd = ').)*$';

              switch ( match_mode ) {
                case 'exact':
                  null_str = '^' + escapeRegExp( null_str ) + '$';
                  excludeStrStart = '((?!^';
                  excludeStrEnd = '$).)*';
                  break;
                case 'startsWith':
                  null_str = '^' + escapeRegExp( null_str );
                  excludeStrStart = '((?!^';
                  excludeStrEnd = ').)*$';
                  break;
                default:
                  break;
              }

              null_str = '^((?!' + null_str + ').)*$';
              null_str = yadcfParseMatchFilter( null_str, getOptions( oTable.selector )[ column_number ].filter_match_mode );

              let exclude = false;

              // null with exclude selected
              if ( null_str === tmpStr ) {
                exclude = true;
                tmpStr = columnObj.select_null_option;
              } else if ( tmpStr.includes( excludeStrStart ) && tmpStr.includes( excludeStrEnd ) ) {
                exclude = true;
                tmpStr = tmpStr.replace( excludeStrStart, '' );
                tmpStr = tmpStr.replace( excludeStrEnd, '' );
              }

              let filter = $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` );

              tmpStr = escapeRegExp( tmpStr );

              let optionExists = filter.find( `option[value="${tmpStr}"]` ).length === 1;

              // Set the state preselected value only if the option exists in the select dropdown.
              if ( optionExists ) {
                filter.val( tmpStr ).addClass( 'inuse' );

                if ( exclude ) {
                  $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-exclude-wrapper' ).find( ':checkbox' ).prop( 'checked', true );
                  $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val', tmpStr );
                  refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), tmpStr );
                }

                if ( tmpStr === columnObj.select_null_option && settingsDt.oFeatures.bServerSide === false ) {
                  oTable.fnFilter( '', column_number );

                  addNullFilterCapability( table_selector_jq_friendly, column_number: number, true );

                  oTable.fnDraw();

                  $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val', tmpStr );

                  refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), tmpStr );
                }
              }
            }

            if ( columnObj.select_type !== undefined ) {
              initializeSelectPlugin( columnObj.select_type, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), columnObj.select_type_options );

              if ( columnObj.cumulative_filtering === true && columnObj.select_type === 'chosen' ) {
                refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ) );
              }
            }
          } else if ( columnObj.filter_type === 'multi_select' || columnObj.filter_type === 'multi_select_custom_func' ) {
            // Add a wrapper to hold both filter and reset button
            $( filter_selector_string ).append( makeElement( '<div>', {
              id: 'yadcf-filter-wrapper-' + table_selector_jq_friendly + '-' + column_number,
              class: 'yadcf-filter-wrapper'
            } ) );

            filter_selector_string += ' div.yadcf-filter-wrapper';

            if ( columnObj.filter_type === 'multi_select' ) {
              filterActionFn = function( colNo, tableSel ) {
                return function( event ) {
                  yadcf.doFilterMultiSelect( this, tableSel, colNo, filter_match_mode );
                };
              }( column_number, table_selector_jq_friendly );

              if ( columnObj.externally_triggered === true ) {
                filterActionFn = function() {};
              }

              $( filter_selector_string ).append(
                makeElement( '<select>', {
                  multiple: true,
                  'data-placeholder': filter_default_label,
                  id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
                  class: `yadcf-filter ${columnObj.style_class}`,
                  onchange: filterActionFn,
                  onkeydown: yadcf.preventDefaultForEnter,
                  onmousedown: yadcf.stopPropagation,
                  onclick: yadcf.stopPropagation,
                  html: column_data
                } )
              );

              if ( filter_reset_button_text !== false ) {
                $( filter_selector_string ).find( '.yadcf-filter' ).after( makeElement( '<button>', {
                  type: 'button',
                  onmousedown: yadcf.stopPropagation,
                  onclick: function( colNo, tableSel ) {
                    return function( event ) {
                      yadcf.stopPropagation( event );
                      yadcf.doFilter( 'clear', tableSel, colNo );
                      return false;
                    }
                  }( column_number, table_selector_jq_friendly ),
                  class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                  text: filter_reset_button_text
                } ) );
              }

              if ( settingsDt.aoPreSearchCols[ column_position ].sSearch !== '' ) {
                tmpStr = settingsDt.aoPreSearchCols[ column_position ].sSearch;
                tmpStr = yadcfParseMatchFilterMultiSelect( tmpStr, getOptions( oTable.selector )[ column_number ].filter_match_mode );
                tmpStr = tmpStr.replace( /\\/g, '' );
                tmpStr = tmpStr.split( '|' );
                $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr );
              }
            } else {
              filterActionFn = function( colNo, tableSel ) {
                return function( event ) {
                  yadcf.doFilterCustomDateFunc( this, tableSel, colNo );
                };
              }( column_number, table_selector_jq_friendly );

              if ( columnObj.externally_triggered === true ) {
                filterActionFn = function() {};
              }

              $( filter_selector_string ).append(
                makeElement( '<select>', {
                  multiple: true,
                  'data-placeholder': filter_default_label,
                  id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
                  class: `yadcf-filter ${columnObj.style_class}`,
                  onchange: filterActionFn,
                  onkeydown: yadcf.preventDefaultForEnter,
                  onmousedown: yadcf.stopPropagation,
                  onclick: yadcf.stopPropagation,
                  html: column_data
                } )
              );

              if ( filter_reset_button_text !== false ) {
                $( filter_selector_string ).find( '.yadcf-filter' ).after( makeElement( '<button>', {
                  type: 'button',
                  onmousedown: yadcf.stopPropagation,
                  onclick: function( colNo, tableSel ) {
                    return function( event ) {
                      yadcf.stopPropagation( event );
                      yadcf.doFilterCustomDateFunc( 'clear', tableSel, colNo );
                      return false;
                    };
                  }( column_number, table_selector_jq_friendly ),
                  class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                  text: filter_reset_button_text
                } ) );
              }

              if ( settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState ) {
                if ( settingsDt.oLoadedState.yadcfState && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
                  tmpStr = settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].from;
                  if ( tmpStr === '-1' || tmpStr === undefined ) {
                    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr );
                  } else {
                    $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr ).addClass( 'inuse' );
                  }
                }
              }

              if ( settingsDt.oFeatures.bServerSide !== true ) {
                addCustomFunctionFilterCapability( table_selector_jq_friendly, `yadcf-filter-${table_selector_jq_friendly}-${column_number}`, column_number );
              }
            }

            if ( columnObj.filter_container_selector === undefined && columnObj.select_type_options.width === undefined ) {
              columnObj.select_type_options = $.extend( columnObj.select_type_options, { width: $( filter_selector_string ).closest( 'th' ).width() + 'px' });
            }

            if ( columnObj.filter_container_selector !== undefined && columnObj.select_type_options.width === undefined ) {
              columnObj.select_type_options = $.extend( columnObj.select_type_options, { width: $( filter_selector_string ).closest( columnObj.filter_container_selector ).width() + 'px' });
            }

            if ( columnObj.select_type !== undefined ) {
              initializeSelectPlugin( columnObj.select_type, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), columnObj.select_type_options );

              if ( columnObj.cumulative_filtering === true && columnObj.select_type === 'chosen' ) {
                refreshSelectPlugin( columnObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ) );
              }
            }
          } else if ( columnObj.filter_type === 'auto_complete' ) {

            // Add a wrapper to hold both filter and reset button.
            $( filter_selector_string ).append(
              makeElement( '<div>', {
                id: 'yadcf-filter-wrapper-' + table_selector_jq_friendly + '-' + column_number,
                class: 'yadcf-filter-wrapper'
              } )
            );

            filter_selector_string += ' div.yadcf-filter-wrapper';

            filterActionFn = function( tableSel ) {
              return function( event ) {
                yadcf.autocompleteKeyUP( tableSel, event );
              };
            }( table_selector_jq_friendly );

            if ( columnObj.externally_triggered === true ) {
              filterActionFn = function() {};
            }

            $( filter_selector_string ).append( makeElement( '<input>', {
              onkeydown: yadcf.preventDefaultForEnter,
              id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
              class: 'yadcf-filter',
              onmousedown: yadcf.stopPropagation,
              onclick: yadcf.stopPropagation,
              placeholder: filter_default_label,
              filter_match_mode: filter_match_mode,
              onkeyup: filterActionFn
            } ) );

            $( document ).data( `yadcf-filter-${table_selector_jq_friendly}-${column_number}`, column_data );

            if ( filter_reset_button_text !== false ) {
              $( filter_selector_string ).find( '.yadcf-filter' ).after( makeElement( '<button>', {
                type: 'button',
                onmousedown: yadcf.stopPropagation,
                onclick: function( colNo, tableSel ) {
                  return function( event ) {
                    yadcf.stopPropagation( event );
                    yadcf.doFilterAutocomplete( 'clear', tableSel, colNo );
                    return false;
                  };
                }( column_number, table_selector_jq_friendly ),
                class: 'yadcf-filter-reset-button ' + columnObj.reset_button_style_class,
                text: filter_reset_button_text
              } ) );
            }
          } else if ( columnObj.filter_type === 'text' ) {

            // Add a wrapper to hold both filter and reset button.
            $( filter_selector_string ).append( makeElement( '<div>', {
              id: 'yadcf-filter-wrapper-' + table_selector_jq_friendly + '-' + column_number,
              class: 'yadcf-filter-wrapper'
            } ) );
            filter_selector_string += ' div.yadcf-filter-wrapper';

            filterActionFn = function( colNo, tableSel ) {
              /* IIFE closure to preserve column number. */
              return function( event ) {
                yadcf.textKeyUP( event, tableSel, colNo );
              };
            }( column_number, table_selector_jq_friendly );

            if ( columnObj.externally_triggered === true ) {
              filterActionFn = function() {};
            }

            exclude_str = $();

            if ( columnObj.exclude === true ) {
              if ( columnObj.externally_triggered !== true ) {
                exclude_str = makeElement( '<div>', {
                    class: 'yadcf-exclude-wrapper',
                    onmousedown: yadcf.stopPropagation,
                    onclick: yadcf.stopPropagation
                  } )
                .append( makeElement( '<span>', {
                  class: 'yadcf-label small',
                  text: columnObj.exclude_label
                } ) )
                .append( makeElement( '<input>', {
                  type: 'checkbox',
                  title: columnObj.exclude_label,
                  onclick: function( colNo, tableSel ) {
                    return function( event ) {
                      yadcf.stopPropagation( event );
                      yadcf.textKeyUP( event, tableSel, colNo );
                    };
                  }( column_number, table_selector_jq_friendly )
                } ) );
              } else {
                exclude_str = makeElement( '<div>', {
                    class: 'yadcf-exclude-wrapper',
                    onmousedown: yadcf.stopPropagation,
                    onclick: yadcf.stopPropagation
                  } )
                .append( makeElement( '<span>', {
                  class: 'yadcf-label small',
                  text: columnObj.exclude_label
                } ) )
                .append( makeElement( '<input>', {
                  type: 'checkbox',
                  title: columnObj.exclude_label,
                  onclick: yadcf.stopPropagation
                } ) );
              }
            }

            regex_str = $();

            if ( columnObj.regex_check_box === true ) {
              if ( columnObj.externally_triggered !== true ) {
                regex_str = makeElement( '<div>', {
                    class: 'yadcf-regex-wrapper',
                    onmousedown: yadcf.stopPropagation,
                    onclick: yadcf.stopPropagation
                  } )
                .append( makeElement( '<span>', {
                  class: 'yadcf-label small',
                  text: columnObj.regex_label
                } ) )
                .append( makeElement( '<input>', {
                  type: 'checkbox',
                  title: columnObj.regex_label,
                  onclick: function( colNo, tableSel ) {
                    return function( event ) {
                      yadcf.stopPropagation( event );
                      yadcf.textKeyUP( event, tableSel, colNo );
                    };
                  }( column_number, table_selector_jq_friendly )
                } ) );
              } else {
                regex_str = makeElement( '<div>', {
                    class: 'yadcf-regex-wrapper',
                    onmousedown: yadcf.stopPropagation,
                    onclick: yadcf.stopPropagation
                  } )
                .append( makeElement( '<span>', {
                  class: 'yadcf-label small',
                  text: columnObj.regex_label
                } ) )
                .append( makeElement( '<input>', {
                  type: 'checkbox',
                  title: columnObj.regex_label,
                  onclick: yadcf.stopPropagation
                } ) );
              }
            }

            null_str = $();

            if ( columnObj.null_check_box === true ) {
              null_str = makeElement( '<div>', {
                  class: 'yadcf-null-wrapper',
                  onmousedown: yadcf.stopPropagation,
                  onclick: yadcf.stopPropagation
                } )
              .append( makeElement( '<span>', {
                class: 'yadcf-label small',
                text: columnObj.null_label
              } ) )
              .append( makeElement( '<input>', {
                type: 'checkbox',
                title: columnObj.null_label,
                onclick: function( colNo, tableSel ) {
                  return function( event ) {
                    yadcf.stopPropagation( event );
                    yadcf.nullChecked( event, tableSel, colNo );
                  };
                }( column_number, table_selector_jq_friendly )
              } ) );

              if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
                addNullFilterCapability( table_selector_jq_friendly, column_number: number, false );
              }
            }

            let append_input = makeElement( '<input>', {
              type: 'text',
              onkeydown: yadcf.preventDefaultForEnter,
              id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}`,
              class: `yadcf-filter ${columnObj.style_class}`,
              onmousedown: yadcf.stopPropagation,
              onclick: yadcf.stopPropagation,
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
              let sel = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` );

              // Hide on load.
              sel.find( '.yadcf-exclude-wrapper' ).hide();
              sel.find( '.yadcf-regex-wrapper' ).hide();
              sel.find( '.yadcf-null-wrapper' ).hide();

              $( filter_selector_string ).find( '.yadcf-filter' ).after( makeElement( '<button>', {
                type: 'button',
                id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}-externally_triggered_checkboxes-button`,
                onmousedown: yadcf.stopPropagation,
                onclick: yadcf.stopPropagation,
                class: `yadcf-filter-externally_triggered_checkboxes-button ${columnObj.externally_triggered_checkboxes_button_style_class}`,
                text: externally_triggered_checkboxes_text
              } ) );

              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}-externally_triggered_checkboxes-button` ).on( 'click', externally_triggered_checkboxes_function );
            }

            if ( filter_reset_button_text !== false ) {
              $( filter_selector_string ).find( '.yadcf-filter' ).after( makeElement( '<button>', {
                type: 'button',
                id: `yadcf-filter-${table_selector_jq_friendly}-${column_number}-reset`,
                onmousedown: yadcf.stopPropagation,
                onclick: function( colNo, tableSel ) {
                  /* IIFE closure to preserve column_number */
                  return function( event ) {
                    yadcf.stopPropagation( event );
                    yadcf.textKeyUP( event, tableSel, colNo, 'clear' );
                    return false;
                  }
                }( column_number, table_selector_jq_friendly ),
                class: `yadcf-filter-reset-button ${columnObj.reset_button_style_class}`,
                text: filter_reset_button_text
              } ) );
            }

            loadFromStateSaveTextFilter( oTable, settingsDt, columnObj, table_selector_jq_friendly: string, column_position, column_number );

          } else if ( columnObj.filter_type === 'date' || columnObj.filter_type === 'date_custom_func' ) {

            addDateFilter( filter_selector_string, table_selector_jq_friendly: string, column_number: number, filter_reset_button_text, filter_default_label, date_format );

          } else if ( columnObj.filter_type === 'range_number' ) {

            addRangeNumberFilter( filter_selector_string, table_selector_jq_friendly: string, column_number: number, filter_reset_button_text, filter_default_label, ignore_char );

          } else if ( columnObj.filter_type === 'range_number_slider' ) {

            addRangeNumberSliderFilter( filter_selector_string, table_selector_jq_friendly: string, column_number: number, filter_reset_button_text, min_val, max_val, ignore_char );

          } else if ( columnObj.filter_type === 'range_date' ) {

            addRangeDateFilter( filter_selector_string, table_selector_jq_friendly: string, column_number: number, filter_reset_button_text, filter_default_label, date_format );

          }
        }

        if ( $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val' ) !== undefined && $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val' ) !== '-1' ) {
          $( filter_selector_string ).find( '.yadcf-filter' ).val( $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val' ) );
        }
        if ( columnObj.filter_type === 'auto_complete' ) {
          let autocompleteObj = {
            source: $( document ).data( `yadcf-filter-${table_selector_jq_friendly}-${column_number}` ),
            select: autocompleteSelect
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
            tmpStr = yadcfParseMatchFilter( tmpStr, getOptions( oTable.selector )[ column_number ].filter_match_mode );
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr ).addClass( 'inuse' );
          }
        }
      }
    }
    if ( exFilterColumnQueue.length > 0 ) {
      ( exFilterColumnQueue.shift() )();
    }
  }

  function loadFromStateSaveTextFilter( oTable, settingsDt, columnObj, table_selector_jq_friendly: string, column_position, column_number: number ) {
    if ( columnObj.null_check_box === true ) {
      if ( settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState ) {
        if ( settingsDt.oLoadedState.yadcfState && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
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
      // load saved regex_checkbox state
      if ( columnObj.regex_check_box === true ) {
        if ( settingsDt.oFeatures.bStateSave === true && settingsDt.oLoadedState ) {
          if ( settingsDt.oLoadedState.yadcfState && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ] && settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] ) {
            if ( settingsDt.oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ].regex_check_box ) {
              $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-regex-wrapper' ).find( ':checkbox' ).prop( 'checked', true );
              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse-regex' );
            }
          }
        }
      }
      tmpStr = yadcfParseMatchFilter( tmpStr, getOptions( oTable.selector )[ column_number ].filter_match_mode );
      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( tmpStr ).addClass( 'inuse' );
    }
  }

  function rangeClear( table_selector_jq_friendly, event, column_number: number ) {
    let oTable = oTables[ table_selector_jq_friendly ],
      yadcfState,
      settingsDt,
      column_number_filter,
      currentFilterValues,
      columnObj,
      fromId = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`,
      toId = ``,
      $fromInput,
      $toInput;

    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
    event = eventTargetFixUp( event );
    settingsDt = getSettingsObjFromTable( oTable );
    columnObj = getOptions( oTable.selector )[ column_number ];

    column_number_filter = calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly );
    resetExcludeRegexCheckboxes( $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ) );
    clearStateSave( oTable, column_number: number, table_selector_jq_friendly );

    if ( columnObj.null_check_box ) {
      $( '#' + fromId.replace( '-from-date-', '-from-' ) ).prop( 'disabled', false );
      $( '#' + toId.replace( '-to-date-', '-to-' ) ).prop( 'disabled', false );
      if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
        oTable.fnDraw();
      } else {
        oTable.fnFilter( '', column_number_filter );
      }
    }
    currentFilterValues = exGetColumnFilterVal( oTable, column_number );
    if ( currentFilterValues.from === '' && currentFilterValues.to === '' ) {
      return;
    }

    let buttonSelector = $( event.target ).prop( 'nodeName' ) === 'BUTTON' ? $( event.target ).parent() : $( event.target ).parent().parent();

    if ( columnObj.datepicker_type === 'daterangepicker' ) {
      $( '#' + `yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' );
    } else {
      buttonSelector.find( '.yadcf-filter-range' ).val( '' );
      if ( buttonSelector.find( '.yadcf-filter-range-number' ).length > 0 ) {
        $( buttonSelector.find( '.yadcf-filter-range' )[ 0 ] ).trigger( 'focus' );
      }
    }

    if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
      saveStateSave( oTable, column_number: number, table_selector_jq_friendly: string, '', '' );
      oTable.fnDraw();
    } else {
      oTable.fnFilter( '', column_number_filter );
    }

    if ( !oTable.fnSettings().oLoadedState ) {
      oTable.fnSettings().oLoadedState = {};
      oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
    }
    if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
      if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
        oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
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
        oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
      }
      oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
    }
    resetIApiIndex();

    buttonSelector.parent().find( '.yadcf-filter-range' ).removeClass( 'inuse inuse-exclude' );
    if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      $fromInput = $( '#' + fromId );
      $toInput = $( '#' + toId );
      $fromInput.datepicker( 'update' );
      $toInput.datepicker( 'update' );
    } else if ( columnObj.datepicker_type === 'jquery-ui' ) {
      $( '#' + fromId ).datepicker( 'option', 'maxDate', null );
      $( '#' + toId ).datepicker( 'option', 'minDate', null );
    }

    return;
  }

  function rangeNumberSliderClear( table_selector_jq_friendly, event ) {
    let oTable = oTables[ table_selector_jq_friendly ],
      min_val,
      max_val,
      currentFilterValues,
      column_number;

    event = eventTargetFixUp( event );
    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];

    let buttonSelector = $( event.target ).prop( 'nodeName' ) === 'BUTTON' ? $( event.target ) : $( event.target ).parent();

    column_number = parseInt( buttonSelector.prev().find( '.yadcf-filter-range-number-slider' ).attr( 'id' ).replace( 'yadcf-filter-' + table_selector_jq_friendly + '-slider-', '' ), 10 );

    min_val = +$( buttonSelector.parent().find( '.yadcf-filter-range-number-slider-min-tip-hidden' ) ).text();
    max_val = +$( buttonSelector.parent().find( '.yadcf-filter-range-number-slider-max-tip-hidden' ) ).text();

    currentFilterValues = exGetColumnFilterVal( oTable, column_number );
    if ( +currentFilterValues.from === min_val && +currentFilterValues.to === max_val ) {
      return;
    }

    // buttonSelector.prev().find( '.yadcf-filter-range-number-slider' ).slider( 'option', 'yadcf-reset', true );
    // buttonSelector.prev().find( '.yadcf-filter-range-number-slider' ).slider( 'option', 'values', [ min_val, max_val ] );

    $( buttonSelector.prev().find( '.ui-slider-handle' )[ 0 ] ).attr( 'tabindex', -1 ).trigger( 'focus' );

    $( buttonSelector.prev().find( '.ui-slider-handle' )[ 0 ] ).removeClass( 'inuse' );
    $( buttonSelector.prev().find( '.ui-slider-handle' )[ 1 ] ).removeClass( 'inuse' );
    buttonSelector.prev().find( '.ui-slider-range' ).removeClass( 'inuse' );

    oTable.fnDraw();
    resetIApiIndex();

    return;
  }

  function dateKeyUP( table_selector_jq_friendly, date_format, event ) {
    let oTable,
      date,
      dateId,
      column_number,
      columnObj;

    event = eventTargetFixUp( event );

    dateId = event.target.id;
    date = document.getElementById( dateId ).value;

    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
    oTable = oTables[ table_selector_jq_friendly ];
    column_number = parseInt( dateId.replace( 'yadcf-filter-' + table_selector_jq_friendly + '-', '' ), 10 );
    columnObj = getOptions( oTable.selector )[ column_number ];

    try {
      if ( columnObj.datepicker_type === 'jquery-ui' ) {
        if ( date.length === ( date_format.length + 2 ) ) {
          date = ( date !== '' ) ? $.datepicker.parseDate( date_format, date ) : date;
        }
      }
    } catch ( err1 ) {}

    if ( date instanceof Date || moment( date, columnObj.date_format ).isValid() ) {
      $( '#' + dateId ).addClass( 'inuse' );
      if ( columnObj.filter_type !== 'date_custom_func' ) {
        oTable.fnFilter( document.getElementById( dateId ).value, column_number );
        resetIApiIndex();
      } else {
        doFilterCustomDateFunc( { value: date }, table_selector_jq_friendly: string, column_number );
      }
    } else if ( date === '' || event.target.value.trim() === '' ) {
      $( '#' + dateId ).removeClass( 'inuse' );
      $( '#' + event.target.id ).removeClass( 'inuse' );
      oTable.fnFilter( '', column_number );
      resetIApiIndex();
    }
  }

  function rangeDateKeyUP( table_selector_jq_friendly, date_format, event ) {
    let oTable,
      min,
      max,
      fromId,
      toId,
      column_number,
      columnObj,
      keyUp,
      settingsDt,
      column_number_filter,
      dpg,
      minTmp,
      maxTmp;

    event = eventTargetFixUp( event );
    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];

    oTable = oTables[ table_selector_jq_friendly ];

    column_number        = parseInt( $( event.target ).attr( 'id' ).replace( '-from-date-', '' ).replace( '-to-date-', '' ).replace( `yadcf-filter-${table_selector_jq_friendly}`, '' ), 10 );
    columnObj            = getOptions( oTable.selector )[ column_number ];
    settingsDt           = getSettingsObjFromTable( oTable );
    column_number_filter = calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly );

    if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
      dpg = $.fn.datepicker.DPGlobal;
    }

    keyUp = function() {
      if ( event.target.id.indexOf( '-from-' ) !== -1 ) {
        fromId = event.target.id;
        toId = event.target.id.replace( '-from-', '-to-' );
      } else {
        toId = event.target.id;
        fromId = event.target.id.replace( '-to-', '-from-' );
      }

      min = document.getElementById( fromId ).value;
      max = document.getElementById( toId ).value;

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
      } else if ( columnObj.datepicker_type === 'bootstrap-datetimepicker' ) {
        try {
          min = moment( min, columnObj.date_format ).toDate();
          if ( isNaN( min.getTime() ) ) {
            min = '';
          }
        } catch ( err ) {}

        try {
          max = moment( max, columnObj.date_format ).toDate();
          if ( isNaN( max.getTime() ) ) {
            max = '';
          }
        } catch ( err ) {}
      } else if ( columnObj.datepicker_type === 'bootstrap-datepicker' ) {
        try {
          min = dpg.parseDate( min, dpg.parseFormat( columnObj.date_format ) );
          if ( isNaN( min.getTime() ) ) {
            min = '';
          }
        } catch ( err ) {}

        try {
          max = dpg.parseDate( max, dpg.parseFormat( columnObj.date_format ) );
          if ( isNaN( max.getTime() ) ) {
            max = '';
          }
        } catch ( err ) {}
      }

      if ( ( ( max instanceof Date ) && ( min instanceof Date ) && ( max >= min ) ) || !min || !max ) {
        if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
          minTmp = document.getElementById( fromId ).value;
          maxTmp = document.getElementById( toId ).value;
          saveStateSave( oTable, column_number: number, table_selector_jq_friendly: string, !min ? '' : minTmp, !max ? '' : maxTmp );
          oTable.fnDraw();
        } else {
          oTable.fnFilter( document.getElementById( fromId ).value + columnObj.custom_range_delimiter + document.getElementById( toId ).value, column_number_filter );
        }

        if ( min instanceof Date ) {
          $( '#' + fromId ).addClass( 'inuse' );
        } else {
          $( '#' + fromId ).removeClass( 'inuse' );
        }

        if ( max instanceof Date ) {
          $( '#' + toId ).addClass( 'inuse' );
        } else {
          $( '#' + toId ).removeClass( 'inuse' );
        }

        if ( event.target.value.trim() === '' && $( event.target ).hasClass( 'inuse' ) ) {
          $( '#' + event.target.id ).removeClass( 'inuse' );
        }
      }

      resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      keyUp( table_selector_jq_friendly, event );
    } else {
      yadcfDelay( function() {
        keyUp( table_selector_jq_friendly, event );
      }, columnObj.filter_delay );
    }
  }

  function rangeNumberKeyUP( table_selector_jq_friendly, event ) {
    let oTable = oTables[ table_selector_jq_friendly ],
      min,
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

    event = eventTargetFixUp( event );
    checkbox = $( event.target ).attr( 'type' ) === 'checkbox';
    let target = checkbox ? $( event.target ).parent().parent().find( '.yadcf-filter-range-number' ).first() : $( event.target );

    $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];

    column_number = parseInt( target.attr( 'id' ).replace( '-from-', '' ).replace( '-to-', '' ).replace( 'yadcf-filter-' + table_selector_jq_friendly, '' ), 10 );
    columnObj = getOptions( oTable.selector )[ column_number ];
    settingsDt = getSettingsObjFromTable( oTable );
    column_number_filter = calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly );

    if ( columnObj.exclude ) {
      exclude_checked = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
    }
    // state save when exclude was fired last
    if ( columnObj.null_check_box ) {
      null_checked = $( `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked' );
    }

    keyUp = function() {
      fromId = `yadcf-filter-${table_selector_jq_friendly}-from-${column_number}`;
      toId = `yadcf-filter-${table_selector_jq_friendly}-to-${column_number}`;
      min = document.getElementById( fromId ).value;
      max = document.getElementById( toId ).value;

      min = ( min !== '' ) ? ( +min ) : min;
      max = ( max !== '' ) ? ( +max ) : max;

      if ( null_checked ) {
        if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
          oTable.fnDraw();
        } else {
          let excludeString = columnObj.not_null_api_call_value ? columnObj.not_null_api_call_value : '!^@';
          let nullString = columnObj.null_api_call_value ? columnObj.null_api_call_value : 'null';
          let requestString = exclude_checked ? excludeString : nullString;
          oTable.fnFilter( requestString, column_number_filter );
        }
        return;
      }

      if ( ( !isNaN( max ) && !isNaN( min ) && ( max >= min ) ) || min === '' || max === '' ) {

        if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
          oTable.fnDraw();
        } else {
          let exclude_delimeter = exclude_checked ? '!' : '';
          oTable.fnFilter( exclude_delimeter + min + columnObj.custom_range_delimiter + max, column_number_filter );
        }
        $( '#' + fromId ).removeClass( 'inuse inuse-exclude' );
        $( '#' + toId ).removeClass( 'inuse inuse-exclude' );

        let inuse_class = exclude_checked ? 'inuse inuse-exclude' : 'inuse';
        if ( document.getElementById( fromId ).value !== '' ) {
          $( '#' + fromId ).addClass( inuse_class );
        }
        if ( document.getElementById( toId ).value !== '' ) {
          $( '#' + toId ).addClass( inuse_class );
        }

        if ( !oTable.fnSettings().oLoadedState ) {
          oTable.fnSettings().oLoadedState = {};
          oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
        }
        if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
          if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
            oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
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
            oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
          }
          oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
        }
      }
      resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      keyUp();
    } else {
      yadcfDelay( function() {
        keyUp();
      }, columnObj.filter_delay );
    }
  }

  function doFilterMultiTablesMultiSelect( tablesSelectors, event, column_number_str, clear ) {

    let columnsObj = getOptions( tablesSelectors + '_' + column_number_str )[ column_number_str ],
      regex = false,
      smart = true,
      caseInsen = true,
      tablesAsOne,
      tablesArray = oTables[ tablesSelectors ],
      selected_values = $( event.target ).val(),
      i;

    event = eventTargetFixUp( event );
    tablesAsOne = new $.fn.dataTable.Api( tablesArray );

    if ( clear !== undefined || !selected_values || selected_values.length === 0 ) {
      if ( clear !== undefined ) {
        $( event.target ).parent().find( 'select' ).val( '-1' ).trigger( 'focus' );
        $( event.target ).parent().find( 'selectn ' ).removeClass( 'inuse' );
      }
      if ( columnsObj.column_number instanceof Array ) {
        tablesAsOne.columns( columnsObj.column_number ).search( '' ).draw();
      } else {
        tablesAsOne.search( '' ).draw();
      }

      refreshSelectPlugin( columnsObj, $( '#' + columnsObj.filter_container_id + ' select' ), '-1' );
      return;
    }

    $( event.target ).addClass( 'inuse' );

    regex = true;
    smart = false;
    caseInsen = columnsObj.case_insensitive;

    if ( selected_values !== null ) {
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

  function doFilterMultiTables( tablesSelectors, event, column_number_str, clear ) {

    let columnsObj = getOptions( tablesSelectors + '_' + column_number_str )[ column_number_str ],
      regex = false,
      smart = true,
      caseInsen = true,
      serachVal,
      tablesAsOne,
      tablesArray = oTables[ tablesSelectors ];

    event = eventTargetFixUp( event );
    tablesAsOne = new $.fn.dataTable.Api( tablesArray );

    if ( clear !== undefined || event.target.value === '-1' ) {
      if ( clear !== undefined ) {
        $( event.target ).parent().find( 'select' ).val( '-1' ).trigger( 'focus' );
        $( event.target ).parent().find( 'select' ).removeClass( 'inuse' );
      }
      if ( columnsObj.column_number instanceof Array ) {
        tablesAsOne.columns( columnsObj.column_number ).search( '' ).draw();
      } else {
        tablesAsOne.search( '' ).draw();
      }

      refreshSelectPlugin( columnsObj, $( '#' + columnsObj.filter_container_id + ' select' ), '-1' );

      return;
    }

    $( event.target ).addClass( 'inuse' );

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
    if ( columnsObj.column_number instanceof Array ) {
      tablesAsOne.columns( columnsObj.column_number ).search( serachVal, regex, smart, caseInsen ).draw();
    } else {
      tablesAsOne.search( serachVal, regex, smart, caseInsen ).draw();
    }
  }

  function textKeyUpMultiTables( tablesSelectors, event, column_number_str, clear ) {

    let keyUp,
      columnsObj = getOptions( tablesSelectors + '_' + column_number_str )[ column_number_str ],
      regex = false,
      smart = true,
      caseInsen = true,
      serachVal,
      tablesAsOne,
      tablesArray = oTables[ tablesSelectors ];

    event = eventTargetFixUp( event );
    tablesAsOne = new $.fn.dataTable.Api( tablesArray );

    keyUp = function( tablesAsOne, event, clear ) {

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
      if ( columnsObj.column_number instanceof Array ) {
        tablesAsOne.columns( columnsObj.column_number ).search( serachVal, regex, smart, caseInsen ).draw();
      } else {
        tablesAsOne.search( serachVal, regex, smart, caseInsen ).draw();
      }
    };

    if ( columnsObj.filter_delay === undefined ) {
      keyUp( tablesAsOne, event, clear );
    } else {
      yadcfDelay( function() {
        keyUp( tablesAsOne, event, clear );
      }, columnsObj.filter_delay );
    }
  }

  function textKeyUP( ev, table_selector_jq_friendly: string, column_number: number, clear ) {
    let column_number_filter,
      oTable = oTables[ table_selector_jq_friendly ],
      keyUp,
      columnObj,
      settingsDt = getSettingsObjFromTable( oTable ),
      exclude,
      regex_check_box,
      null_checked = false,
      keyCodes = [ 37, 38, 39, 40, 17 ];

    if ( keyCodes.indexOf( ev.keyCode ) !== -1 || ctrlPressed ) {
      return;
    }

    column_number_filter = calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly );

    columnObj = getOptions( oTable.selector )[ column_number ];

    keyUp = function( table_selector_jq_friendly, column_number: number, clear ) {
      let fixedPrefix = '';
      if ( settingsDt._fixedHeader !== undefined && $( '.fixedHeader-floating' ).is( ':visible' ) ) {
        fixedPrefix = '.fixedHeader-floating ';
      }
      if ( columnObj.filters_position === 'tfoot' && settingsDt.nScrollFoot ) {
        fixedPrefix = '.' + settingsDt.nScrollFoot.className + ' ';
      }
      $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];

      // check checkboxes
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
          // uncheck checkboxes on reset button pressed
          resetExcludeRegexCheckboxes( $( fixedPrefix + `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ) );
          clearStateSave( oTable, column_number: number, table_selector_jq_friendly );
          $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).prop( 'disabled', false );
          if ( columnObj.null_check_box ) {
            if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
              oTable.fnDraw();
            } else {
              oTable.fnFilter( '', column_number_filter );
            }
          }
          if ( exGetColumnFilterVal( oTable, column_number ) === '' ) {
            return;
          }
        }

        if ( null_checked && columnObj.exclude ) {
          if ( oTable.fnSettings().oFeatures.bServerSide === true ) {
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
          saveTextKeyUpState( oTable, table_selector_jq_friendly: string, column_number: number, regex_check_box, null_checked, exclude );
          return;
        }

        $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' ).trigger( 'focus' );
        $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse inuse-exclude inuse-regex' );
        oTable.fnFilter( '', column_number_filter );
        resetIApiIndex();
        return;
      }
      // delete class also on regex or exclude checkbox uncheck
      $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse-exclude inuse-regex' );
      let inuseClass = 'inuse';
      inuseClass = exclude ? inuseClass + ' inuse-exclude' : inuseClass;
      inuseClass = regex_check_box ? inuseClass + ' inuse-regex' : inuseClass;

      $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( inuseClass );

      yadcfMatchFilter( oTable, $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val(), regex_check_box ? 'regex' : columnObj.filter_match_mode, column_number_filter, exclude, column_number );

      // save regex_checkbox state
      saveTextKeyUpState( oTable, table_selector_jq_friendly: string, column_number: number, regex_check_box, null_checked, exclude );
      resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      keyUp( table_selector_jq_friendly, column_number: number, clear );
    } else {
      yadcfDelay( function() {
        keyUp( table_selector_jq_friendly, column_number: number, clear );
      }, columnObj.filter_delay );
    }
  }

  function saveTextKeyUpState( oTable, table_selector_jq_friendly: string, column_number: number, regex_check_box, null_checked, exclude ) {
    let yadcfState;

    if ( oTable.fnSettings().oFeatures.bStateSave === true && oTable.fnSettings().oLoadedState && oTable.fnSettings().oLoadedState.yadcfState ) {
      if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
        oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
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
        oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
      }
      oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
    }
  }

  function nullChecked( ev, table_selector_jq_friendly: string, column_number: number ) {
    let column_number_filter,
      oTable = oTables[ table_selector_jq_friendly ],
      click,
      columnObj,
      settingsDt = getSettingsObjFromTable( oTable ),
      yadcfState,
      null_checked,
      exclude_checked = false;

    column_number_filter = calcColumnNumberFilter( settingsDt, column_number: number, table_selector_jq_friendly );

    columnObj = getOptions( oTable.selector )[ column_number ];

    let fixedPrefix = '';
    if ( settingsDt._fixedHeader !== undefined && $( '.fixedHeader-floating' ).is( ':visible' ) ) {
      fixedPrefix = '.fixedHeader-floating ';
    }
    if ( columnObj.filters_position === 'tfoot' && settingsDt.nScrollFoot ) {
      fixedPrefix = '.' + settingsDt.nScrollFoot.className + ' ';
    }
    null_checked = $( fixedPrefix + `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked' );
    if ( columnObj.exclude ) {
      exclude_checked = $( fixedPrefix + `#yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number}` ).find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked' );
    }

    click = function( table_selector_jq_friendly, column_number: number ) {
      // remove input data and inuse classes
      let inner = columnObj.filter_type === 'range_number' ? 'wrapper-inner-' : '';
      let inner_input = columnObj.filter_type === 'range_number' ? ' :input' : '';
      let input = $( '#yadcf-filter-' + inner + table_selector_jq_friendly + '-' + column_number + inner_input );
      input.removeClass( 'inuse inuse-exclude inuse-regex' );

      if ( columnObj.filter_type === 'text' ) {
        $( fixedPrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( '' ).trigger( 'focus' );
        if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
          oTable.fnFilter( '', column_number_filter );
        }
      }
      if ( columnObj.filter_type === 'range_number' ) {
        input.val( '' );
        if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
          oTable.fnDraw();
        }
      }
      // disable inputs
      if ( !null_checked ) {
        input.prop( 'disabled', false );
      } else {
        input.prop( 'disabled', true );
      }

      //filter by null
      if ( oTable.fnSettings().oFeatures.bServerSide !== true ) {
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

      // save regex_checkbox state
      if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
        if ( oTable.fnSettings().oLoadedState ) {
          if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
            oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
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
            oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
          }
        }
        oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
      }
      resetIApiIndex();
    };

    if ( columnObj.filter_delay === undefined ) {
      click( table_selector_jq_friendly, column_number );
    } else {
      yadcfDelay( function() {
        click( table_selector_jq_friendly, column_number );
      }, columnObj.filter_delay );
    }
  }

  function autocompleteKeyUP( table_selector_jq_friendly, event ) {
    let oTable,
      column_number,
      keyCodes = [ 37, 38, 39, 40 ];

    event = eventTargetFixUp( event );

    if ( keyCodes.indexOf( event.keyCode ) !== -1 ) {
      return;
    }

    if ( event.target.value === '' && event.keyCode === 8 && $( event.target ).hasClass( 'inuse' ) ) {
      $.fn.dataTableExt.iApiIndex = oTablesIndex[ table_selector_jq_friendly ];
      oTable = oTables[ table_selector_jq_friendly ];
      column_number = parseInt( $( event.target ).attr( 'id' ).replace( 'yadcf-filter-' + table_selector_jq_friendly + '-', '' ), 10 );

      $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
      $( document ).removeData( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val' );
      oTable.fnFilter( '', column_number );
      resetIApiIndex();
    }
  }

  function isDOMSource( tableVar ) {
    let settingsDt;
    settingsDt = getSettingsObjFromTable( tableVar );
    if ( !settingsDt.sAjaxSource && !settingsDt.ajax && settingsDt.oFeatures.bServerSide !== true ) {
      return true;
    }
    return false;
  }

  function scrollXYHandler( oTable, table_selector ) {
    let $tmpSelector,
      filters_position = $( document ).data( table_selector + '_filters_position' ),
      table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( oTable );

    if ( filters_position === 'thead' ) {
      filters_position = '.dataTables_scrollHead';
    } else {
      filters_position = '.dataTables_scrollFoot';
    }
    if ( oTable.fnSettings().oScroll.sX !== '' || oTable.fnSettings().oScroll.sY !== '' ) {
      $tmpSelector = $( table_selector ).closest( '.dataTables_scroll' ).find( filters_position + ' table' );
      $tmpSelector.addClass( 'yadcf-datatables-table-' + table_selector_jq_friendly );
    }
  }

  function firstFromObject( obj ) {
    let key;
    for ( key in obj ) {
      if ( obj.hasOwnProperty( key ) ) {
        return key;
      }
    }
  }

  function initAndBindTable( oTable, table_selector, index, pTableDT ) {

    let table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( oTable ),
      table_selector_tmp;
    oTables[ table_selector_jq_friendly ] = oTable;
    tablesDT[ table_selector_jq_friendly ] = pTableDT;
    oTablesIndex[ table_selector_jq_friendly ] = index;

    scrollXYHandler( oTable, table_selector );

    if ( isDOMSource( oTable ) ) {
      table_selector_tmp = table_selector;
      if ( table_selector.indexOf( ':eq' ) !== -1 ) {
        table_selector_tmp = table_selector.substring( 0, table_selector.lastIndexOf( ':eq' ) );
      }
      appendFilters( oTable, getOptions( table_selector_tmp ), table_selector );
      if ( getOptions( table_selector_tmp )[ firstFromObject( getOptions( table_selector_tmp ) ) ].cumulative_filtering === true ) {
        //when filters should be populated only from visible rows (non filtered)
        $( document ).off( 'search.dt', oTable.selector ).on( 'search.dt', oTable.selector, function( e, settings, json ) {
          let table_selector_tmp = oTable.selector;
          if ( table_selector.indexOf( ':eq' ) !== -1 ) {
            table_selector_tmp = table_selector.substring( 0, table_selector.lastIndexOf( ':eq' ) );
          }
          appendFilters( oTable, getOptions( table_selector_tmp ), oTable.selector, settings );
        });
      }
    } else {
      appendFilters( oTable, getOptions( table_selector ), table_selector );
      if ( yadcfVersionCheck( '1.10' ) ) {
        $( document ).off( 'xhr.dt', oTable.selector ).on( 'xhr.dt', oTable.selector, function( e, settings, json ) {
          let col_num,
            column_number_filter,
            table_selector_jq_friendly = generateTableSelectorJQFriendly2( oTable );
          if ( !json ) {
            console.log( 'datatables xhr.dt event came back with null as data (nothing for yadcf to do with it).' );
            return;
          }
          if ( settings.oSavedState !== null ) {
            initColReorder2( settings, table_selector_jq_friendly );
          }
          for ( col_num in yadcf.getOptions( settings.oInstance.selector ) ) {
            if ( yadcf.getOptions( settings.oInstance.selector ).hasOwnProperty( col_num ) ) {
              if ( json[ 'yadcf_data_' + col_num ] !== undefined ) {
                column_number_filter = col_num;
                if ( settings.oSavedState !== null && plugins[ table_selector_jq_friendly ] !== undefined ) {
                  column_number_filter = plugins[ table_selector_jq_friendly ].ColReorder[ col_num ];
                }
                yadcf.getOptions( settings.oInstance.selector )[ col_num ].data = json[ 'yadcf_data_' + column_number_filter ];
              }
            }
          }
          if ( dTXhrComplete !== undefined ) {
            yadcfDelay( function() {
              dTXhrComplete();
              dTXhrComplete = undefined;
            }, 100 );
          }
        });
      }
    }
    //events that affects both DOM and Ajax
    if ( yadcfVersionCheck( '1.10' ) ) {
      $( document ).off( 'stateLoaded.dt', oTable.selector ).on( 'stateLoaded.dt', oTable.selector, function( event, settings ) {
        let args = yadcf.getOptions( settings.oInstance.selector );
        let columnObjKey;
        for ( columnObjKey in args ) {
          if ( args.hasOwnProperty( columnObjKey ) ) {
            let columnObj = args[ columnObjKey ];
            let column_number = columnObj.column_number;
            column_number = +column_number;
            let column_position = column_number;
            let table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( oTable );

            loadFromStateSaveTextFilter( oTable, settings, columnObj, table_selector_jq_friendly: string, column_position, column_number );
          }
        }
      });
      $( document ).off( 'draw.dt', oTable.selector ).on( 'draw.dt', oTable.selector, function( event, settings ) {
        appendFilters( oTable, yadcf.getOptions( settings.oInstance.selector ), settings.oInstance.selector, settings );
      });
      $( document ).off( 'column-visibility.dt', oTable.selector ).on( 'column-visibility.dt', oTable.selector, function( e, settings, col_num, state ) {
        let obj = {},
          columnsObj = getOptions( settings.oInstance.selector );
        if ( state === true && settings._oFixedColumns === undefined ) {
          if ( ( plugins[ table_selector_jq_friendly ] !== undefined && plugins[ table_selector_jq_friendly ].ColReorder !== undefined ) ) {
            col_num = plugins[ table_selector_jq_friendly ].ColReorder[ col_num ];
          } else if ( settings.oSavedState && settings.oSavedState.ColReorder !== undefined ) {
            col_num = settings.oSavedState.ColReorder[ col_num ];
          }
          obj[ col_num ] = yadcf.getOptions( settings.oInstance.selector )[ col_num ];
          if ( obj[ col_num ] !== undefined ) {
            obj[ col_num ].column_number = col_num;
            if ( obj[ col_num ] !== undefined ) {
              appendFilters( oTables[ yadcf.generateTableSelectorJQFriendly2( settings ) ],
                obj,
                settings.oInstance.selector, settings );
            }
          }
        } else if ( settings._oFixedColumns !== undefined ) {
          appendFilters( oTables[ yadcf.generateTableSelectorJQFriendly2( settings ) ],
            columnsObj,
            settings.oInstance.selector, settings );
        }
      });
      $( document ).off( 'column-reorder.dt', oTable.selector ).on( 'column-reorder.dt', oTable.selector, function( e, settings, json ) {
        let table_selector_jq_friendly = generateTableSelectorJQFriendly2( oTable );
        initColReorderFromEvent( table_selector_jq_friendly );
      });
      $( document ).off( 'destroy.dt', oTable.selector ).on( 'destroy.dt', oTable.selector, function( event, ui ) {
        removeFilters( oTable, yadcf.getOptions( ui.oInstance.selector ), ui.oInstance.selector );
      });
    } else {
      $( document ).off( 'draw', oTable.selector ).on( 'draw', oTable.selector, function( event, settings ) {
        appendFilters( oTable, yadcf.getOptions( settings.oInstance.selector ), settings.oInstance.selector, settings );
      });
      $( document ).off( 'destroy', oTable.selector ).on( 'destroy', oTable.selector, function( event, ui ) {
        removeFilters( oTable, yadcf.getOptions( ui.oInstance.selector ), ui.oInstance.selector );
      });
    }
    if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
      if ( yadcfVersionCheck( '1.10' ) ) {
        $( oTable.selector ).off( 'stateSaveParams.dt' ).on( 'stateSaveParams.dt', function( e, settings, data ) {
          if ( settings.oLoadedState && settings.oLoadedState.yadcfState !== undefined ) {
            data.yadcfState = settings.oLoadedState.yadcfState;
          } else {
            data.naruto = 'kurama';
          }
        });
      } else {
        $( oTable.selector ).off( 'stateSaveParams' ).on( 'stateSaveParams', function( e, settings, data ) {
          if ( settings.oLoadedState && settings.oLoadedState.yadcfState !== undefined ) {
            data.yadcfState = settings.oLoadedState.yadcfState;
          } else {
            data.naruto = 'kurama';
          }
        });
      }
      //when using DOM source
      if ( isDOMSource( oTable ) ) {
        //we need to make sure that the yadcf state will be saved after page reload
        oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
        //redraw the table in order to apply the filters
        oTable.fnDraw( false );
      }
    }
  }

  $.extend( $.fn, {
    yadcf: function( options_arg, params ) {
      let tmpParams,
        i = 0,
        selector,
        tableSelector = '#' + this.fnSettings().sTableId;

      //in case that instance.selector will be undefined (jQuery 3)
      if ( this.selector === undefined ) {
        this.selector = tableSelector;
      }

      if ( params === undefined ) {
        params = {};
      }

      if ( typeof params === 'string' ) {
        tmpParams = params;
        params = {};
        params.filters_position = tmpParams;
      }
      if ( params.filters_position === undefined || params.filters_position === 'header' ) {
        params.filters_position = 'thead';
      } else {
        params.filters_position = 'tfoot';
      }
      $( document ).data( this.selector + '_filters_position', params.filters_position );

      if ( $( this.selector ).length === 1 ) {
        setOptions( this.selector, options_arg, params );
        initAndBindTable( this, this.selector, 0 );
      } else {
        for ( i; i < $( this.selector ).length; i++ ) {
          $.fn.dataTableExt.iApiIndex = i;
          selector = this.selector + ':eq(' + i + ')';
          setOptions( this.selector, options_arg, params );
          initAndBindTable( this, selector, i );
        }
        $.fn.dataTableExt.iApiIndex = 0;
      }

      if ( params.onInitComplete !== undefined ) {
        params.onInitComplete();
      }
      return this;
    }
  });

  function init( oTable, options_arg, params ) {
    let instance = oTable.settings()[ 0 ].oInstance,
      i = 0,
      selector,
      tmpParams,
      tableSelector = '#' + oTable.table().node().id;

    //in case that instance.selector will be undefined (jQuery 3)
    if ( !instance.selector ) {
      instance.selector = tableSelector;
    }

    if ( params === undefined ) {
      params = {};
    }

    if ( typeof params === 'string' ) {
      tmpParams = params;
      params = {};
      params.filters_position = tmpParams;
    }
    if ( params.filters_position === undefined || params.filters_position === 'header' ) {
      params.filters_position = 'thead';
    } else {
      params.filters_position = 'tfoot';
    }
    $( document ).data( instance.selector + '_filters_position', params.filters_position );

    if ( $( instance.selector ).length === 1 ) {
      setOptions( instance.selector, options_arg, params, oTable );
      initAndBindTable( instance, instance.selector, 0, oTable );
    } else {
      for ( i; i < $( instance.selector ).length; i++ ) {
        $.fn.dataTableExt.iApiIndex = i;
        selector = instance.selector + ':eq(' + i + ')';
        setOptions( instance.selector, options_arg, params, oTable );
        initAndBindTable( instance, selector, i, oTable );
      }
      $.fn.dataTableExt.iApiIndex = 0;
    }

    if ( params.onInitComplete !== undefined ) {
      params.onInitComplete();
    }
  }

  function appendFiltersMultipleTables( tablesArray, tablesSelectors, colObjDummy ) {
    let filter_selector_string = '#' + colObjDummy.filter_container_id,
      table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendlyNew( tablesSelectors ),
      options_tmp,
      ii,
      column_number_str = columnsArrayToString( colObjDummy.column_number ).column_number_str,
      tableTmp,
      tableTmpArr,
      tableTmpArrIndex,
      filterOptions = getOptions( tablesSelectors + '_' + column_number_str )[ column_number_str ],
      column_number_index,
      columnsTmpArr,
      settingsDt,
      tmpStr,
      columnForStateSaving;

    //add a wrapper to hold both filter and reset button
    $( filter_selector_string ).append( makeElement( '<div>', {
      id: `yadcf-filter-wrapper-${table_selector_jq_friendly}-${column_number_str}`,
      class: 'yadcf-filter-wrapper'
    } ) );

    filter_selector_string += ' div.yadcf-filter-wrapper';

    if ( column_number_str.indexOf( '_' ) !== -1 ) {
      columnForStateSaving = column_number_str.split( '_' )[ 0 ];
    } else {
      columnForStateSaving = column_number_str;
    }

    switch ( filterOptions.filter_type ) {
      case 'text':
        $( filter_selector_string ).append( makeElement( '<input>', {
          type: 'text',
          id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}`,
          class: 'yadcf-filter',
          onmousedown: yadcf.stopPropagation,
          onclick: yadcf.stopPropagation,
          placeholder: filterOptions.filter_default_label,
          onkeyup: function( colNo ) {
            return function( event ) {
              yadcf.stopPropagation( event );
              yadcf.textKeyUpMultiTables( tablesSelectors, event, colNo );
              return false;
            };
          }( column_number_str ),
        } ) );

        if ( filterOptions.filter_reset_button_text !== false ) {
          $( filter_selector_string ).find( '.yadcf-filter' ).after( makeElement( '<button>', {
            type: 'button',
            id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}-reset`,
            onmousedown: yadcf.stopPropagation,
            onclick: function( colNo ) {
              return function( event ) {
                yadcf.stopPropagation( event );
                yadcf.textKeyUpMultiTables( tablesSelectors, event, colNo, 'clear' );
                return false;
              };
            }( column_number_str ),
            class: `yadcf-filter-reset-button ${filterOptions.reset_button_style_class}`,
            text: filterOptions.filter_reset_button_text
          } ) );
        }

        if ( tablesArray[ 0 ].table !== undefined ) {
          tableTmp = $( '#' + tablesArray[ 0 ].table().node().id ).dataTable();
        } else {
          tableTmp = tablesArray[ 0 ];
        }

        settingsDt = getSettingsObjFromTable( tableTmp );

        if ( settingsDt.aoPreSearchCols[ columnForStateSaving ] && settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch !== '' ) {
          tmpStr = settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch;
          tmpStr = yadcfParseMatchFilter( tmpStr, filterOptions.filter_match_mode );
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

        if ( filterOptions.select_type === 'select2' && filterOptions.select_type_options.placeholder !== undefined && filterOptions.select_type_options.allowClear === true ) {
          options_tmp = $( '<option>', {
            value: ''
          });
        }

        if ( filterOptions.data === undefined ) {
          filterOptions.data = [];
          tableTmpArr = tablesSelectors.split( ',' );

          for ( tableTmpArrIndex = 0; tableTmpArrIndex < tableTmpArr.length; tableTmpArrIndex++ ) {
            if ( tablesArray[ tableTmpArrIndex ].table !== undefined ) {
              tableTmp = $( '#' + tablesArray[ tableTmpArrIndex ].table().node().id ).dataTable();
            } else {
              tableTmp = tablesArray[ tableTmpArrIndex ];
            }

            if ( isDOMSource( tableTmp ) ) {
              // Check if ajax source, if so, listen for dt.draw.
              columnsTmpArr = filterOptions.column_number;

              for ( column_number_index = 0; column_number_index < columnsTmpArr.length; column_number_index++ ) {
                filterOptions.column_number = columnsTmpArr[ column_number_index ];
                filterOptions.data = filterOptions.data.concat( parseTableColumn( tableTmp, filterOptions, table_selector_jq_friendly ) );
              }

              filterOptions.column_number = columnsTmpArr;
            } else {
              $( document ).off( 'draw.dt', '#' + tablesArray[ tableTmpArrIndex ].table().node().id ).on( 'draw.dt', '#' + tablesArray[ tableTmpArrIndex ].table().node().id, function( event, ui ) {
                let options_tmp = $(),
                  ii;
                columnsTmpArr = filterOptions.column_number;

                for ( column_number_index = 0; column_number_index < columnsTmpArr.length; column_number_index++ ) {
                  filterOptions.column_number = columnsTmpArr[ column_number_index ];
                  filterOptions.data = filterOptions.data.concat( parseTableColumn( tableTmp, filterOptions, table_selector_jq_friendly: string, ui ) );
                }

                filterOptions.column_number = columnsTmpArr;
                filterOptions.data = sortColumnData( filterOptions.data, filterOptions );

                for ( ii = 0; ii < filterOptions.data.length; ii++ ) {
                  options_tmp = options_tmp.add( $( '<option>', {
                    value: filterOptions.data[ ii ],
                    text: filterOptions.data[ ii ]
                  } ) );
                }

                $( '#' + filterOptions.filter_container_id + ' select' ).empty().append( options_tmp );

                if ( filterOptions.select_type !== undefined ) {
                  initializeSelectPlugin( filterOptions.select_type, $( '#' + filterOptions.filter_container_id + ' select' ), filterOptions.select_type_options );

                  if ( filterOptions.cumulative_filtering === true && filterOptions.select_type === 'chosen' ) {
                    refreshSelectPlugin( filterOptions, $( '#' + filterOptions.filter_container_id + ' select' ) );
                  }
                }
              });
            }
          }
        }

        filterOptions.data = sortColumnData( filterOptions.data, filterOptions );

        if ( tablesArray[ 0 ].table !== undefined ) {
          tableTmp = $( '#' + tablesArray[ 0 ].table().node().id ).dataTable();
        } else {
          tableTmp = tablesArray[ 0 ];
        }
        settingsDt = getSettingsObjFromTable( tableTmp );

        if ( typeof filterOptions.data[ 0 ] === 'object' ) {
          for ( ii = 0; ii < filterOptions.data.length; ii++ ) {
            options_tmp = options_tmp.add( $( '<option>', {
              value: filterOptions.data[ ii ].value,
              text: filterOptions.data[ ii ].label
            } ) );
          }
        } else {
          for ( ii = 0; ii < filterOptions.data.length; ii++ ) {
            options_tmp = options_tmp.add( $( '<option>', {
              value: filterOptions.data[ ii ],
              text: filterOptions.data[ ii ]
            } ) );
          }
        }

        if ( filterOptions.filter_type === 'select' ) {
          $( filter_selector_string ).append( makeElement( '<select>', {
            id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}`,
            class: 'yadcf-filter',
            onchange: function( colNo ) {
              return function( event ) {
                yadcf.stopPropagation( event );
                yadcf.doFilterMultiTables( tablesSelectors, event, colNo );
              }
            }( column_number_str ),
            onmousedown: yadcf.stopPropagation,
            onclick: yadcf.stopPropagation,
            html: options_tmp
          } ) );

          if ( settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch !== '' ) {
            tmpStr = settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch;
            tmpStr = yadcfParseMatchFilter( tmpStr, filterOptions.filter_match_mode );
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number_str}` ).val( tmpStr ).addClass( 'inuse' );
          }
        } else if ( filterOptions.filter_type === 'multi_select' ) {
          $( filter_selector_string ).append( makeElement( '<select>', {
            multiple: true,
            'data-placeholder': filterOptions.filter_default_label,
            id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}`,
            class: 'yadcf-filter',
            onchange: function( colNo ) {
              return function( event ) {
                yadcf.stopPropagation( event );
                yadcf.doFilterMultiTablesMultiSelect( tablesSelectors, event, colNo );
              };
            }( column_number_str ),
            onmousedown: yadcf.stopPropagation,
            onclick: yadcf.stopPropagation,
            html: options_tmp
          } ) );

          if ( settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch !== '' ) {
            tmpStr = settingsDt.aoPreSearchCols[ columnForStateSaving ].sSearch;
            tmpStr = yadcfParseMatchFilterMultiSelect( tmpStr, filterOptions.filter_match_mode );
            tmpStr = tmpStr.replace( /\\/g, '' );
            tmpStr = tmpStr.split( '|' );
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number_str}` ).val( tmpStr );
          }
        }

        if ( filterOptions.filter_type === 'select' ) {
          if ( filterOptions.filter_reset_button_text !== false ) {
            $( filter_selector_string ).find( '.yadcf-filter' ).after( makeElement( '<button>', {
              type: 'button',
              id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}-reset`,
              onmousedown: yadcf.stopPropagation,
              onclick: function( colNo ) {
                return function( event ) {
                  yadcf.stopPropagation( event );
                  yadcf.doFilterMultiTables( tablesSelectors, event, colNo, 'clear' );
                  return false;
                }
              }( column_number_str ),
              class: 'yadcf-filter-reset-button ' + filterOptions.reset_button_style_class,
              text: filterOptions.filter_reset_button_text
            } ) );
          }
        } else if ( filterOptions.filter_type === 'multi_select' ) {
          if ( filterOptions.filter_reset_button_text !== false ) {
            $( filter_selector_string ).find( '.yadcf-filter' ).after( makeElement( '<button>', {
              type: 'button',
              id: `yadcf-filter-${table_selector_jq_friendly}-${column_number_str}-reset`,
              onmousedown: yadcf.stopPropagation,
              onclick: function( colNo ) {
                return function( event ) {
                  yadcf.stopPropagation( event );
                  yadcf.doFilterMultiTablesMultiSelect( tablesSelectors, event, colNo, 'clear' );
                  return false;
                };
              }( column_number_str ),
              class: `yadcf-filter-reset-button ${filterOptions.reset_button_style_class}`,
              text: filterOptions.filter_reset_button_text
            } ) );
          }
        }

        if ( filterOptions.select_type !== undefined ) {
          initializeSelectPlugin( filterOptions.select_type, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number_str}` ), filterOptions.select_type_options );

          if ( filterOptions.cumulative_filtering === true && filterOptions.select_type === 'chosen' ) {
            refreshSelectPlugin( filterOptions, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number_str}` ) );
          }
        }
        break;
      default:
        alert( 'Filters Multiple Tables does not support ' + filterOptions.filter_type );
    }
  }

  function initMultipleTables( tablesArray, filtersOptions ) {
    let i,
      tablesSelectors = '',
      default_options = {
        filter_type: 'text',
        filter_container_id: '',
        filter_reset_button_text: 'x',
        case_insensitive: true
      },
      columnsObj,
      columnsArrIndex,
      column_number_str,
      dummyArr;

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

      column_number_str = columnsArrayToString( columnsObj.column_number ).column_number_str;

      columnsObj.column_number_str = column_number_str;

      dummyArr.push( columnsObj );

      tablesSelectors = '';

      for ( i = 0; i < tablesArray.length; i++ ) {
        if ( tablesArray[ i ].table !== undefined ) {
          tablesSelectors += tablesArray[ i ].table().node().id + ',';
        } else {
          tablesSelectors += getSettingsObjFromTable( tablesArray[ i ] ).sTableId;
        }
      }

      tablesSelectors = tablesSelectors.substring( 0, tablesSelectors.length - 1 );

      setOptions( tablesSelectors + '_' + column_number_str, dummyArr, {});

      oTables[ tablesSelectors ] = tablesArray;

      appendFiltersMultipleTables( tablesArray, tablesSelectors, columnsObj );
    }
  }

  function initMultipleColumns( table, filtersOptions ) {
    let tablesArray = [];
    tablesArray.push( table );
    initMultipleTables( tablesArray, filtersOptions );
  }

  function close3rdPPluginsNeededClose( evt ) {
    if ( closeBootstrapDatepickerRange ) {
      $( '.yadcf-filter-range-date' ).not( $( evt.target ) ).datepicker( 'hide' );
    }

    if ( closeBootstrapDatepicker ) {
      $( '.yadcf-filter-date' ).not( $( evt.target ) ).datepicker( 'hide' );
    }

    if ( closeSelect2 ) {
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

  function stopPropagation( evt ) {
    close3rdPPluginsNeededClose( evt );

    if ( evt.stopPropagation !== undefined ) {
      evt.stopPropagation();
    } else {
      evt.cancelBubble = true;
    }
  }

  function preventDefaultForEnter( evt ) {
    ctrlPressed = false;

    if ( evt.keyCode === 13 ) {
      if ( evt.preventDefault ) {
        evt.preventDefault();
      } else {
        evt.returnValue = false;
      }
    }

    if ( evt.keyCode == 65 && evt.ctrlKey ) {
      ctrlPressed = true;
      evt.target.select();
      return;
    }

    if ( evt.ctrlKey && ( evt.keyCode == 67 || evt.keyCode == 88 ) ) {
      ctrlPressed = true;
      return;
    }
  }

  //--------------------------------------------------------
  function exInternalFilterColumnAJAXQueue( table_arg, col_filter_arr ) {
    return function() {
      exFilterColumn( table_arg, col_filter_arr, true );
    };
  }

  function exFilterColumn( table_arg, col_filter_arr, ajaxSource ) {
    let table_selector_jq_friendly,
      j,
      tmpStr,
      column_number,
      column_position,
      filter_value,
      fromId,
      toId,
      sliderId,
      optionsObj,
      min,
      max,
      exclude = false;

    // Check if the table arg is from new datatables API (capital 'D').
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[ 0 ].oInstance;
    }

    table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( table_arg );

    if ( isDOMSource( table_arg ) || ajaxSource === true ) {
      for ( j = 0; j < col_filter_arr.length; j++ ) {
        column_number = col_filter_arr[ j ][ 0 ];
        column_position = column_number;
        exclude = false;

        if ( plugins[ table_selector_jq_friendly ] !== undefined && ( plugins[ table_selector_jq_friendly ] !== undefined && plugins[ table_selector_jq_friendly ].ColReorder !== undefined ) ) {
          column_position = plugins[ table_selector_jq_friendly ].ColReorder[ column_number ];
        }

        optionsObj = getOptions( table_arg.selector )[ column_number ];

        filter_value = col_filter_arr[ j ][ 1 ];

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

            tmpStr = yadcfMatchFilterString( table_arg, column_position, filter_value, optionsObj.filter_match_mode, false, exclude );

            table_arg.fnSettings().aoPreSearchCols[ column_position ].sSearch = tmpStr;
            break;

          case 'select':
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( filter_value );

            if ( filter_value !== '' ) {
              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).addClass( 'inuse' );
            } else {
              $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).removeClass( 'inuse' );
            }

            tmpStr = yadcfMatchFilterString( table_arg, column_position, filter_value, optionsObj.filter_match_mode, false );

            table_arg.fnSettings().aoPreSearchCols[ column_position ].sSearch = tmpStr;

            if ( optionsObj.select_type !== undefined ) {
              refreshSelectPlugin( optionsObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ) );
            }
            break;

          case 'multi_select':
            $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ).val( filter_value );

            tmpStr = yadcfMatchFilterString( table_arg, column_position, filter_value, optionsObj.filter_match_mode, true );

            table_arg.fnSettings().aoPreSearchCols[ column_position ].sSearch = tmpStr;

            if ( optionsObj.select_type !== undefined ) {
              refreshSelectPlugin( optionsObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ) );
            }
            break;

          case 'range_date':
            fromId = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`;

            toId = `yadcf-filter-${table_selector_jq_friendly}-to-date-${column_number}`;

            $( '#' + fromId ).val( filter_value.from );

            if ( filter_value.from !== '' ) {
              $( '#' + fromId ).addClass( 'inuse' );
            } else {
              $( '#' + fromId ).removeClass( 'inuse' );
            }

            $( '#' + toId ).val( filter_value.to );

            if ( filter_value.to !== '' ) {
              $( '#' + toId ).addClass( 'inuse' );
            } else {
              $( '#' + toId ).removeClass( 'inuse' );
            }

            if ( table_arg.fnSettings().oFeatures.bServerSide === true ) {
              min = filter_value.from;
              max = filter_value.to;
              table_arg.fnSettings().aoPreSearchCols[ column_position ].sSearch = min + optionsObj.custom_range_delimiter + max;
            }

            saveStateSave( table_arg, column_number: number, table_selector_jq_friendly: string, filter_value.from, filter_value.to );
            break;

          case 'range_number':
            fromId = `yadcf-filter-${table_selector_jq_friendly}-from-${column_number}`;

            toId = `yadcf-filter-${table_selector_jq_friendly}-to-${column_number}`;

            $( '#' + fromId ).val( filter_value.from );

            if ( filter_value.from !== '' ) {
              $( '#' + fromId ).addClass( 'inuse' );
            } else {
              $( '#' + fromId ).removeClass( 'inuse' );
            }

            $( '#' + toId ).val( filter_value.to );

            if ( filter_value.to !== '' ) {
              $( '#' + toId ).addClass( 'inuse' );
            } else {
              $( '#' + toId ).removeClass( 'inuse' );
            }

            if ( table_arg.fnSettings().oFeatures.bServerSide === true ) {
              table_arg.fnSettings().aoPreSearchCols[ column_position ].sSearch = filter_value.from + optionsObj.custom_range_delimiter + filter_value.to;
            }

            saveStateSave( table_arg, column_number: number, table_selector_jq_friendly: string, filter_value.from, filter_value.to );
            break;

          case 'range_number_slider':
            sliderId = `yadcf-filter-${table_selector_jq_friendly}-slider-${column_number}`;
            fromId = `yadcf-filter-${table_selector_jq_friendly}-min_tip-${column_number}`;
            toId = `yadcf-filter-${table_selector_jq_friendly}-max_tip-${column_number}`;

            if ( filter_value.from !== '' ) {
              min = $( '#' + fromId ).closest( '.yadcf-filter-range-number-slider' ).find( '.yadcf-filter-range-number-slider-min-tip-hidden' ).text();

              max = $( '#' + fromId ).closest( '.yadcf-filter-range-number-slider' ).find( '.yadcf-filter-range-number-slider-max-tip-hidden' ).text();

              $( '#' + fromId ).text( filter_value.from );

              if ( min !== filter_value.from ) {
                $( '#' + fromId ).parent().addClass( 'inuse' );
                $( '#' + fromId ).parent().parent().find( 'ui-slider-range' ).addClass( 'inuse' );
              } else {
                $( '#' + fromId ).parent().removeClass( 'inuse' );
                $( '#' + fromId ).parent().parent().find( 'ui-slider-range' ).removeClass( 'inuse' );
              }

              // $( '#' + sliderId ).slider( 'values', 0, filter_value.from );
            }

            if ( filter_value.to !== '' ) {
              $( '#' + toId ).text( filter_value.to );

              if ( max !== filter_value.to ) {
                $( '#' + toId ).parent().addClass( 'inuse' );
                $( '#' + toId ).parent().parent().find( '.ui-slider-range' ).addClass( 'inuse' );
              } else {
                $( '#' + toId ).parent().removeClass( 'inuse' );
                $( '#' + toId ).parent().parent().find( '.ui-slider-range' ).removeClass( 'inuse' );
              }

              // $( '#' + sliderId ).slider( 'values', 1, filter_value.to );
            }

            if ( table_arg.fnSettings().oFeatures.bServerSide === true ) {
              table_arg.fnSettings().aoPreSearchCols[ column_position ].sSearch = filter_value.from + optionsObj.custom_range_delimiter + filter_value.to;
            }

            saveStateSave( table_arg, column_number: number, table_selector_jq_friendly: string, filter_value.from, filter_value.to );
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

            if ( table_arg.fnSettings().oFeatures.bServerSide === true ) {
              table_arg.fnSettings().aoPreSearchCols[ column_position ].sSearch = filter_value;
            }

            if ( optionsObj.select_type !== undefined ) {
              refreshSelectPlugin( optionsObj, $( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` ), filter_value );
            }

            saveStateSave( table_arg, column_number: number, table_selector_jq_friendly: string, filter_value, '' );
            break;
        }
      }

      if ( table_arg.fnSettings().oFeatures.bServerSide !== true ) {
        table_arg.fnDraw();
      } else {
        setTimeout( function() {
          table_arg.fnDraw();
        }, 10 );
      }
    } else {
      exFilterColumnQueue.push( exInternalFilterColumnAJAXQueue( table_arg, col_filter_arr ) );
    }
  }

  function exGetColumnFilterVal( table_arg, column_number: number ) {
    let retVal,
      fromId,
      toId,
      table_selector_jq_friendly,
      optionsObj,
      $filterElement;

    // Check if the table arg is from new datatables API (capital 'D').
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[ 0 ].oInstance;
    }

    optionsObj = getOptions( table_arg.selector )[ column_number ];

    table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( table_arg );

    let selectorePrefix = '';
    let settingsDt = getSettingsObjFromTable( table_arg );

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
        toId = `yadcf-filter-${table_selector_jq_friendly}-to-date-${column_number}`;

        retVal.from = $( selectorePrefix + '#' + fromId ).val();
        retVal.to = $( selectorePrefix + '#' + toId ).val();
        break;
      case 'range_number':
        retVal = {};
        fromId = `yadcf-filter-${table_selector_jq_friendly}-from-${column_number}`;
        toId = `yadcf-filter-${table_selector_jq_friendly}-to-${column_number}`;

        retVal.from = $( selectorePrefix + '#' + fromId ).val();
        retVal.to = $( selectorePrefix + '#' + toId ).val();
        break;
      case 'range_number_slider':
        retVal = {};
        fromId = `yadcf-filter-${table_selector_jq_friendly}-min_tip-${column_number}`;
        toId = `yadcf-filter-${table_selector_jq_friendly}-max_tip-${column_number}`;

        retVal.from = $( selectorePrefix + '#' + fromId ).text();
        retVal.to = $( selectorePrefix + '#' + toId ).text();

        break;
      default:
        console.log( 'exGetColumnFilterVal error: no such filter_type: ' + optionsObj.filter_type );
    }
    return retVal;
  }

  function clearStateSave( oTable, column_number: number, table_selector_jq_friendly: string ) {
    let yadcfState;

    if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
      if ( !oTable.fnSettings().oLoadedState ) {
        oTable.fnSettings().oLoadedState = {};
        oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
      }

      if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
        oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = undefined;
      } else {
        yadcfState = {};
        yadcfState[ table_selector_jq_friendly ] = [];
        yadcfState[ table_selector_jq_friendly ][ column_number ] = undefined;
        oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
      }

      oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
    }
  }

  function saveStateSave( oTable, column_number: number, table_selector_jq_friendly: string, from, to ) {
    let yadcfState;
    if ( oTable.fnSettings().oFeatures.bStateSave === true ) {
      if ( !oTable.fnSettings().oLoadedState ) {
        oTable.fnSettings().oLoadedState = {};
      }
      if ( oTable.fnSettings().oLoadedState.yadcfState !== undefined && oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ] !== undefined ) {
        oTable.fnSettings().oLoadedState.yadcfState[ table_selector_jq_friendly ][ column_number ] = {
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
        oTable.fnSettings().oLoadedState.yadcfState = yadcfState;
      }
      oTable.fnSettings().oApi._fnSaveState( oTable.fnSettings() );
    }
  }

  function exResetAllFilters( table_arg, noRedraw, columns ) {
    let table_selector_jq_friendly,
      column_number,
      fromId,
      toId,
      sliderId,
      tableOptions,
      optionsObj,
      columnObjKey,
      settingsDt,
      i,
      $filterElement;

    // Check if the table arg is from new datatables API (capital 'D').
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[ 0 ].oInstance;
    }

    tableOptions = getOptions( table_arg.selector );
    table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( table_arg );
    settingsDt = getSettingsObjFromTable( table_arg );

    for ( columnObjKey in tableOptions ) {
      if ( tableOptions.hasOwnProperty( columnObjKey ) ) {
        optionsObj = tableOptions[ columnObjKey ];
        column_number = optionsObj.column_number;

        if ( columns !== undefined && $.inArray( column_number, columns ) === -1 ) {
          continue;
        }

        $( document ).removeData( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val' );

        let selectorePrefix = '';

        if ( optionsObj.filters_position === 'tfoot' && settingsDt.oScroll.sX ) {
          selectorePrefix = '.dataTables_scrollFoot ';
        }

        $filterElement = $( selectorePrefix + `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` );

        switch ( optionsObj.filter_type ) {
          case 'select':
          case 'custom_func':
            resetExcludeRegexCheckboxes( $filterElement.parent() );

            clearStateSave( table_arg, column_number: number, table_selector_jq_friendly );

            $filterElement.val( '-1' ).removeClass( 'inuse' );

            table_arg.fnSettings().aoPreSearchCols[ column_number ].sSearch = '';

            if ( optionsObj.select_type !== undefined ) {
              refreshSelectPlugin( optionsObj, $filterElement, '-1' );
            }
            break;
          case 'auto_complete':
          case 'text':
            $filterElement.prop( 'disabled', false );

            $filterElement.val( '' ).removeClass( 'inuse inuse-exclude inuse-regex' );

            table_arg.fnSettings().aoPreSearchCols[ column_number ].sSearch = '';

            resetExcludeRegexCheckboxes( $filterElement.parent() );

            clearStateSave( table_arg, column_number: number, table_selector_jq_friendly );
            break;
          case 'date':
            $filterElement.val( '' ).removeClass( 'inuse' );

            table_arg.fnSettings().aoPreSearchCols[ column_number ].sSearch = '';

            if ( $filterElement.prev().hasClass( 'yadcf-exclude-wrapper' ) ) {
              $filterElement.prev().find( 'input' ).prop( 'checked', false );
            }
            break;
          case 'multi_select':
          case 'multi_select_custom_func':
            $filterElement.val( '-1' );

            $( document ).data( `#yadcf-filter-${table_selector_jq_friendly}-${column_number}` + '_val', undefined );

            table_arg.fnSettings().aoPreSearchCols[ column_number ].sSearch = '';

            if ( optionsObj.select_type !== undefined ) {
              refreshSelectPlugin( optionsObj, $filterElement, '-1' );
            }
            break;
          case 'range_date':
            fromId = `yadcf-filter-${table_selector_jq_friendly}-from-date-${column_number}`;
            toId = `yadcf-filter-${table_selector_jq_friendly}-to-date-${column_number}`;
            $( selectorePrefix + '#' + fromId ).val( '' );
            $( selectorePrefix + '#' + fromId ).removeClass( 'inuse' );
            $( selectorePrefix + '#' + toId ).val( '' );
            $( selectorePrefix + '#' + toId ).removeClass( 'inuse' );

            if ( table_arg.fnSettings().oFeatures.bServerSide === true ) {
              table_arg.fnSettings().aoPreSearchCols[ column_number ].sSearch = '';
            }

            clearStateSave( table_arg, column_number: number, table_selector_jq_friendly );
            break;
          case 'range_number':
            fromId = `yadcf-filter-${table_selector_jq_friendly}-from-${column_number}`;
            toId = `yadcf-filter-${table_selector_jq_friendly}-to-${column_number}`;
            $( selectorePrefix + '#' + fromId ).prop( 'disabled', false );
            $( selectorePrefix + '#' + fromId ).val( '' );
            $( selectorePrefix + '#' + fromId ).removeClass( 'inuse inuse-exclude' );
            $( selectorePrefix + '#' + toId ).prop( 'disabled', false );
            $( selectorePrefix + '#' + toId ).val( '' );
            $( selectorePrefix + '#' + toId ).removeClass( 'inuse inuse-exclude' );

            if ( table_arg.fnSettings().oFeatures.bServerSide === true ) {
              table_arg.fnSettings().aoPreSearchCols[ column_number ].sSearch = '';
            }

            resetExcludeRegexCheckboxes( $( selectorePrefix + '#' + fromId ).parent().parent() );
            clearStateSave( table_arg, column_number: number, table_selector_jq_friendly );
            break;
          case 'range_number_slider':
            sliderId = `yadcf-filter-${table_selector_jq_friendly}-slider-${column_number}`;
            fromId = `yadcf-filter-${table_selector_jq_friendly}-min_tip-${column_number}`;
            toId = `yadcf-filter-${table_selector_jq_friendly}-max_tip-${column_number}`;
            $( selectorePrefix + '#' + fromId ).text( '' );
            $( selectorePrefix + '#' + fromId ).parent().removeClass( 'inuse' );
            $( selectorePrefix + '#' + fromId ).parent().parent().find( 'ui-slider-range' ).removeClass( 'inuse' );
            $( selectorePrefix + '#' + toId ).text( '' );
            $( selectorePrefix + '#' + toId ).parent().removeClass( 'inuse' );
            $( selectorePrefix + '#' + toId ).parent().parent().find( '.ui-slider-range' ).removeClass( 'inuse' );
            // $( selectorePrefix + '#' + sliderId ).slider( 'option', 'values', [ $( '#' + fromId ).parent().parent().find( '.yadcf-filter-range-number-slider-min-tip-hidden' ).text(), $( '#' + fromId ).parent().parent().find( '.yadcf-filter-range-number-slider-max-tip-hidden' ).text() ] );

            if ( table_arg.fnSettings().oFeatures.bServerSide === true ) {
              table_arg.fnSettings().aoPreSearchCols[ column_number ].sSearch = '';
            }

            clearStateSave( table_arg, column_number: number, table_selector_jq_friendly );
            break;
        }
      }
    }

    if ( noRedraw !== true ) {
      // Clear global filter.
      settingsDt.oPreviousSearch.sSearch = '';

      if ( typeof settingsDt.aanFeatures.f !== 'undefined' ) {
        for ( i = 0; i < settingsDt.aanFeatures.f.length; i++ ) {
          $( 'input', settingsDt.aanFeatures.f[ i ] ).val( '' );
        }
      }

      // End of clear global filter.
      table_arg.fnDraw( settingsDt );
    }
  }

  function exResetFilters( table_arg, columns, noRedraw ) {
    exResetAllFilters( table_arg, noRedraw, columns );
  }

  function exFilterExternallyTriggered( table_arg ) {
    let columnsObj,
      columnObjKey,
      columnObj,
      filterValue,
      filtersValuesSingleElem,
      filtersValuesArr = [];

    // Check if the table arg is from new datatables API (capital 'D').
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[ 0 ].oInstance;
    }

    columnsObj = getOptions( table_arg.selector );

    for ( columnObjKey in columnsObj ) {
      if ( columnsObj.hasOwnProperty( columnObjKey ) ) {
        columnObj = columnsObj[ columnObjKey ];
        filterValue = exGetColumnFilterVal( table_arg, columnObj.column_number );
        filtersValuesSingleElem = [];
        filtersValuesSingleElem.push( columnObj.column_number );
        filtersValuesSingleElem.push( filterValue );
        filtersValuesArr.push( filtersValuesSingleElem );
      }
    }

    exFilterColumn( table_arg, filtersValuesArr, true );
  }

  function getProp( nestedObj, keys ) {
    let pathArr = Array.isArray( keys ) ? keys : keys.split( '.' );
    return pathArr.reduce( ( obj, key ) =>
      ( obj && obj[ key ] !== 'undefined' ) ? obj[ key ] : undefined, nestedObj );
  }

  function setProp( object, keys, val ) {
    keys = Array.isArray( keys ) ? keys : keys.split( '.' );
    if ( keys.length > 1 ) {
      object[ keys[ 0 ] ] = object[ keys[ 0 ] ] || {};
      setProp( object[ keys[ 0 ] ], keys.slice( 1 ), val );
      return;
    }
    object[ keys[ 0 ] ] = val;
  }

  function resetExcludeRegexCheckboxes( selector ) {
    selector.find( '.yadcf-exclude-wrapper :checkbox' ).prop( 'checked', false );
    selector.find( '.yadcf-regex-wrapper :checkbox' ).prop( 'checked', false );
    selector.find( '.yadcf-null-wrapper :checkbox' ).prop( 'checked', false );
  }

  function exRefreshColumnFilterWithDataProp( table_arg, col_num, updatedData ) {
    if ( table_arg.settings !== undefined ) {
      table_arg = table_arg.settings()[ 0 ].oInstance;
    }

    let columnsObj = getOptions( table_arg.selector );
    let columnObj = columnsObj[ col_num ];

    columnObj.data = updatedData;

    let table_selector_jq_friendly = yadcf.generateTableSelectorJQFriendly2( table_arg );

    refreshSelectPlugin( columnObj, $( '#yadcf-filter-' + table_selector_jq_friendly + '-' + col_num ) );
  }

  return {
    autocompleteKeyUP: autocompleteKeyUP,
    dateKeyUP: dateKeyUP,
    dateSelectSingle: dateSelectSingle,
    doFilter: doFilter,
    doFilterAutocomplete: doFilterAutocomplete,
    exFilterColumn: exFilterColumn,
    doFilterCustomDateFunc: doFilterCustomDateFunc,
    doFilterMultiSelect: doFilterMultiSelect,
    doFilterMultiTables: doFilterMultiTables,
    doFilterMultiTablesMultiSelect: doFilterMultiTablesMultiSelect,
    exFilterColumn: exFilterColumn,
    exFilterExternallyTriggered: exFilterExternallyTriggered,
    exGetColumnFilterVal: exGetColumnFilterVal,
    exRefreshColumnFilterWithDataProp: exRefreshColumnFilterWithDataProp,
    exResetAllFilters: exResetAllFilters,
    exResetFilters: exResetFilters,
    eventTargetFixUp: eventTargetFixUp,
    generateTableSelectorJQFriendlyNew: generateTableSelectorJQFriendlyNew,
    generateTableSelectorJQFriendly2: generateTableSelectorJQFriendly2,
    getOptions: getOptions,
    init: init,
    initDefaults: initDefaults,
    initMultipleColumns: initMultipleColumns,
    initMultipleTables: initMultipleTables,
    initOnDtXhrComplete: initOnDtXhrComplete,
    initSelectPluginCustomTriggers: initSelectPluginCustomTriggers,
    nullChecked: nullChecked,
    preventDefaultForEnter: preventDefaultForEnter,
    rangeClear: rangeClear,
    rangeDateKeyUP: rangeDateKeyUP,
    rangeNumberKeyUP: rangeNumberKeyUP,
    rangeNumberSliderClear: rangeNumberSliderClear,
    stopPropagation: stopPropagation,
    textKeyUP: textKeyUP,
    textKeyUpMultiTables: textKeyUpMultiTables,
  };
