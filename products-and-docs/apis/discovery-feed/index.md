---
layout: documentation
categories:
- documentation
- discovery-feed
- partner
redirect_from:
- "/apis/discovery-feed/"

title: Discovery Feed

excerpt: The Ticketmaster Partner API lets clients reserve, purchase, and retreive ticket and event informaton.
keywords: Partner API, host and API, reserve tickets, create a cart, order management, member management
---

{: .article}
# Discovery Feed

The Ticketmaster Discovery Feed provides access to event content on Ticketmaster. All data is sourced from the Discovery API and delivered as a separate file per country with multiple formats available
## Overview
{: #overview }

### Authentication

Access is provided to authorized clients only. Please request access by contacting developer@ticketmaster.com.
Clients will be provided an API key from Ticketmaster which should be added to every resource endpoint call.

Example: http://app.ticketmaster.com/dc/feeds/v1/events.json?apikey=GkB8Z6m6fmIfacdQAd6cwPLXj2Oh

### Host and API endpoint information

http://app.ticketmaster.com/dc/feeds/v1/

All connections must be made over SSL using https.

    
### Event Sources
  The Discovery Feed provides event content from Ticketmaster, FrontGate Tickets and Ticketmaster
  Resale.

### Supported Countries
    Events are available from the following countries: US, CA, IE, GB, AU, NZ, MX, AT, BE, DE, DK, ES, FI, NL, NO, PL, SE and FR.


{: .article}
## Get Events [GET]
{: #discovery-feed-details}

Download a list of events in supported countries.The following formats are available: csv, xml or json.The Discovery Feed generates .gz (non-tar) files for the requested format.
If you do not mention countryCode parameter it is defaulted to "US".


http://app.ticketmaster.com/dc/feeds/v1/events.{format}?apikey={apikey}&countryCode={countryCode}


### Parameters

| Parameter  | Description          | Type              | Example      | Required |
|:-----------|:---------------------|:----------------- |:------------------ |:-------- |
| `countryCode` | ISO Alpha-2 Code country value     | string            |     GB           | No (Default : US)|
| `apikey`   | Your API Key         | string            |     "GkB8Z037ZfqbLCNtZViAgrEegbsrZ6Ne"          | Yes      |

### Response structure:

{: .nested-list}

- `Discovery Feed` (array)  - Events .
    - {arrayitemobject} - event
        * `eventId` (string) -  Unique ID for the event
        * `legacyEventId` (string) – unique ID of the event (old format)
        * `primaryEventUrl`(string) – URL of the event detail page
        * `resaleEventUrl` (string) – URL to buy resale tickets for the event
        * `eventName` (string) - 	Name of the event
        * `eventNotes` (string) - 	Notes for the event
        * `eventStatus` (string) -  Status of the event
        * `eventImageUrl` (string) – Public URL of the event image
        * `eventInfo` (string) - Event Information
        * `eventStartDateTime` (string) – Event start date/time (UTC format)
        *	`eventEndDateTime` (string) – Event end date/time (UTC format)
        * `eventStartLocalDate` (string) – Event date in the venue's timezone MM/DD/YY format
        *	`eventStartLocalTime` (string) – Event start time in the venue's timezone HH:MM format
        - `promoters` (array)  - Promoters
            - {arrayitemobject} - Promoter
                *  `id` (string)
                *  `name` (string)
                *  `description` (string)
        - `venue` (object) - Venue
             *	`venueName` (string) – Name of the venue
             *	`legacyVenueId` (string) – unique ID of the venue (old format)
             *  `venueId` (string) – Unique ID of the venue
             *  `venueStreet` (string) – Address of the venue
             *  `venueCity` (string) – City of the venue
             *  `venueStateCode` (string) – State/Province of the venue
             *  `venueCountryCode` (string) – Country of the venue
             *  `venueLatitude` (string) – Latitude of the venue
             *  `venueLongitude` (string) – Longitude of the venue
             *  `venueZipCode` (string) – Postal code/zipcode of the venue
             *  `venueTimezone` (string) – Timezone of the venue
             *  `venueUrl` (string) – URL of the venue detail page
        -  `attractions` (array)  - Attractions
            - {arrayitemobject} - Attraction
                 *  `attractionUrl` (string) – URL of the attraction detail page
                 *  `attractionName` (string) – list of attraction names
                 *  `legacyAttractionId` (string) – unique ID of the attraction (old format)
                 *  `attractionId` (string) – list of unique attraction IDs
                 *  `attractionImageUrl` (string) – list of attraction image URLs
                 *  `classificationSegmentId`(string) - Segment Id
                 *  `classificationSegment`(string) - A Segment is a primary genre for an attraction
                 *  `classificationGenreId`(string) - Genre Id
                 *  `classificationGenre`(string) - Secondary Genre to further describe an attraction
                 *  `classificationSubGenreId`(string) - Sub Genre Id
                 *  `classificationSubGenre`(string) - Tertiary Genre for additional detail when describing an attraction
                 *  `classificationTypeId`(string) - Classification Type Id
                 *  `classificationType`(string) - A Type represents a kind of attraction
                 *  `classificationSubTypeId`(string) - Classification Sub Type Id
                 *  `classificationSubType` (string) - Secondary Type to further categorize an attraction
                 - `images` (array) - Images
                    - {arrayitemobject} - Image
                       *  `ratio` (string)
                       *  `url` (string)
                       *  `width` (string)
                       *  `height` (string)
                       *  `fallback` (string)
        * `minPrice` (string) – Minimum price
        * `maxPrice` (string) – Maximum price
        * `currency` (string) – Currency
        * `onsaleStartDateTime` (string) – Event onsale start date/time UTC format
        * `onsaleEndDateTime` (string) – Event onsale end date/time UTC format
        * `classificationSegment` (string) - A Segment is a primary genre for an entity Music, Sports, Arts, etc)
        * `classificationGenre` (string) - Secondary Genre to further describe an entity (Rock, Classical, Animation, etc)
        * `classificationSubGenre` (string) - Tertiary Genre for additional detail when describing an entity (Alternative Rock,Ambient Pop, etc)
        * `presaleName` (string) – Name of the presale
        * `presaleDateTimeRange` (string) – Description of the presale
        -  `presales` (object)  - Presales
           *  `presaleName` (string) – list of presale names
           *  `presaleDescription` (string) – list of presale descriptions
           *  `presaleStartDateTime` (string) – list of presale start/date times (UTC format)
           *  `presaleEndDateTime` (string) – list of presale end/date times (UTC format)
        * `source` (string) – source ticketing platform of event
        * `classificationType` (string) - A Type represents a kind or group of people. (Donation, Group, Individual, Merchandise, Event Style, etc)
        * `classificationSubType` (string) - Secondary Type to further categorize an entity (Band, Choir, Chorus, etc)


>[Request](#req)
>[Response](#res)
{: .reqres}


{% highlight bash %}
http://app.ticketmaster.com/dc/feeds/v1/events.json?apikey=GkB8Z6m6fmIfacdQAd6cwPLXj2Oh
{% endhighlight %}

{% highlight js %}
Status 200
{
  "eventId" : "G5diZsSggivjL",
  "legacyEventId" : "3B00533D15B0171F",
  "primaryEventUrl" : "http://www.ticketmaster.com/event/3B00533D15B0171F",
  "resaleEventUrl" : null,
  "eventName" : "St. John's v. Molloy",
  "eventInfo" : null,
  "eventNotes" : null,
  "eventStatus" : "onsale",
  "eventImageUrl" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_TABLET_LANDSCAPE_LARGE_16_9.jpg",
  "eventStartDateTime" : "2017-11-20T23:30:00Z",
  "eventStartLocalTime" : "18:30",
  "eventStartLocalDate" : "2017-11-20",
  "eventEndDateTime" : null,
  "venue" : {
    "venueName" : "Carnesecca Arena",
    "venueId" : "KovZpZAEAdFA",
    "legacyVenueId" : "483475",
    "venueUrl" : "http://www.ticketmaster.com/venue/483475",
    "venueTimezone" : "America/New_York",
    "venueZipCode" : "11439",
    "venueLatitude" : 40.72397929,
    "venueLongitude" : -73.79468334,
    "venueStreet" : "8000 Utopia Parkway",
    "venueCity" : "Queens",
    "venueStateCode" : "NY",
    "venueCountryCode" : "US"
  },
  "attractions" : [ {
    "attraction" : {
      "attractionUrl" : "http://www.ticketmaster.com/artist/844662",
      "attractionId" : "K8vZ9171LkV",
      "legacyAttractionId" : "844662",
      "attractionName" : "St. John's Red Storm Men's Basketball",
      "attractionImageUrl" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "images" : [ {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_RECOMENDATION_16_9.jpg",
          "width" : 100,
          "height" : 56,
          "fallback" : false
        }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_RETINA_PORTRAIT_16_9.jpg",
          "width" : 640,
          "height" : 360,
          "fallback" : true
        }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width" : 2048,
          "height" : 1152,
          "fallback" : false
        }
      }, {
        "image" : {
          "ratio" : "4_3",
          "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_CUSTOM.jpg",
          "width" : 305,
          "height" : 225,
          "fallback" : false
        }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width" : 2048,
          "height" : 1152,
          "fallback" : true
        }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_RETINA_PORTRAIT_16_9.jpg",
          "width" : 640,
          "height" : 360,
          "fallback" : false
        }
      }, {
        "image" : {
          "ratio" : "3_2",
          "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_RETINA_PORTRAIT_3_2.jpg",
          "width" : 640,
          "height" : 427,
          "fallback" : false
        }
      }, {
        "image" : {
          "ratio" : "3_2",
          "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_ARTIST_PAGE_3_2.jpg",
          "width" : 305,
          "height" : 203,
          "fallback" : false
        }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_EVENT_DETAIL_PAGE_16_9.jpg",
          "width" : 205,
          "height" : 115,
          "fallback" : true
        }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_RETINA_LANDSCAPE_16_9.jpg",
          "width" : 1136,
          "height" : 639,
          "fallback" : true
        }
      }, {
        "image" : {
          "ratio" : "3_2",
          "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_RETINA_PORTRAIT_3_2.jpg",
          "width" : 640,
          "height" : 427,
          "fallback" : true
        }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_RECOMENDATION_16_9.jpg",
          "width" : 100,
          "height" : 56,
          "fallback" : true
        }
      }, {
        "image" : {
          "ratio" : "3_2",
          "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_TABLET_LANDSCAPE_3_2.jpg",
          "width" : 1024,
          "height" : 683,
          "fallback" : true
        }
      }, {
        "image" : {
          "ratio" : "3_2",
          "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_ARTIST_PAGE_3_2.jpg",
          "width" : 305,
          "height" : 203,
          "fallback" : true
       }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_TABLET_LANDSCAPE_16_9.jpg",
          "width" : 1024,
          "height" : 576,
          "fallback" : true
        }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_EVENT_DETAIL_PAGE_16_9.jpg",
          "width" : 205,
          "height" : 115,
          "fallback" : false
        }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_TABLET_LANDSCAPE_16_9.jpg",
          "width" : 1024,
          "height" : 576,
          "fallback" : false
        }
      }, {
        "image" : {
          "ratio" : "4_3",
          "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_CUSTOM.jpg",
          "width" : 305,
          "height" : 225,
          "fallback" : true
        }
      }, {
        "image" : {
          "ratio" : "16_9",
          "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_RETINA_LANDSCAPE_16_9.jpg",
          "width" : 1136,
          "height" : 639,
          "fallback" : false
        }
      }, {
        "image" : {
          "ratio" : "3_2",
          "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_TABLET_LANDSCAPE_3_2.jpg",
          "width" : 1024,
          "height" : 683,
          "fallback" : false
        }
      } ]
    "classificationSegmentId" : "KZFzniwnSyZfZ7v7na",
    "classificationSegment" : "Arts & Theatre",
    "classificationGenreId" : "KnvZfZ7v7nl",
    "classificationGenre" : "Fine Art",
    "classificationSubGenreId" : "KZazBEonSMnZfZ7v7ld",
    "classificationSubGenre" : "Fine Art",
    "classificationTypeId" : "KZAyXgnZfZ7v7lt",
    "classificationType" : "Event Style",
    "classificationSubTypeId" : "KZFzBErXgnZfZ7vA6I",
    "classificationSubType" : "Exhibit"
    }
  } ],
  "images" : [ {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_RECOMENDATION_16_9.jpg",
      "width" : 100,
      "height" : 56,
      "fallback" : false
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_RETINA_PORTRAIT_16_9.jpg",
      "width" : 640,
      "height" : 360,
      "fallback" : true
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "width" : 2048,
      "height" : 1152,
      "fallback" : false
    }
  }, {
    "image" : {
      "ratio" : "4_3",
      "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_CUSTOM.jpg",
      "width" : 305,
      "height" : 225,
      "fallback" : false
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "width" : 2048,
      "height" : 1152,
      "fallback" : true
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_RETINA_PORTRAIT_16_9.jpg",
      "width" : 640,
      "height" : 360,
      "fallback" : false
    }
  }, {
    "image" : {
      "ratio" : "3_2",
      "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_RETINA_PORTRAIT_3_2.jpg",
      "width" : 640,
      "height" : 427,
      "fallback" : false
    }
  }, {
    "image" : {
      "ratio" : "3_2",
      "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_ARTIST_PAGE_3_2.jpg",
      "width" : 305,
      "height" : 203,
      "fallback" : false
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_EVENT_DETAIL_PAGE_16_9.jpg",
      "width" : 205,
      "height" : 115,
      "fallback" : true
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_RETINA_LANDSCAPE_16_9.jpg",
      "width" : 1136,
      "height" : 639,
      "fallback" : true
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_RECOMENDATION_16_9.jpg",
      "width" : 100,
      "height" : 56,
      "fallback" : true
    }
  }, {
    "image" : {
      "ratio" : "3_2",
      "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_RETINA_PORTRAIT_3_2.jpg",
      "width" : 640,
      "height" : 427,
      "fallback" : true
    }
  }, {
    "image" : {
      "ratio" : "3_2",
      "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_TABLET_LANDSCAPE_3_2.jpg",
      "width" : 1024,
      "height" : 683,
      "fallback" : true
    }
  }, {
    "image" : {
      "ratio" : "3_2",
      "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_ARTIST_PAGE_3_2.jpg",
      "width" : 305,
      "height" : 203,
      "fallback" : true
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_TABLET_LANDSCAPE_16_9.jpg",
      "width" : 1024,
      "height" : 576,
      "fallback" : true
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_EVENT_DETAIL_PAGE_16_9.jpg",
      "width" : 205,
      "height" : 115,
      "fallback" : false
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_TABLET_LANDSCAPE_16_9.jpg",
      "width" : 1024,
      "height" : 576,
      "fallback" : false
    }
  }, {
    "image" : {
      "ratio" : "4_3",
      "url" : "https://s1.ticketm.net/dam/c/8d5/f95bdd17-1d94-4e98-9295-641e4db558d5_105621_CUSTOM.jpg",
      "width" : 305,
      "height" : 225,
      "fallback" : true
    }
  }, {
    "image" : {
      "ratio" : "16_9",
      "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_RETINA_LANDSCAPE_16_9.jpg",
      "width" : 1136,
      "height" : 639,
      "fallback" : false
    }
  }, {
    "image" : {
      "ratio" : "3_2",
      "url" : "https://s1.ticketm.net/dam/a/ace/4173edef-6e4b-4677-8b45-d4fde6549ace_48141_TABLET_LANDSCAPE_3_2.jpg",
      "width" : 1024,
      "height" : 683,
      "fallback" : false
    }
  } ],
  "minPrice" : "25.00",
  "maxPrice" : "35.00",
  "currency" : "USD",
  "onsaleStartDateTime" : "2017-10-09T14:00:00Z",
  "onsaleEndDateTime" : "2017-11-20T23:30:00Z",
  "classificationSegment" : "Sports",
  "classificationGenre" : "Basketball",
  "classificationSubGenre" : "College",
  "presaleName" : null,
  "presaleDateTimeRange" : null,
  "presales" : [ ],
  "source" : "ticketmaster",
  "classificationType" : "Group",
  "classificationSubType" : "Team"
}
{% endhighlight %}

