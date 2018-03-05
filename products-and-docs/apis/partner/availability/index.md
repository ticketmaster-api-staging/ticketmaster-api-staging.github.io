---
layout: documentation
categories:
- documentation
- availability
- partner
redirect_from: 
- "/apis/partner/availability"
title: Availability API
excerpt: The Ticketmaster Partner API lets clients reserve, purchase, and retreive ticket and event informaton.
keywords: Partner API, host and API, reserve tickets, create a cart, order management, member management
---

{: .article}
# Availability API


The Ticketmaster Availability API lets clients find out the ticket and seat availability informaton.
{: .article .lead}

#### Quota Policy

A quota policy is applied for all the request made to endpoint(s)

/events/{eventId}/availability


The following headers are returned in the response add more information about the quota

	Ratelimit-Quota-Allowed :  Returns the allowed quota count
	Ratelimit-Quota-Used    :  Returns the current quota used within a quota interval
	Ratelimit-Expiry        :  Returns the UTC time in milliseconds which determines when the quota expires and new quota interval starts.
	Ratelimit-Quota-Available :  The no of requests (remaining) that can be made within the time limit

The restriction is <b>3600 requests/hour </b> for an apikey.If you get a 429 error code, it means that your request was aborted because of violation of quota policy.


{: .article}
## Get Event ID [GET]
{: #retrieve-event}

Returns an alphanumeric event id based on a Venue-supplied event code+host combination<br/>

/partners/v1/events/{event_code}/{event_host}/id
{: .code .red}

*Polling: No*

### Parameters

| Parameter  | Description          | Type              | Example      | Required |
|:-----------|:---------------------|:----------------- |:------------------ |:-------- |
| `event_code` | The event code given by the venue.     | string            |     "53-45243"           | Yes      |
| `event_host` | The event host given by the venue.     | string            |     "NY1"           | Yes      |


>[Request](#req)
>[Response](#res)
{: .reqres}

{% highlight bash %}
https://app.ticketmaster.com/partners/v1/events/53-45243/NY1/id?apikey=GkB8Z037ZfqbLCNtZViAgrEegbsrZ6Ne
{% endhighlight %}

{% highlight js %}
Status 200
{
    "event" : {
        "id" : "0B004D43F86C478F"

    }
}
{% endhighlight %}


{: .article}
## Event Inventory [GET]
{: #inventory-management}
For use by Channel Partners only. Discover events available to transact on. For specifically-enabled accounts only.

/partners/v1/events
{: .code .red}

*Polling: No*

### Response structure:

{: .nested-list}

- `events` (array)  - Events.
    - {arrayitemobject} - event
        * `eventCode` (string) -  Event code  Eg: "EPT0726E"
        * `eventHost` (string) -  Host system Eg: "LA2"
        * `eventId` (string) - Event ID Eg. "0B004D43F86C478F"
        * `eventDate` (date) - Event Date is Local Date YYYY-MM-DD format
        * `eventTime` (time) - Event Time is Local Time HH:MM:SS format
        * `timeZone` (text) - Time zone of the event venue location Eg: "America/Los_Angeles"
        * `seatLocationMapRestrict`(boolean) - when true, host's ascii map through the sell prompt in tmwin will not be displayed.
        * `locRowSeatRestrict`(boolean) - when true, requires any client/partner to hide row and seat names from the customer.
        * `locXnumAddescRestrict`(boolean) - when true, Xnumbers, ADDDESC, section on the event will not be displayed.
        * `offers` (array) - Offers on the Event
            - {arrayitemobject} - offer
                * `repName` (text) - Offer name. Eg: "GPAS4"
                * `ticketType` (text) - Ticket Type Id Eg: "00004C440003"

>[Request](#req)
>[Response](#res)
{: .reqres}

{% highlight bash %}
https://app.ticketmaster.com/partners/v1/events?apikey=GkB8Z037ZfqbLCNtZViAgrEegbsrZ6Ne
{% endhighlight %}

{% highlight js %}
Status 200
{
    "events" : [
        {
            "eventCode" : "EPT0726E",
            "eventHost" : "LA2",
            "eventId" : "0B004D43F86C478F",
            "eventDate" : "2015-07-26",
            "eventTime" : "18:30:00",
            "timeZone" : "America/Los_Angeles",
            "seatLocationMapRestrict": false,
            "locXnumAddescRestrict": false,
            "locRowSeatRestrict": false,
            "offers": [
                { "repName": "GPAS4", "ticketType": "00004C440003" }
            ]
        },
        {
            "eventCode" : "EPT0896A",
            "eventHost" : "LA2",
            "eventId" : "0C004F43F86C4BAC",
            "eventDate" : "2015-07-27",
            "eventTime" : "18:30:00",
            "timeZone" : "America/Los_Angeles",
            "offers": [
                { "repName": "GPAS4", "ticketType": "00004C440004" }
            ]
        }

        // ...
    ]
}
{% endhighlight %}



{: .article}
## Ticket Inventory and Seat Availability [GET]
{: #ticket-availability}
For use by Channel Partners only. Get total allocated and remaining ticket amounts for each ticket type per event. Current un-sold seat inventory is also included along with the current ticket reservation limit.

This service should not be used in real-time in line with an active purchase being made. The data available by this service may be cached for extended periods of time. Usage should be in accordance with agreed-upon rate limits between TM and the Channel Partner. Contact Ticketmaster for enablement.
For inventory that has been exclusively set aside, Channel partners are expected to maintain their own inventory counts and should only periodically check this service to sync inventory with their internal systems. However, for inventory that is “open” (non-exclusive) where anyone can sell from, Channel partners should not maintain their own inventory counts.

/partners/v1/events/{event_id}/availability
{: .code .red}

*Polling: No*

### Parameters

| Parameter  | Description          | Type              | Example      | Required |
|:-----------|:---------------------|:----------------- |:------------------ |:-------- |
| `event_id` | The 16-digit alphanumeric event ID.     | string            |     "0B004D43F86C478F"           | Yes      |


### Response structure:

{: .nested-list}

- `event` (object)  - Event.
    * `id` (string) - Event ID
    * `restrictSingle` (boolean) - true/false. Indicates a reserve cannot leave 1 seat remaining among a contiguous set of seats
    * `eventTicketLimit` (number) - 0 means unlimited, but reserves may still be limited by current seat inventory (currentTicketLimit)
    * `onsale` (datetime) - Event onsale date and time in UTC format
    *  `offsale` (datetime) - Event off sale date and time in UTC format
    * `eventDateTime` (datetime) - Event Date & Time in UTC format
    * `seatLocationMapRestrict`(boolean) - when true, host's ascii map through the sell prompt in tmwin will not be displayed.
    * `locRowSeatRestrict`(boolean) - when true, requires any client/partner to hide row and seat names from the customer. 
    * `locXnumAddescRestrict`(boolean) - when true, Xnumbers, ADDDESC, section on the event will not be displayed.
    - `tickets` (array) - tickets
        - {arrayitemobject} - ticket
            * `offers` (array) - Offers
                - {arrayitemobject} - offer
                    * `ticketTypeId` (text) - Ticket Type Id
                    * `priceLevelId` (number) - Price Level Id
                    * `currency` (text) - currency
                    * `faceValue` (number) - Face Value of the ticket
                    * `charges` (array) - Charges
                        - {arrayitemobject} - charge
                            * `reason` (text) - Charge reason. Eg. 'facility'
                            * `type` (text) - type of charge. Eg. 'fee'
                            * `amount` (number) - charge amount in the currency
                    * `offerName` (text) - Name of the offer
                    * `offerDescription` (text) - Description of the offer
            * `available` (number) - number of seats available
            * `total` (number) - total number of seats
            * `seating` (number) - type of seat "reserved" or "general"
            * `inventory` (array) - Inventory
                - {arrayitemobject} - Inventory item
                    * `section` (text) - Section prefix
                    * `row` (text) -  Row name
                    - `seats` (array) - seats
                        - {arrayitemobject} - seat number
                    - `places` (array) - places
                        - {arrayitemobject} - place
                    * `hasEvenOddMix` (boolean) - true/false. 'false' if row has only even or only odd numbered seating.
            * `eventTicketLimit` (number) - Ticket Limit for this offer.
            * `currentTicketLimit` (number) - Capped by available inventory and eventTicketLimit.


>[Request](#req)
>[Response](#res)
{: .reqres}

{% highlight bash %}
https://app.ticketmaster.com/partners/v1/events/0B004D43F86C478F/availability?apikey=GkB8Z037ZfqbLCNtZViAgrEegbsrZ6Ne
{% endhighlight %}


{% highlight js %}
Status 200
{
    "event" : {
        "id":"0B004D43F86C478F",
        "restrictSingle" : true,  // indicates a reserve cannot leave 1 seat remaining among a contiguous set of seats
        "eventTicketLimit" : 10,  // 0 = unlimited for this event, but reserves may still be limited by current seat inventory (currentTicketLimit) 
        "seatLocationMapRestrict": false,
        "locXnumAddescRestrict": false,
        "locRowSeatRestrict": false,
        "tickets":[
            {

                "available":5034,
                "total": 10345,
                "currentTicketLimit" : 4, // capped by available inventory and eventTicketLimit
                "inventory" : [
                    // hasEvenOddMix indicates the row has even/odd numbered seating.
                    { "section" : "207", "row" : "A", "seats" : [ 2, 4, 6, 8], "places" : ["INGEEMRQHE5E2ORRG4", "INGEEMRQHE5E2ORRGA", "INGEEMRQHE5E2ORRGE", "INGEEMRQHE5E2ORRGI"], "hasEvenOddMix" : false},      

                    { "section" : "208", "row" : "A", "seats" : [ 1, 2], "places" : ["INGEEMRQHE5E2ORU", "INGEEMRQHE5E2ORV"], "hasEvenOddMix" : true}
                ],

                "offers" : [
                    {
                        "charges" : [
                            {
                                "amount" : 3.0,
                                "reason" : "facility",
                                "type": "fee"
                            }
                        ],

                        "currency": "USD",
                        "faceValue" : 25.0,
                        "offerDescription" : "GPAS1",
                        "offerName" : "GPAS1",
                        "priceLevelId" : "1",
                        "ticketTypeId" : "00000405000C"
                    },
                    {
                        "charges" : [
                            {
                                "amount" : 3.0,
                                "reason" : "facility",
                                "type": "fee"
                            }
                        ],

                        "currency": "USD",
                        "faceValue" : 25.0,
                        "offerDescription" : "GPAS1J",
                        "offerName" : "GPAS1J",
                        "priceLevelId" : "1",
                        "ticketTypeId" : "00000406000C"
                    }
                ]
            },

            {
                "available":43,
                "total": 108,
                "currentTicketLimit" : 6,
                "eventTicketLimit" : 10,
                "inventory" : [
                    { "section" : "209", "row" : "B", "seats" : [ 2, 4, 6, 8, 10, 12, 16],
                      "areas": [
		              {
		                "description": "Right Side of Theatre",
		                "name": "RIGHT",
		                "areaId": "10"
		              },
		              {
		                "description": "Main Floor-Orchestra Level",
		                "name": "ORCH",
		                "areaId": "5"
		              }
			         ],
                    "hasEvenOddMix" : false}
                ],
                "offers" : [
                    {
                        "charges" : [
                            {
                                "amount" : 5.0,
                                "reason" : "facility",
                                "type": "fee"
                            }
                        ],

                        "currency": "USD",
                        "faceValue" : 50.0,
                        "offerDescription" : "GPAS2",
                        "offerName" : "GPAS2",
                        "priceLevelId" : "1",
                        "ticketTypeId" : "00000407000C"
                    }
                ]
            }
        ]
    }
}
{% endhighlight %}
