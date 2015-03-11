Requests = {
    QueryString : function(item){
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
        return svalue ? svalue[1] : false;
    }
}

jQuery(document).ready(function ($) {

    $.unserialize = function(serializedString){
        var str = decodeURI(serializedString);
        var pairs = str.split('&');
        var obj = {}, p, idx;
        for (var i=0, n=pairs.length; i < n; i++) {
            p = pairs[i].split('=');
            idx = p[0];
            if (obj[idx] === undefined) {
                obj[idx] = decodeURIComponent(p[1]);
            }else{
                if (typeof obj[idx] == "string") {
                    obj[idx]=[obj[idx]];
                }
                obj[idx].push(decodeURIComponent(p[1]));
            }
        }
        return obj;
    };

    $('div.pblg-checkout-opt').click(function () {
        var values = $('input', this).val().split(':');

        $level = parseInt(values[0]);
        $period = parseInt(values[1]);

        $('#psts_level').val( $level );
        $('#psts_period').val( $period );
        $('div.pblg-checkout-opt').removeClass('opt-selected');
        $('tr.psts_level td').removeClass('opt-selected');
        $(this).addClass('opt-selected');
        $(this).parent().addClass('opt-selected');

        /** Hide Credit Card Options if Free Level is selected at checkout **/
        if ( $level == 0 && $period == 0 ) {
            //Stripe
            if ( jQuery('#psts-stripe-checkout').length > 0 ) {
                jQuery('#psts-stripe-checkout h2').hide();
            }
            //Paypal Pro heading
            if( jQuery('#psts-cc-checkout').length > 0 ){
                jQuery('#psts-cc-checkout h2').hide();
            }
            //Paypal
            if ( jQuery('#psts-paypal-checkout').length > 0 ) {
                jQuery('#psts-paypal-checkout').hide();
            }
            jQuery ('#psts-cc-table').fadeOut();
        }else {
            if ( jQuery('#psts-stripe-checkout').length > 0 ) {
                jQuery('#psts-stripe-checkout h2').show();
            }
            if( jQuery('#psts-cc-checkout').length > 0 ){
                jQuery('#psts-cc-checkout h2').show();
            }
            //Paypal
            if ( jQuery('#psts-paypal-checkout').length > 0 ) {
                jQuery('#psts-paypal-checkout').show();
            }
            jQuery ('#psts-cc-table').fadeIn();
        }

    });

    jQuery('#psts-coupon-link').click(function () {
        $('#psts-coupon-link').hide();
        $('#psts-coupon-code').show();
        return false;
    });

    jQuery('#psts-receipt-change a').click(function () {
        $('#psts-receipt-change').hide();
        $('#psts-receipt-input').show();
        return false;
    });
    // Bind events for the pricing table
    if (jQuery('#plans-table > .tab-menu').length > 0) {
        jQuery('#plans-table > .tab-menu > li > a')
            .unbind('click')
            .bind('click', function (event) {
            event.preventDefault();
            jQuery('#plans-table > .tab-menu > li').removeClass('selected');
            jQuery(this).parent().addClass('selected');
            var selected_period = jQuery('.tab-menu > .selected.period > a').data('period');
            jQuery('#psts_period').val(selected_period);
            jQuery('.plan.description > li.column').hide();
            var enabled_lists = ".plan.description > li.period_" + selected_period;
            jQuery('.plan.description > li.column:first-child()').show();
            jQuery(enabled_lists).show();
        });
    }
    if (jQuery('.button.choose-plan').length > 0) {
        jQuery('.button.choose-plan')
            .unbind('click')
            .bind('click', function (event) {
            event.preventDefault();
            var selected_period = jQuery('.tab-menu > .selected.period > a').data('period');
            var selected_level = jQuery(this).data('level');
            var selected_level_classname = jQuery(this).data('level-name');
            jQuery('.column').removeClass('selected');
            var selector = '.column.' + selected_level_classname;
            jQuery(selector).addClass('selected');
            jQuery('#psts_period').val(selected_period);
            jQuery('#psts_level').val(selected_level);
        });
        jQuery('.module.features .feature-name.column')
            .unbind('mouseover')
            .bind('mouseover', function (event) {
            jQuery('.helper.wrapper').hide();
            jQuery(this).find('.helper.wrapper').show();
        })
            .unbind('mouseout')
            .bind('mouseout', function (event) {
            jQuery('.helper.wrapper').hide();
        });
    }

    /* New checkout form */
    $('.pricing-column .period-selector select').change( function( e ) {
        var element = e.currentTarget;
        var period_class = $( element).val();
        var period = parseInt( period_class.replace( 'price_', '' ) );

        // Set the period required for gateways... also set it on the pricing table
        $('.gateways [name=period]').val( period );
        $('#prosites-checkout-table').attr('data-period', period);

        $('.pricing-column [class*="price_"]').removeClass('hide');
        $('.pricing-column [class*="price_"]').hide();
        $('.pricing-column [class$="' + period_class + '"]').show();
        set_same_height( $('.pricing-column .title') );
        set_same_height( $('.pricing-column .summary'), false );
        set_same_height( $('.pricing-column .sub-title'), false );
    } );

    function set_same_height( elements, use_featured ) {
        var max_height = 0;

        if( typeof( use_featured ) == 'undefined' ) {
            use_featured = true;
        }

        // reset heights
        $( elements).css('height','auto');

        $.each( elements, function( index, item ) {
            var item_height = $(item).height();
            if( $( item).parents('.pricing-column.featured')[0] && use_featured ) {
            } else {
                if( max_height < item_height ) {
                    max_height = item_height;
                }
            }
        } );
        $.each( elements, function( index, item ) {
            if( $( item).parents('.pricing-column.featured')[0] && use_featured ) {
                //if( $( item).height < max_height ) {
                    $(item).height(max_height + 15);
                //}
            } else {
                $( item).height( max_height );
            }
        } );
    }

    function set_feature_heights() {
        var feature_sections = $( 'ul.feature-section' );
        var total = feature_sections.length;

        var rows = $( feature_sections[0] ).find( 'li');

        $.each( rows, function( index, item ) {

            var max_height = 0;
            var col_item = [];

            for( var i = 0; i < total; i++ ) {
                var cell = $( feature_sections[i]).find('li')[index];
                col_item[ col_item.length ] = cell;
                if( max_height < $( cell).height() ) {
                    max_height = $( cell).height();
                }
            }

            for( i = 0; i < total; i++ ) {
                $(col_item[i]).height(max_height);
            }

        } );

    }

    function check_pricing_font_sizes() {
        $(".pricing-column *").each( function () {
            var $this = $(this);
            if (parseInt($this.css("fontSize")) < 12) {
                //$this.css({ "font-size": "12px" });
            }
        });

    }

    check_pricing_font_sizes();
    set_feature_heights();
    set_same_height( $('.pricing-column .title') );
    set_same_height( $('.pricing-column .summary'), false );
    set_same_height( $('.pricing-column .sub-title'), false );

    // =========== APPLY COUPONS =========== //
    $( '.pricing-column [name=apply-coupon-link]').unbind( 'click' );
    $( '.pricing-column [name=apply-coupon-link]').click( function( e ) {
        var input_box = $( '.pricing-column .coupon input' );
        var icon = $('.pricing-column .coupon .coupon-status');
        var pos = input_box.position();

        $('.pricing-column .coupon-box').removeClass('coupon-valid');
        $('.pricing-column .coupon-box').removeClass('coupon-invalid');

            var code = $(input_box).val();

            /* Reset */
            $('.original-amount').removeClass('scratch');
            $('.coupon-amount').remove();
            $('.original-period').removeClass('hidden');
            $('.coupon-period').remove();

            /* Check Coupon AJAX */
            $.post(
                prosites_checkout.ajax_url, {
                    action: 'apply_coupon_to_checkout',
                    'coupon_code': code
                }
            ).done( function( data, status ) {

                    var response = $.parseJSON( $( data ).find( 'response_data' ).text() );

                    if( response.valid ) {
                        $('.pricing-column .coupon-box').addClass('coupon-valid');
                    } else {
                        $('.pricing-column .coupon-box').addClass('coupon-invalid');
                    }

                    // Handle empty returns
                    var levels = response.levels;
                    if( typeof levels != 'undefined' ) {

                        $.each(levels, function (level_id, level) {

                            if (level.price_1_adjust) {
                                var plan_original = $('ul.psts-level-' + level_id + ' .price.price_1 plan-price.original-amount');

                                var original = $('ul.psts-level-' + level_id + ' .price.price_1 .original-amount');
                                $(original).after(level.price_1);
                                $(original).addClass('scratch');

                                // Period display needs adjusting
                                if (level.price_1_period != '') {
                                    var period_original = $('ul.psts-level-' + level_id + ' .price.price_1 .period.original-period');
                                    $(period_original).addClass('hidden');
                                    $(period_original).after(level.price_1_period);
                                }

                            }
                            if (level.price_3_adjust) {
                                var original = $('ul.psts-level-' + level_id + ' .price.price_3 .original-amount');

                                var monthly_original = $('ul.psts-level-' + level_id + ' .price_3 .monthly-price.original-amount');
                                var savings_original = $('ul.psts-level-' + level_id + ' .price_3 .savings-price.original-amount');

                                $(original).after(level.price_3);
                                $(monthly_original).after(level.price_3_monthly);
                                $(savings_original).after(level.price_3_savings);
                                $(original).addClass('scratch');
                                $(monthly_original).addClass('scratch');
                                $(savings_original).addClass('scratch');

                                // Period display needs adjusting
                                if (level.price_3_period != '') {
                                    var period_original = $('ul.psts-level-' + level_id + ' .price.price_3 .period.original-period');
                                    $(period_original).addClass('hidden');
                                    $(period_original).after(level.price_3_period);
                                }

                            }
                            if (level.price_12_adjust) {
                                var original = $('ul.psts-level-' + level_id + ' .price.price_12 .original-amount');

                                var monthly_original = $('ul.psts-level-' + level_id + ' .price_12 .monthly-price.original-amount');
                                var savings_original = $('ul.psts-level-' + level_id + ' .price_12 .savings-price.original-amount');

                                $(original).after(level.price_12);
                                $(monthly_original).after(level.price_12_monthly);
                                $(savings_original).after(level.price_12_savings);
                                $(original).addClass('scratch');
                                $(monthly_original).addClass('scratch');
                                $(savings_original).addClass('scratch');

                                // Period display needs adjusting
                                if (level.price_12_period != '') {
                                    var period_original = $('ul.psts-level-' + level_id + ' .price.price_12 .period.original-period');
                                    $(period_original).addClass('hidden');
                                    $(period_original).after(level.price_12_period);
                                }
                            }

                        });
                    }

                    /* Clear after AJAX return as bottom execution was synchronous */
                    check_pricing_font_sizes();
                    set_feature_heights();
                    set_same_height( $('.pricing-column .title') );
                    set_same_height( $('.pricing-column .summary'), false );
                    set_same_height( $('.pricing-column .sub-title'), false );

            } );

            /* Need to be run inside AJAX return as well */
            check_pricing_font_sizes();
            set_feature_heights();
            set_same_height( $('.pricing-column .title') );
            set_same_height( $('.pricing-column .summary'), false );
            set_same_height( $('.pricing-column .sub-title'), false );

    });


    // ====== CHOOSE BUTTON ======= //
    $('.choose-plan-button, .free-plan-link a').unbind( 'click' );
    $('.choose-plan-button, .free-plan-link a').click( function( e ) {

        var target = e.currentTarget;
        var free_link =  $(target).is('a');
        var site_registered = "yes" == $('#prosites-checkout-table').attr('data-site-registered');
        var button_text = '';

        var blog_id = Requests.QueryString("bid");
        var action = Requests.QueryString("action");
        var new_blog = false;
        if( false != action && 'new_blog' == action ) {
            new_blog = true;
        }

        // Hide login link if its visible
        $('.login-existing').hide();

        //console.log( action );
        //console.log( new_blog );
        if( prosites_checkout.logged_in ) {
            button_text = prosites_checkout.button_choose;
        } else {
            button_text = prosites_checkout.button_signup;
        }

        // Reset button text
        $('.choose-plan-button').html( button_text );


        if( prosites_checkout.logged_in && ! new_blog ) {
            $('.checkout-gateways.hidden').removeClass('hidden');
        } else {
            $('#prosites-signup-form-checkout').removeClass('hidden');
            var the_element = $('#prosites-signup-form-checkout');
            if( typeof the_element != 'undefined' && the_element.length != 0 ) {
                $('html, body').animate({
                    scrollTop: $("#prosites-signup-form-checkout").offset().top - 100
                }, 1000);
            }
        }

        $('.chosen-plan').removeClass('chosen-plan');
        $('.not-chosen-plan').removeClass('not-chosen-plan');

        var parent = $(target).parents('ul')[0];
        var level = 0;

        if( free_link ) {
            level = 'free';
            if( site_registered ) {
                $('.gateways.checkout-gateways').addClass('hidden');
            }
        } else {
            if( site_registered ) {
                $('.gateways.checkout-gateways').removeClass('hidden');
            }
            var classes = $(parent).attr('class');
            classes = classes.split(' ');

            // Extract the level number
            $.each(classes, function (idx, val) {
                var num = parseInt(val.replace('psts-level-', ''));
                if (!isNaN(num)) {
                    level = num;
                }
            });

            $(parent).addClass('chosen-plan');
            $(parent).siblings('ul').addClass('not-chosen-plan');
        }

        // Set the level required for gateways... but also set it on the checkout table
        $('.gateways [name=level]').val(level);
        $('#prosites-checkout-table').attr('data-level', level);

    });

    $('#gateways').tabs();

    // Cancellation confirmation
    $('a.cancel-prosites-plan').click( function( e ) {

        if( confirm( prosites_checkout.confirm_cancel ) ) {

        } else {
            e.preventDefault();
        }

    });

    // Check user/blog availability
    $('#check-prosite-blog').unbind( "click" );
    $('#check-prosite-blog').on( "click", bind_availability_check );

    function bind_availability_check( e ) {
        e.preventDefault();
        e.stopPropagation();

        var form_data = $('#prosites-user-register').serialize();
        //console.log( form_data );
        $('#prosites-user-register p.error').remove();
        $('.trial_msg').remove();
        $('.reserved_msg').remove();

        $('#check-prosite-blog').addClass("hidden");
        $('#registration_processing').removeClass("hidden");

        $('.input_available').remove();

        var level = $('#prosites-checkout-table').attr('data-level');
        var period = $('#prosites-checkout-table').attr('data-period');

        $.post(
            prosites_checkout.ajax_url, {
                action: 'check_prosite_blog',
                data: form_data,
                level: level,
                period: period
            }
        ).done( function( data, status ) {
            $('#check-prosite-blog').removeClass("hidden");
            $('#registration_processing').addClass("hidden");
            post_registration_process( data, status, form_data );
        } );

    }

    function position_field_available_tick( field ) {
        var pos = $(field).position();
        var width = $( field ).innerWidth();
        var height = $( field ).innerHeight();
        var item_h = $( field + ' + .input_available').innerHeight();
        var item_w = $( field + ' + .input_available').innerWidth();
        $( field + ' + .input_available').css( 'top', Math.ceil( pos.top + (height - item_h) / 2  ) + 'px' );
        $( field + ' + .input_available').css( 'left', Math.ceil( pos.left + width - ( item_w * 2 ) ) + 'px' );

    }

    function post_registration_process( data, status, form_data ) {

        var response = $.parseJSON($(data).find('response_data').text());

        if( typeof response == 'null' || typeof response == 'undefined' ) {
            return false;
        }

        // Trial setup form for non-recurring settings
        if( typeof response.show_finish != 'undefined' && response.show_finish === true ) {
            $('#prosites-checkout-table').replaceWith( response.finish_content );
            $('#prosites-signup-form-checkout').remove();
            $('#gateways').remove();
            return false;
        }

        // Get fresh signup form
        if( typeof response.form != 'undefined' ) {

            $('#prosites-signup-form-checkout').replaceWith( response.form );
            $('#check-prosite-blog').unbind( "click" );
            $('#check-prosite-blog').on( "click", bind_availability_check );
            $('#prosites-signup-form-checkout').removeClass('hidden');
            $('#prosites-checkout-table').attr('data-site-registered', 'yes');

            // Reset values...
            var obj = $.unserialize( form_data );
            $.each( obj, function( key, val )  {
                // Restore values
                if( key != "signup_form_id" && key != "_signup_form" ) {
                    $('[name=' + key + ']').val( val );
                }
            });

        }

        // Get fresh gateways form
        if( typeof response.gateways_form != 'undefined' ) {
            $('.gateways.checkout-gateways').replaceWith(response.gateways_form);

            var is_free = "free" == $('#prosites-checkout-table').attr('data-level');

            // Reset the levels
            $('.gateways [name=level]').val( $('#prosites-checkout-table').attr('data-level') );
            $('.gateways [name=period]').val( $('#prosites-checkout-table').attr('data-period') );

            // Rebind Stripe -- find a generic way to make it easier for custom gateways
            $("#stripe-payment-form").unbind( "submit" );
            $("#stripe-payment-form").on( 'submit', stripePaymentFormSubmit );

            $('#gateways').tabs();
            if( ! is_free ) {
                $('.gateways.checkout-gateways').removeClass('hidden');
            }
        }

        if( typeof response.username_available != 'undefined' && true === response.username_available ) {
            if( 'new_blog' != Requests.QueryString("action") ) {
                $('[name=user_name]').after('<i class="input_available"></i>');
                position_field_available_tick('[name=user_name]');
            }
        }
        if( typeof response.email_available != 'undefined' && true === response.email_available ) {
            if( 'new_blog' != Requests.QueryString("action") ) {
                $('[name=user_email]').after('<i class="input_available"></i>');
                position_field_available_tick('[name=user_email]');
            }
        }
        if( typeof response.blogname_available != 'undefined' && true === response.blogname_available ) {
            $('[name=blogname]').after('<i class="input_available"></i>');
            position_field_available_tick('[name=blogname]');
        }
        if( typeof response.blog_title_available != 'undefined' && true === response.blog_title_available ) {
            $('[name=blog_title]').after('<i class="input_available"></i>');
            position_field_available_tick('[name=blog_title]');
        }

        if( typeof response.trial_message != 'undefined' ) {
            $('#prosites-signup-form-checkout').replaceWith(response.trial_message);
            $('.input_available').remove();
        }
        if( typeof response.reserved_message != 'undefined' ) {
            $('#prosites-signup-form-checkout').replaceWith(response.reserved_message);
            $('.input_available').remove();
        }
        //console.log( response.form );
        //if (response.valid) {
        //    $('.pricing-column .coupon-box').addClass('coupon-valid');
        //} else {
        //    $('.pricing-column .coupon-box').addClass('coupon-invalid');
        //}

    }

});