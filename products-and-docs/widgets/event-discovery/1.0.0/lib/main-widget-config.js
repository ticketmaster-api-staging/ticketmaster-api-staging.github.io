'use strict';

(function () {

  function getHeightByTheme(theme) {
    return theme === 'simple' ? 286 : 339;
  }

  function getBorderByTheme(theme) {
    switch (theme) {
      case 'simple':
        return 0;
        break;
      default:
        return 2;
    }
  }

  var googleApiKey = "AIzaSyBQrJ5ECXDaXVlICIdUBOe8impKIGHDzdA";

  var widget = widgetsEventDiscovery[0],
      themeConfig = {
    sizes: {
      s: {
        width: 160,
        height: 300,
        layout: 'horizontal'
      },
      m: {
        width: 160,
        height: 300,
        layout: 'horizontal'
      },
      l: {
        width: 160,
        height: 300,
        layout: 'horizontal'
      },
      xl: {
        width: 160,
        height: 300,
        layout: 'horizontal'
      },
      xxl: {
        width: 300,
        height: 600,
        layout: 'vertical'
      },
      custom: {
        width: 350,
        height: 600,
        layout: 'vertical'
      }
    },
    initSliderSize: {
      width: 350,
      height: 600,
      maxWidth: 500,
      minWidth: 350
    }
  },
      isPostalCodeChanged = false;

  var $widthController = $('#w-width').slider({
    tooltip: 'always',
    handle: 'square'
  }),
      $borderRadiusController = $('#w-borderradius').slider({
    tooltip: 'always',
    handle: 'square'
  }),
      $colorSchemeSelector = $('.widget__color_scheme_control');

  $('#js_styling_nav_tab').on('shown.bs.tab', function (e) {
    $widthController.slider('relayout');
    $borderRadiusController.slider('relayout');
  });

  var changeState = function changeState(event) {
    if (!event.target.name || event.target.name === "w-googleapikey") return;

    var widgetNode = document.querySelector("div[w-tmapikey]"),
        targetValue = event.target.value,
        targetName = event.target.name,
        $tabButtons = $('.js-tab-buttons');

    if (targetName === "w-postalcode") {
      widgetNode.setAttribute('w-country', '');
      isPostalCodeChanged = true;
    }

    if (targetName === "w-theme") {
      if (targetValue === 'simple') {
        $colorSchemeSelector.hide();
      } else {
        $colorSchemeSelector.show();
      }

      if (widgetNode.getAttribute('w-layout') === 'horizontal') {
        widgetNode.setAttribute('w-height', getHeightByTheme(targetValue));
      }
      widgetNode.setAttribute('w-border', getBorderByTheme(targetValue));
    }

    if (targetName === "w-layout") {
      var sizeConfig = themeConfig.initSliderSize;
      if (targetValue === 'horizontal') {
        sizeConfig = {
          width: 620,
          height: getHeightByTheme(widgetNode.getAttribute('w-theme')),
          maxWidth: 900,
          minWidth: 620
        };
      }

      $widthController.slider({
        setValue: sizeConfig.width,
        max: sizeConfig.maxWidth,
        min: sizeConfig.minWidth
      }).slider('refresh');

      widgetNode.setAttribute('w-width', sizeConfig.width);
      widgetNode.setAttribute('w-height', sizeConfig.height);
    }

    //Check fixed sizes for 'simple' theme
    if (targetName === "w-proportion") {
      var widthSlider = $('.js_widget_width_slider');
      var _sizeConfig = {
        width: themeConfig.sizes[targetValue].width,
        height: themeConfig.sizes[targetValue].height,
        maxWidth: 600,
        minWidth: 350
      };

      //set layout
      widgetNode.setAttribute('w-layout', themeConfig.sizes[targetValue].layout);

      if (targetValue !== 'custom') {
        $tabButtons.slideUp("fast");
        widthSlider.slideUp("fast");
      } else {
        $tabButtons.slideDown("fast");
        widthSlider.slideDown("fast");
        $('input:radio[name="w-layout"][value="vertical"]', $tabButtons).prop('checked', true);

        _sizeConfig = { //default size
          width: themeConfig.initSliderSize.width, //350
          height: themeConfig.initSliderSize.height, //600
          maxWidth: themeConfig.initSliderSize.maxWidth, //500
          minWidth: themeConfig.initSliderSize.minWidth // 350
        };
        $widthController.slider({
          setValue: _sizeConfig.width,
          max: _sizeConfig.maxWidth,
          min: _sizeConfig.minWidth
        }).slider('refresh');
      }

      widgetNode.setAttribute('w-width', _sizeConfig.width);
      widgetNode.setAttribute('w-height', _sizeConfig.height);
    }

    widgetNode.setAttribute(event.target.name, event.target.value);
    widget.update();
  };

  var resetWidget = function resetWidget(configForm) {
    var widgetNode = document.querySelector("div[w-tmapikey]"),
        height = 600,
        theme = void 0,
        layout = void 0;
    var widthSlider = $('.js_widget_width_slider'),
        $tabButtons = $('.js-tab-buttons');

    configForm.find("input[type='text'], input[type='number']").each(function () {
      var $self = $(this),
          data = $self.data(),
          value = data.defaultValue;

      if (data.sliderValue) {
        value = data.sliderValue;
        $self.slider({
          setValue: value,
          max: data.sliderMax,
          min: data.sliderMin
        }).slider('refresh');
      } else {
        $self.val(value);
      }

      widgetNode.setAttribute($self.attr('name'), value);
    });

    configForm.find("input[type='radio']").each(function () {
      var $self = $(this);
      if ($self.data('is-checked')) {
        var name = $self.attr('name'),
            val = $self.val();
        if (name === 'w-theme') {
          theme = val;
        } else if (name === 'w-layout') {
          layout = val;
        } else if (name === 'w-proportion') {
          $tabButtons.slideDown("fast");
          widthSlider.slideDown("fast");
        }
        $self.prop('checked', true);
        widgetNode.setAttribute($self.attr('name'), val);
      }
    });

    if (layout === 'horizontal') {
      height = getHeightByTheme(theme);
    }
    widgetNode.setAttribute('w-height', height);
    widgetNode.setAttribute('w-border', 0);

    $('.country-select .js_custom_select').removeClass('custom_select-opened'); //reset custom select
    widget.onLoadCoordinate();
    widget.update();
  };

  var $configForm = $(".main-widget-config-form"),
      $widgetModal = $('#js_widget_modal'),
      $widgetModalNoCode = $('#js_widget_modal_no_code');

  $configForm.on("change", changeState);
  // Mobile devices. Force 'change' by 'Go' press
  $configForm.on("submit", function (e) {
    $configForm.find('input:focus').trigger('blur');
    e.preventDefault();
  });

  $configForm.find("input[type='text'], input[type='number']").each(function () {
    var $self = $(this);
    $self.data('default-value', $self.val());
  });

  $configForm.find("input[type='radio']").each(function () {
    var $self = $(this);
    if ($self.is(':checked')) $self.data('is-checked', 'checked');
  });

  $('.js_get_widget_code').on('click', function () {
    var codeCont = document.querySelector(".language-html.widget_dialog__code");
    var htmlCode = document.createElement("div");
    for (var key in widget.config) {
      if (key !== 'latlong') {
        htmlCode.setAttribute("w-" + key, widget.config[key]);
      }
    }
    // Use only Key from config form
    // htmlCode.setAttribute('w-googleapikey', $('#w-googleapikey').val() || '');
    htmlCode.setAttribute('w-googleapikey', googleApiKey);
    var tmp = document.createElement("div");
    tmp.appendChild(htmlCode);
    codeCont.textContent = tmp.innerHTML;
    $widgetModal.modal();
  });

  $('.js_reset_widget').on('click', function () {
    resetWidget($configForm);
  });

  $('#js_widget_modal__close').on('click', function () {
    $widgetModal.modal('hide');
  });

  $('#js_widget_modal_no_code__close').on('click', function () {
    $widgetModalNoCode.modal('hide');
  });

  $('.js_widget__number').on('change', function (e) {
    var $self = $(this),
        val = $self.val().trim(),
        max = parseInt($self.attr('max')),
        min = parseInt($self.attr('min')),
        required = !!$self.attr('required'),
        regNumberOrEmpty = /^(\s*|\d+)$/,
        errorCssClass = 'error';

    // if(val === '') $self.val('');

    if (max && val > max || min && val < min || required && val === '' || !regNumberOrEmpty.test(val)) {
      $self.addClass(errorCssClass);
      e.preventDefault();
      e.stopPropagation();
    } else {
      $self.removeClass(errorCssClass);
    }
  });

  widget.onLoadCoordinate = function (results) {
    var countryShortName = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    widget.config['country'] = countryShortName;
    if (isPostalCodeChanged) {
      isPostalCodeChanged = false;

      var $countrySelect = $('#w-country'),
          $ul = $(".js_widget_custom__list"),
          options = "<option selected value=''>All</option>";

      $countrySelect.html('');
      $ul.html(''); //clear custom select list
      $countrySelect.prop('disabled', !results);
      if (results) {
        $countrySelect.prop('disabled', !results.length);
        options = '';
        for (var i in results) {
          var result = results[i];
          if (result.address_components) {
            var country = result.address_components[result.address_components.length - 1];
            if (country) {
              var isSelected = country.short_name === countryShortName ? 'selected' : '';
              options += '<option ' + isSelected + ' value="' + country.short_name + '">' + country.long_name + '</option>';
            }
          }
        }
      }

      $countrySelect.append(options);
      addCustomList($ul, '#w-country', countryShortName);
    }
  };

  function addCustomList(listWrapperElement, listWrapperId, activeVal) {
    var $listOption = $(listWrapperId).find('option'),
        //update list
    $placeholder = $(".country-select").find(".custom_select__placeholder"),
        $ul = listWrapperElement;

    $placeholder.val($listOption.html());

    $listOption.each(function () {
      var data = {
        value: $(this).val()
      };
      $ul.append('<li class="custom_select__item ' + (activeVal === data.value ? 'custom_select__item-active' : '') + '" data-value="' + data.value + '">' + $(this).text() + '</li>');
    });
  }
})();
//# sourceMappingURL=main-widget-config.js.map