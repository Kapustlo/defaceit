<form>
<legend>Создаем логику приложения</legend>
<textarea id="code" name="code">
var main = Defaceit.Controller([]);
</textarea>

<div class="form-actions">
  <button class="btn">Сохранить</button>
  <button class="btn btn-link">Отменить</button>

</div>

</form>

<script>
  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    theme: "solarized light"
  });
  //editor.setOption("theme", "solarized light");
  /*var input = document.getElementById("select");
  function selectTheme() {
    var theme = input.options[input.selectedIndex].innerHTML;
    editor.setOption("theme", theme);
  }
  var choice = document.location.search &&
               decodeURIComponent(document.location.search.slice(1));
  if (choice) {
    input.value = choice;
    editor.setOption("theme", choice);
  }*/
</script>