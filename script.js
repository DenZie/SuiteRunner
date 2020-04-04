$(document).ready(function () {
$('#jqxTree').jqxTree({ height: '400px', hasThreeStates: true, checkboxes: true, width: '330px'});
$('#jqxTree').css('visibility', 'visible');
$('#jqxCheckBox').jqxCheckBox({ width: '200px', height: '25px', checked: true });
$('#jqxCheckBox').on('change', function (event) {
    var checked = event.args.checked;
    $('#jqxTree').jqxTree({ hasThreeStates: checked });
});
$("#jqxTree").jqxTree('selectItem', $("#home")[0]);
});