---
layout: documentation
categories:
- documentation
- marketplace-api
title: Marketplace API
excerpt: 
keywords:
---

{: .article}
# Marketplace API

The Marketplace API landing page.
{: .article .lead}

But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?

## Overview
{: #overview }
But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.

## Implementation guidelines
{: #implementation-guidelines }
But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?

## How to get support
{: #how-to-get-support }
But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.

## Release notes
{: #release-notes }
<div id="release-notes-holder"></div>
<script>
$(document).ready(function() {
    var resp = '';
    $.ajax({
        type: "GET",
        url:   "/products-and-docs/apis/marketplace-api/release-notes/",
        dataType: "json",
        cache: false,
        success: function(response){
            if (response != '') {
                console.log(response);
                for (len = response.nodes.length, i=0; i<len; ++i) {
                    resp += '<h3>' + response.nodes[i].node["title"] + '</h3>';
                    resp += '<span class="date">' + response.nodes[i].node["post date"] + '</span>';
                    resp += response.nodes[i].node["body"];
                }
                $("#release-notes-holder").html(resp);
            }
        },
        error:function(){
            console.log('Ajax Error!');
        }
    })
    return false;
});
</script>