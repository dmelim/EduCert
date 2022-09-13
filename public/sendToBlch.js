$(document).ready(function () {
  notary_init();
});

const textFunc = (event) => {
  event.preventDefault();
  const targetDiv = event.target.id;
  const hash =
    document.getElementById(targetDiv).parentNode.previousSibling
      .previousSibling.innerHTML;
  if (hash.split(" ").includes("found,")) {
    alert("No hash to send!");
  } else {
    notary_send(hash, function (err, tx) {
      if (err) {
        alert(err.message);
      } else {
        const replaceParams = { valid: "true", id: targetDiv };
        $.post("http://localhost:3000/on-blockchain", replaceParams);
        $.get("http://http://localhost:3000/database");
      }
    });
  }
};
