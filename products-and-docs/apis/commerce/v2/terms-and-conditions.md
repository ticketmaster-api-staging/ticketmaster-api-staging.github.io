---
layout: documentation-single
categories:
- documentation
- generated
- commerce-api
- v2-internal
title: Commerce API
excerpt: The Ticketmaster Commerce API provides a simple way to add Ticketmaster features in your 3rd party iOS and Android apps
keywords: Commerce API, Ticket Management, iOS, Android
---

{: .article}
# Commerce API 

Use the Ticketmaster Commerce API to look up available offers and products on various Ticketmaster platforms for North America markets. For formal partnerships and relationships, selected offers and products can be carted and transacted on through the cart, delivery, payment and purchase APIs – These APIs require approved access from Ticketmaster.
{: .lead .article}

## Terms and conditions
{: .article }

<form method="post" enctype="application/json" autocomplete="off">
<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
<p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>

<input id="terms" type="checkbox" value="0" name="terms">
<label for="terms">I agree with Terms and Conditions</label>
<div class="col-lg-12 col-md-12 col-sm-12 terms-btns">
  <div class="col-lg-2 col-md-2 col-sm-2">
    <button type="submit" id="agree" class="btn btn-block button button-blue" disabled="disabled">I agree</button>
  </div>
  <div class="col-lg-2 col-md-2 col-sm-2">
    <button type="cancel" class="btn btn-block button-white-gray-border">Cancel</button>
  </div>
</div>
</form>
<script>
  (function(){
    var checker = document.getElementById('terms'),
        sendbtn = document.getElementById('agree');
        checker.onchange = function(){
          if(this.checked){
            sendbtn.disabled = false;
            checker.value = 1;
          } else {
            sendbtn.disabled = true;
            checker.value = 0;
          }
        }
  }());  
</script>