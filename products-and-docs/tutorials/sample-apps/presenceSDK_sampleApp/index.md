---
layout: tutorials-list
categories:
- documentation
- tutorials
- sample-apps-presenceSDK


title: Presence SDK Sample App
excerpt: Demo the newest version of the Presence SDK Directly on your mobile phone!
---

# Presence SDK Sample App

{: .lead .double-margin}
The Sample App empowers clients and integrators to easily demo the newest version of the Presence SDK on their mobile phone.
Check out new features, understand expected functionality, and even experiment with color schemes to customize the SDK for your particular app: no developer resources required!

<div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 comntent">
{% for presence-sdk-sample-app in site.pages %}
    {% if presence-sdk-sample-app.categories[2] == "presence-sdk-sample-app" %}
        <div class="tutorials-article">
            {% if presence-sdk-sample-app.img %}
                {% if presence-sdk-sample-app.link %}<a href="{{ presence-sdk-sample-app.link }}">{% endif %}<img src="{{ presence-sdk-sample-app.img }}" class="image" alt="{{presence-sdk-sample-app.title}}"/>{% if presence-sdk-sample-app.link %}</a>{% endif %}
            {% endif %}
            <div class="announcement">
                <h3>{% if presence-sdk-sample-app.link %}<a href="{{ presence-sdk-sample-app.link }}">{% endif %}{{ presence-sdk-sample-app.title }}{% if presence-sdk-sample-app.link %}</a>{% endif %}</h3>
                <p>{{ presence-sdk-sample-app.announcement }}</p>
                {% if presence-sdk-sample-app.link %}<a class="button button-blue" href="{{ presence-sdk-sample-app.link }}">Learn more</a>{% endif %}
                <div class="tags">
                    {% for tag in presence-sdk-sample-app.tags %}
                        <button class="tag-btn" tag="{{tag}}">{{tag}}</button>
                    {% endfor %}
                </div>
            </div>            
        </div>
    {% endif %}
{% endfor %}
</div>