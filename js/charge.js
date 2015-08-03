jQuery(document).ready(function ($) {
	// $("div#charge-widget").css( "display", "block");
	$("div#charge-widget").css("top", WidgetVerticalPosition).css( "display", "block");
	if (WidgetHorizontalPosition == "right") {
		$('link[href="widget-style.css"]').attr('href',PluginUrl + '/chargereseller_widget/css/style-right.css');
	} else {
		$('link[href="widget-style.css"]').attr('href', PluginUrl + '/chargereseller_widget/css/style-left.css');
	}
	
	
	if (WidgetTabPosition == "bottom" ) {
		$("#charge-widget .operators").css("margin-top","10px");
		$("div#charge-widget div#charge-button").css("top",	"244px");
		if (WidgetHorizontalPosition == "left") {
			$("div#charge-widget div#charge-body").css("border-radius",	"0 10px 0 0");
	    } else if (WidgetHorizontalPosition == "right") {
			$("div#charge-widget div#charge-body").css("border-radius",	"10px 0 0 0");
	    }
    }	
	

	
	
	var DefaultOperatorPhone = '';
	var ChargeKindText = '';
	var KindTitle = '';
	
	function startup() {
		if (DefaultOperator == 'MTN') {
			DefaultOperatorPhone = '093';
			if ($('input#magiccharge').is(':checked')) {
				DefaultOperator = 'MTN!';
				$('input#NonCreditMTN').prop('disabled', true);
				$('input#NonCreditMTN').attr('checked', false);
			}
			if ($('input#NonCreditMTN').is(':checked')) {
				DefaultOperator = 'MTN#';
				$('input#magiccharge').prop('disabled', true);
				$('input#magiccharge').attr('checked', false);
			}
		} else if (DefaultOperator == 'MCI') {
			DefaultOperatorPhone = '091';
		} else if (DefaultOperator == 'RTL') {
			DefaultOperatorPhone = '0921';
		} else if (DefaultOperator == 'TAL') {
			DefaultOperatorPhone = '0932';
		}
		
		if (DefaultChargeKind == 'TopUp') {
			ChargeKindTitle = 'شارژ مستقیم';
		} else if (DefaultChargeKind == 'PIN') {
			ChargeKindTitle = 'خرید کارت شارژ';
		}
		$('div#charge-kind p').text(ChargeKindTitle);
		
		$('form#chargeform').attr('class', DefaultOperator.replace('!', '').replace('#', ''));
		$('div#charge-body').attr('class', DefaultChargeKind);
		$('div.operators').attr('class', 'operators ' + DefaultChargeKind);
		$('input#dataAccountTemp').val(DefaultOperatorPhone);
		$('input#dataChargeKind').val(DefaultChargeKind);
		$('label#ChargeKindText').text(ChargeKindText);
		$('input#dataRedirectUrl').val(RedirectUrl);
		$('div.input.text.account div.form-control.account span:last-child i').text(DefaultOperatorPhone);
		$('input#dataType').val(DefaultOperator);
		$('input#dataWebserviceId').val(WebserviceID);
		$('div.operator').removeClass('active');
		if (DefaultOperator.substring(0, 3) == 'MTN') {
			$('div.operator.MTN').addClass('active');
		} else {
			$('div.operator.'+ DefaultOperator).addClass('active');
		}
		
		$('div#charge-kind span').each(function() {
			$(this).removeClass('active');
			if ($(this).data('charge-kind') == DefaultChargeKind) {
				$(this).addClass('active');
			}
		});
		$('form#chargeform').slideDown(200);
	}
	startup();
	
	$('input#magiccharge').change(function() {
		if ($('input#dataType').val() == 'MTN' || $('input#dataType').val() == 'MTN!' || $('input#dataType').val() == 'MTN#') {
			if ($(this).is(':checked')) {
				$('input#dataType').val('MTN!');
				$('input#NonCreditMTN').prop('disabled', true);
				$('input#NonCreditMTN').attr('checked', false);
			} else {
				$('input#NonCreditMTN').prop('disabled', false);
				$('input#dataType').val('MTN');
			}
		}
	});
	$('input#NonCreditMTN').change(function() {
		if ($('input#dataType').val() == 'MTN' || $('input#dataType').val() == 'MTN!' || $('input#dataType').val() == 'MTN#') {
			if ($(this).is(':checked')) {
				$('input#dataType').val('MTN#');
				$('input#magiccharge').prop('disabled', true);
				$('input#magiccharge').attr('checked', false);
			} else {
				$('input#magiccharge').prop('disabled', false);
				$('input#dataType').val('MTN');
			}
		}
	});
	
	$('div#charge-kind span').click(function() {
		var kind = $(this).data('charge-kind');
		DefaultChargeKind = kind;
		DefaultOperator = 'MTN';
		$('input#magiccharge').removeAttr('checked');
		$('input#magiccharge').prop('disabled', false);
		$('input#NonCreditMTN').removeAttr('checked');
		$('input#NonCreditMTN').prop('disabled', false);
		startup();
	});
	
	$('div.banks ul li').click(function() {
		$('div.banks p i').text($(this).find('i').text());
		$('input#dataIssuer').val($(this).attr('id'));
		$('div.banks ul li').removeClass('active');
		$(this).addClass('active');
	});
	
	$('div.operator[data-type]').click(function() {
		DefaultOperator = $(this).attr('data-type');
		startup();
	});
	
	$('div.charge-submit input[type="submit"]').click(function(e) {
		var action = '';
		if (DefaultChargeKind == 'PIN') {
			action = 'PinRequest';
		} else {
			action = 'Topup';
		}
		$('form#chargeform').attr('action', 'http://chr724.ir/services/EasyCharge/' + action);
		checkForm();
		if (sendForm) {
			$('form#chargeform').submit();
		}
		e.preventDefault();
		return false;
	});
	
	var sendForm = false;
	function checkForm () {
		var emptyCheck = true;
		var cellphoneCheck = true;
		var emailCheck = true;
		var cellphone = $('input#dataAccountTemp').val();
		var email = $('input#EmailInput').val();
		
		if (DefaultChargeKind == 'TopUp') {
			if (cellphone.length == 11 && !isNaN(cellphone)) {
				if (DefaultOperator == 'MTN' || DefaultOperator == 'MTN!' || DefaultOperator == 'MTN#') {
					if (jQuery.inArray(cellphone.substring(0, 3), ['093', '090'])) {
						cellphoneCheck = false;
					}
				} else if (DefaultOperator == 'MCI') {
					if (cellphone.substring(0, 3) != '091') {
						cellphoneCheck = false;
					}
				}
				else if (DefaultOperator == 'RTL') {
					if (cellphone.substring(0, 3) != '0921') {
						cellphoneCheck = false;
					}
				}
			} else {
				cellphoneCheck = false;
			}
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (email.length > 0 && !filter.test(email)) {
				emailCheck = false;
			}
		} else if (DefaultChargeKind == 'PIN') {
			if ((cellphone.length == 0 || jQuery.inArray(cellphone, ['093', '091', '0921', '0932']) != -1) && email.length == 0) {
				emptyCheck = false;
				alert('جهت استفاده از خدمات پشتیبانی، ایمیل یا شماره موبایل خود را وارد نمایید.');
			} else {				
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (email.length > 0 && !filter.test(email)) {
					emailCheck = false;
				}
				
				if (emailCheck && jQuery.inArray(cellphone, ['093', '090', '091', '0921', '0932']) == -1) {
					if (cellphone.length != 11 || isNaN(cellphone)) {
						cellphoneCheck = false;
					}
				}
			}
		}
		
		if (cellphoneCheck == false) {
			if ($('div.account-container div.charge-error-message').length <= 0) {
				$('div.account-container').prepend('<div class="charge-error-message">شماره وارد شده صحیح نمی باشد.</div>');
			}
		} else {
			$('div.account-container div.charge-error-message').remove();
		}
		
		if (emailCheck == false) {
			if ($('div.email-container div.charge-error-message').length <= 0) {
				$('div.email-container').prepend('<div class="charge-error-message">این ایمیل صحیح نمی باشد.</div>');
			}
		} else {
			$('div.email-container div.charge-error-message').remove();
		}
		
		if ($('input#dataAmount').val() < 500 || $('input#dataAmount').val() > 50000) {
			if ($('div.input.text.amount div.charge-error-message').length <= 0) {
				$('div.input.text.amount').prepend('<div class="charge-error-message">مبلغ وارد شده میبایست بزرگتر از 500 و کوچک تر از 50،000 تومان باشد.</div>');
				$('div.input.select.amount').prepend('<div class="charge-error-message">مبلغ وارد شده میبایست بزرگتر از 500 و کوچک تر از 50،000 تومان باشد.</div>');
			}
			amountCheck = false;
		} else {
			$('div.input.text.amount div.charge-error-message').remove();
			amountCheck = true;
		}
		
		if (emptyCheck && cellphoneCheck && emailCheck && amountCheck) {
			sendForm = true;
		} else {
			sendForm = false;
		}
	}
	setInterval((function() {
		// $('input#dataAccountTemp').val($('input#dataAccountTemp').val().replace(/\D/g, ''));
		$('input#dataAccount').val($('input#dataAccountTemp').val());
		if (DefaultOperator == 'MTN' && DefaultChargeKind == 'TopUp') {
			aditionalFind = 'input#dataAmountTopUpMTNTemp';
		} else {
			aditionalFind = 'input#dataAmountTemp';
		}
		$('input#dataAmount').val($(aditionalFind).val());
	}), 500);
	
	if ($("#dataAmountTemp").length){
		$("#dataAmountTemp").ionRangeSlider({
			values: [1000, 2000, 5000, 10000, 20000],
			type: 'single',
			postfix: " تومان",
			prettify: false,
			from: 0,
			onLoad: function(obj) {
				$('#dataAmountTemp').val(1000);
			},
			onChange: function(obj) {
				$('#dataAmountTemp').val(obj.fromValue);
			},
		});
	}
	
	if ($("#dataAmountTopUpMTNTemp").length){
		$("#dataAmountTopUpMTNTemp").ionRangeSlider({
			min: 500,
			max: 50000,
			type: 'single',
			postfix: " تومان",
			prettify: false,
			step: 500,
			from: 500,
		});
	}
	
	$('div#charge-kind span.pin').qtip({
		content: '<p style="font-weight:bold;">کارت شارژ</p>پین کد باید به صورت دستی وارد شود .',
		style:
		{
			classes: 'qtip-light qtip-rounded qtip-shadow',
			width: '140px'
		},
		position:
		{
			my: 'top ' + WidgetHorizontalPosition,  // Position my top left...
			at: 'center', // at the center of...
		}
	});
	
	$('div#charge-kind span.topup').qtip({
		content: '<p style="font-weight:bold;">شارژ مستقیم</p>شارژ به صورت اتوماتیک اعمال می شود .',
		style:
		{
			classes: 'qtip-light qtip-rounded qtip-shadow',
			width: '140px'
		},
		position:
		{
			my: 'top ' + WidgetHorizontalPosition,  // Position my top left...
			at: 'center', // at the center of...
		}
	});
	
	$("div#charge-button").click(function() {
		var pos = '';
		if(WidgetHorizontalPosition=='left'){
				if ($(this).parent().position().left == -324) {
					pos = '0px';
				} else if ( $(this).parent().position().left == 0) {
					pos = '-324px';
				}
				
				$(this).parent().animate(
					{
						'left':pos,
					},1000,
					function(){}
				);

				if ( pos == '0px') {
					$('.operators').fadeIn(1000, 'swing');
				} else {
					$('.operators').fadeOut(1000, 'swing');
				}
		}
		else if(WidgetHorizontalPosition=='right'){
		
				if ($(this).parent().css("right") == "-324px") {
					pos = '0px';
				} else if ( $(this).parent().css("right") == "0px") {
				
					pos = '-324px';
				}
				
				$(this).parent().animate(
					{
						'right':pos,
					},1000,
					function(){}
				);
				if ( pos == '0px') {
					$('.operators').fadeIn(1000, 'swing');
				} else {
					$('.operators').fadeOut(1000, 'swing');
				}
		}
	});
	
	$('div#charge-widget div#charge-button').css({"background-color": WidgetColor});
	$('div#charge-widget div#charge-body').css({"background-color": WidgetColor});
});