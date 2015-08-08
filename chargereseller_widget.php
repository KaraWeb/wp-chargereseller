<?php
/*
Plugin Name: ChargeresellerWidget
Plugin URI: http://www.chargereseller.com/
Description: ویجت فروش کارت شارژ و شارژ مستقیم شارژریسلر
Version: 1.0
Author: A.Rastgoo & P.Mohammadiyan
License: GPL
*/

add_action('admin_menu', 'chargereseller_admin_actions');	
add_action('wp_footer', 'chargereseller_widget');

function chargereseller_admin_actions() 
{
	add_menu_page("ویجت شارژ ریسلر", "ویجت شارژ ریسلر", 1, "chargereseller_widget", "chargereseller_widget_admin");
}

function chargereseller_widget_admin()
{
	$file = WP_PLUGIN_DIR."/wp-chargereseller/config.json"; 
	$config = @json_decode(file_get_contents($file), true);
		if ($_POST) {
			$options = ['WebserviceId', 'DefaultOperator', 'DefaultChargeKind', 'WidgetColor', 'Textcolor', 'WidgetHorizontalPosition', 'WidgetVerticalPosition', 'WidgetTabPosition', 'Status']; // this is for hack reasons
			$config = array();
			foreach ($options as $option) {
				$config[$option] = htmlspecialchars($_POST[$option]);
			}
			file_put_contents($file, json_encode($config));
		}
?>
		<style>
			.chargereseller_plugin div {
				padding:5px;
			}
			.chargereseller_plugin div label {
				width:150px;
				display:inline-block;
			}
			.chargereseller_plugin div input, .chargereseller_plugin div select {
				width:100px;
				display:inline-block;
			}
			#WebserviceId {
				width:230px;
				display:inline-block;
			}
		</style>
		<div class="chargereseller_plugin">
			 <h2>تنظیمات ویجت شارژ ریسلر </h2>
			<form name="widget_setting" method="post" action="<?php echo str_replace( '%7E', '~', $_SERVER['REQUEST_URI']); ?>">
				<h4> تنظیمات ویجت شارژ ریسلر</h4>
                <div>
                    <label>وضعیت</label>
                    <select id="Status" name="Status" value="<?php echo $config['Status']; ?>">
                        <option value="Disable" <?php if ($config['Status'] == 'Disable') { echo 'selected'; } ?>> غیر فعال </option>
                        <option value="Enable" <?php if ($config['Status'] == 'Enable') { echo 'selected'; } ?>> فعال </option>
                    </select>
                </div>
				<div>
					<label>شناسه وب سرویس:</label>
					<input id="WebserviceId" type="text" maxlength="32" name="WebserviceId" value="<?php echo $config['WebserviceId']; ?>" >
					<span> مثال :xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx</span>
				</div>
				<div>
					<label>اپراتور پیشفرض: </label>
					<select id="DefaultOperator" name="DefaultOperator">
							<option value="MTN" <?php if ($config['DefaultOperator'] == 'MTN') { echo 'selected'; } ?>> ایرانسل</option>
							<option value="MCI" <?php if ($config['DefaultOperator'] == 'MCI') { echo 'selected'; } ?>>همراه اول</option>
							<option value="RTL" <?php if ($config['DefaultOperator'] == 'RTL') { echo 'selected'; } ?>>رایتل</option>
							<option value="TAL" <?php if ($config['DefaultOperator'] == 'TAL') { echo 'selected'; } ?>>تالیا</option>
					 </select>
				</div>
				<div>
					<label>نوع شارژ: </label>
					<select id="DefaultChargeKind" name="DefaultChargeKind">
						<option value="TopUp" <?php if ($config['DefaultChargeKind'] == 'TopUp') { echo 'selected'; } ?>> شارژ مستقیم</option>
						<option value="PIN" <?php if ($config['DefaultChargeKind'] == 'PIN') { echo 'selected'; } ?>>کارت شارژ</option>
					</select>
				</div>
				<div>
					<label>رنگ ویجت:</label>
					<input type="text" name="WidgetColor" class="color" value="<?php echo $config['WidgetColor']; ?>" >
				</div>
                <div>
                    <label>رنگ متن:</label>
                    <input type="text" name="Textcolor" class="color" value="<?php echo $config['Textcolor']; ?>" >
                </div>
				<div>
					<label>موقعیت افقی:</label>
					<select id="WidgetHorizontalPosition" name="WidgetHorizontalPosition" value="<?php echo $chargeSettings['WidgetHorizontalPosition']; ?>" >
							<option value="right" <?php if ($config['WidgetHorizontalPosition'] == 'right') { echo 'selected'; } ?>>راست</option>
							<option value="left" <?php if ($config['WidgetHorizontalPosition'] == 'left') { echo 'selected'; } ?>>چپ</option>
					</select>
				</div>
				<div>
					<label>موقعیت عمودی:</label>
					<input type="text" name="WidgetVerticalPosition" value="<?php echo $config['WidgetVerticalPosition']; ?>" > <span>مثال : 20px  </span>
				</div>
				<div>
					<label>موقعیت زبانه: </label>
					<select id="WidgetTabPosition" name="WidgetTabPosition" value="<?php echo $config['WidgetTabPosition']; ?>">
						<option value="top" <?php if ($config['WidgetTabPosition'] == 'top') { echo 'selected'; } ?>>بالا</option>
						<option value="bottom" <?php if ($config['WidgetTabPosition'] == 'bottom') { echo 'selected'; } ?>>پایین</option>
					</select>
				</div>
				<div>
					<input type="submit" class="button button-primary" name="Submit" value="ذخیره " />
				</div>
			</form>
		</div>
		<script type="text/javascript" src="<?php echo  plugins_url(); ?>/wp-chargereseller/js/jscolor/jscolor.js"></script>
		<?php
}
	
function chargereseller_widget()
{  
	$config = json_decode(file_get_contents(WP_PLUGIN_DIR."/wp-chargereseller/config.json"), true);
    if ($config['Status'] == 'Enable') {
?>
            <link rel="stylesheet" type="text/css" href="<?php echo  plugins_url(); ?>/wp-chargereseller/css/ion.rangeSlider.css" />
            <link rel="stylesheet" type="text/css" href="<?php echo  plugins_url(); ?>/wp-chargereseller/css/ion.rangeSlider.skinNice.css" />
            <link rel="stylesheet" type="text/css" href="<?php echo  plugins_url(); ?>/wp-chargereseller/css/jquery.qtip.css" />
            <link rel="stylesheet" type="text/css" href="<?php echo  plugins_url(); ?>/wp-chargereseller/css/fontello.css" />
            <link rel="stylesheet" type="text/css" href="widget-style.css" />
            <div id="charge-widget">
                <div id="charge-button" class="rotate">موبایلتو  شارژ  کن</div>
                <div id="charge-body">
                    <div id="charge-kind">
                        <span class="icon-flash topup" data-charge-kind="TopUp"></span>
                        <span class="icon-credit-card pin" data-charge-kind="PIN"></span>
                        <p></p>
                    </div>
                    <div class="operators">
                        <div data-type="MTN" class="operator MTN"><i></i></div>
                        <div data-type="MCI" class="operator MCI"><i></i></div>
                        <div data-type="RTL" class="operator RTL"><i></i></div>
                        <div data-type="TAL" class="operator TAL"><i></i></div>
                    </div>
                    <form accept-charset="utf-8" method="post" id="chargeform" action="http://chr724.ir/services/EasyCharge/">
                        <fieldset>
                            <div class="account-container">
                                <div class="input text required account">
                                    <input id="dataAccountTemp" class="input-large" type="text" value="" maxlength="11" name="data[AccountTemp]">
                                </div>
                            </div>
                            <div id="AmountTemp" class="input text required amount">
                                <input type="text" id="dataAmountTemp" name="data[AmountTemp]" title="مبلغ به تومان" class="eng">
                            </div>
                            <div id="AmountTopUpMTNTemp" class="input text required amount">
                                <input type="text" id="dataAmountTopUpMTNTemp" name="data[AmountMTNTemp]" title="مبلغ به تومان" class="eng">
                            </div>
                            <div class="email-container">
                                <div class="input text email">
                                    <input id="EmailInput" class="input-large" type="email" maxlength="50" value="" title="آدرس ایمیل را به شکل صحیح بنویسید!" rel="tooltip" placeholder="you@domain.com" name="data[Email]">
                                </div>
                            </div>
                            <div class="Magiccharge">
                                <input type="checkbox" value="1" id="magiccharge" name="data[Magic]">
                                <label for="magiccharge">شارژ شگفت انگیز</label>
                            </div>
                            <div class="NonCreditMTN">
                                <input id="NonCreditMTN" type="checkbox" name="data[NonCreditMTN]" value="1">
                                <label for="NonCreditMTN">قبض (شارژ) دائمی ایرانسل</label>
                            </div>
                            <input type="hidden" id="dataWebserviceId" name="data[WebserviceId]">
                            <input type="hidden" id="dataRedirectUrl" name="data[RedirectUrl]">
                            <input type="hidden" id="dataChargeKind" name="data[ChargeKind]">
                            <input type="hidden" id="dataAccount" name="data[Account]">
                            <input type="hidden" id="dataAmount" name="data[Amount]">
                            <input type="hidden" id="dataType" name="data[Type]">
                            <input type="hidden" id="dataIssuer" name="data[Issuer]">
                        </fieldset>
                        <div class="charge-submit">
                            <input type="submit" value="پــرداخــت">
                        </div>
                    </form>
                </div>
            </div>
            <script type="text/javascript" src="<?php echo  plugins_url(); ?>/wp-chargereseller/js/jquery-2.1.0.min.js"></script>
            <script type="text/javascript" src="<?php echo  plugins_url(); ?>/wp-chargereseller/js/jquery.qtip.min.js"></script>
            <script type="text/javascript" src="<?php echo  plugins_url(); ?>/wp-chargereseller/js/ion.rangeSlider.min.js"></script>
            <script type="text/javascript" src="<?php echo  plugins_url(); ?>/wp-chargereseller/js/charge.js"></script>
            <script type="text/javascript">
                var PluginUrl = "<?php echo  plugins_url(); ?>";
                var RedirectUrl = "<?php echo get_bloginfo('wpurl'); ?>";
                var WebserviceID = "<?php echo $config['WebserviceId']; ?>";
                var DefaultOperator = "<?php echo $config['DefaultOperator']; ?>";
                var DefaultChargeKind = "<?php echo $config['DefaultChargeKind']; ?>";
                var WidgetColor = "#<?php echo $config['WidgetColor']; ?>";
                var Textcolor = "#<?php echo $config['Textcolor']; ?>";
                var WidgetHorizontalPosition = "<?php echo $config['WidgetHorizontalPosition']; ?>";
                var WidgetVerticalPosition = "<?php echo $config['WidgetVerticalPosition']; ?>";
                var WidgetTabPosition = "<?php echo $config['WidgetTabPosition']; ?>";
                var Status = "<?php echo $config['Status']; ?>";
            </script>
<?php
    }
} 
?>