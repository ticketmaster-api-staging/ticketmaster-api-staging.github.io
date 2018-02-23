---
layout: documentation-single
categories:
- documentation
- sdks
- presence-sdk-integrate

title: iOS Presence SDK Reference and Integration Guide

img: "/assets/img/tutorial/presenceSDKSampleApp/presenceSampleApp.png"

link: "/products-and-docs/sdks/presence-sdk/iOS/index.html"

announcement: "Integrating the Presence SDK into your iOS app is fast and simple."

tags: 
  - PresenceSDK
  - iOS

excerpt: Demo the newest version of the Presence SDK!
---

# iOS Presence SDK Integration Guide
## Download
[Download](/products-and-docs/sdks/presence/ios/PresenceSDK+ExperienceSDK-Swift4.0.0-Version1_5_0.zip) Presence SDK iOS - Swift 4.0.0 .

[Download](/products-and-docs/sdks/presence/ios/PresenceSDK+ExperienceSDK-Swift3.1-Version1_5_0.zip) Presence SDK iOS - Swift 3.1.

## What You Need
To integrate Presence SDK in your application, you will need the latest release of the Presence SDK for iOS.

#### Requirements for using Swift 4.0.0 build

- To build, you must use XCode 9.0.0 and the iOS 11.0 SDK
- Minimum iOS 9.0, supported through iOS 11

#### Requirements for using Swift 3.1 build

- To build, you must use XCode 8.3.3 and the iOS 10.3 SDK
- Minimum iOS 9.0, supported through iOS 10.3.3

#### General Requirements
- Only Portrait Orientation Supported.

## Importing The SDK
Follow these simple steps to integrate and configure the SDK.

Step 1: Drag and drop the PresenceSDK.framework and iOSExperienceSDK.framework into your project’s General -> Embedded Binaries settings (copy items if needed)

![PresenceSDK iOS Step 1](/assets/img/products-and-docs/PresenceSDK-iOS-Step-1.png)

Step 2: Go to your app’s AppDelegate file and import the PresenceSDK module. You may delete the line where UIKit is being imported if you like. In the PresenceSDK module, UIKit is already being imported for you.

{% highlight swift %}
import PresenceSDK  //Import this module
{% endhighlight %}

Step 3: Create a configurePresenceSDK() method inside your AppDelegate class. In this method, the account credentials and branding color will be configured.

{% highlight swift %}
private func configurePresenceSDK() {
  //If you are a team use the following method to configure Presence SDK
  PresenceSDK.getPresenceSDK().setConfig(consumerKey: #consumer_key provided on dev portal,
                                             displayName: #your_team_display_name,
                                   useNewAccountsManager: #true/false for choosing between new or old account manager, by default it will choose old accounts manager)
  
  //If you are not a team and just going to login in Ticketmaster account than use the following method to configure Presence SDK
  PresenceSDK.getPresenceSDK().setConfig(consumerKey: #consumer_key provided on dev portal)

  //Configure your branding color for the SDK
  PresenceSDK.getPresenceSDK().setBrandingColor(color: UIColor(hex6: 0x3B6AA0))
}

{% endhighlight %}

**Note**: To get consumer key please create an account on https://developer.ticketmaster.com and register your app and it will generate a consumer key that can be used in the above method. Before you can use Presence SDK you will have to provide the generated consumer key together with consumer secret and redirect URI to Presence SDK support team so we can configure your app on our end!

Step 4: Call the configurePresenceSDK() method in the application(_: didFinishLaunchWithOptions:_) function.

{% highlight swift %}
func application(_ application: UIApplication,
  didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
  // Override point for customization after application launch.
  configurePresenceSDK()
  return true
}
{% endhighlight %}

### Configure Experience SDK

Presence SDK is packaged with Experience SDK and you have to embed both the frameworks to use Presence SDK. If you don’t want to use Experience SDK in your client app than please skip this step but if your client app also wants to provide Experience SDK features than you will also need to configure it. To configure Experience SDK please use this convenient method:

{% highlight swift %}
func configureExperienceSDK() {
  let experienceConfiguration = ExperienceConfiguration.Builder.init()
    .setAppId("yourAppId")
    .setAppSource("yourAppSource")
    .setSubdomain("subdomainForYourApp")
    .setAppName("yourAppName")
    .setApiKey("yourApiKey")
    .setApiSubdomain("apiSubdomainForYourApp")
    .setSsoSigningKey("SsoSingingKey")
    .build()
  PresenceSDK.getPresenceSDK().setExperienceConfiguration(experienceConfiguration)
}
{% endhighlight %}

You can call this method from didFinishLaunchingWithOptions() method in your AppDelegate class.


## Setting Up the Views
Now that we've imported the SDK into your project we can set up the views to display the UI.

### Setup PresenceSDKView

In your storyboard, create a UIViewController or you may use the preset one provided by XCode when a new project is created.  This UIViewController will be the starting point for Presence SDK. 

Step 1: Drag and drop a UIView from the Object Library (located in the Utility panel) inside this UIViewController. For this UIView, in the Identity Inspector, change the class to `PresenceSDKView` and Module to `PresenceSDK`. Finally, set the constraints to the UIView to the edges of the View Controller.

Step 2: Like the UIView from the previous step, drag and drop a UIBarButtonItem onto the Navigation Item of the View Controller. If the View Controller doesnt have a Navigation item, you may drag and drop from the Object Library before adding a UIBarButtonItem. Double click the UIBarButtonItem's title and type in "Logout".

![PresenceSDK iOS Step 1](/assets/img/products-and-docs/PresenceSDK-iOS-Step-1A.png)

You may now run the application and if you have provided correct configuration, you will see a similar screen to the image below at startup.

**NOTE:** Further setup required. You still need to configure your application to handle PresenceSDK events.

![PresenceSDK iOS Step 1 result](/assets/img/products-and-docs/PresenceSDK-iOS-Step-1B.png)

### Configuring Your ViewController

**Note**: This is a basic example for configuring the ViewController

Step 3: Import the PresenceSDK module. Again, UIKit is imported automatically when importing PresenceSDK, so if you like, you may delete the `import UIKit` code-line.

{% highlight swift %}
import PresenceSDK
{% endhighlight %}

Step 4: Create an `IBOutlet` to the UIView you setup in step 1. When the outlet is created, please make sure the view is of type PresenceSDKView. Also, create an `IBAction` method called `logout` for the UIBarButtonItem you setup in step 2. In the method `logout`, call the `logOut` method in the PresenceSDK.

{% highlight swift %}
//Connect your PresenceSDKView here
@IBOutlet weak var presenceSDKView: PresenceSDKView? = nil

...

@IBAction func logout(_ sender: UIBarButtonItem) {
  // class variable: let presenceSDK: PresenceSDK = PresenceSDK.getPresenceSDK() 
  presenceSDK.logOut()
}
{% endhighlight %}

Step 5: Conform your ViewController to PresenceLoginDelegate and implement the required and optional protocol methods:

{% highlight swift %}
extension ViewController: PresenceLoginDelegate {
  //Mandatory methods that the confirming class has to implement. ----------

  ///Method is invoked if the user granted app access/logged in.
  ///- parameter backendName: Name of the backend this callback event is associated with.
  ///- parameter accessToken: access token returned from the specified backend.
  func onLoginSuccessful(backendName: PresenceLogin.BackendName, accessToken: String)

  ///User dismissed login window via the Cancel button
  ///- parameter backendName: Name of the backend this callback event is associated with.
  func onLoginCancelled(backendName: PresenceLogin.BackendName)
    
  ///Called when results are returned for a member info request after successful login
  ///- parameter member: PresenceMember object. PresenceMember object is `nil` if login 
  ///fails or an error is returned fetching member details.
  func onMemberUpdated(backendName: PresenceLogin.BackendName, member: PresenceMember?)

  ///- parameter backendName: Name of the backend this callback event is associated with.
  ///- parameter error: If available, an `NSError` object is returned. Defaults is `nil`.
  func onLoginFailed(backendName: PresenceLogin.BackendName, error: NSError?)

  /// Notify when successfully logged-out from both backends
  func onLogoutAllSuccessful()

  ///Optional Methods ----------

  /// Notify when user clicks on "forgot password" link
  func onLoginForgotPasswordClicked()
    
  /// Notify when all cache is cleared
  func onCacheCleared()
    
  /// Notify when successfully logged-out
  ///- parameter backendName: Name of the backend this callback event is associated with.
  func onLogoutSuccessful(backendName: PresenceLogin.BackendName)
 
  ///Called when the LoginWindow is made visible to the user.
  func loginWindowDidDisplay() 
}
{% endhighlight %}

Step 6: Start PresenceSDK inside viewDidLoad() life cycle method.

{% highlight swift %}


override func viewDidLoad() {
  super.viewDidLoad() 
  // class variable: let presenceSDK: PresenceSDK = PresenceSDK.getPresenceSDK()       
  persenceSDK.start(presenceSDKView: presenceSDKView, loginDelegate: self)
}
{% endhighlight %}

Step 7: If you need to get information for logged in member, you can use one the protocol methods.

{% highlight swift %}
///Called when results are returned for a Member info request after login
///- parameter member: Member object. Member object is `nil` if login fails or an error is returned fetching member details.
func onMemberUpdated(_ member: PresenceMember?) {
  if let pMember = member {
    print("Member Email: \(pMember.emailAddress)")
    print("Team Member-Id: \(pMember.AccountManagerMemberID)")
    print("Host Member-Id: \(pMember.HostMemberID)")
  }        
}

{% endhighlight %}

Your ViewController’s implementation should look like this:

{% highlight swift %}
import PresenceSDK

class ViewController: UIViewController {

  @IBOutlet weak var presenceSDKView: PresenceSDKView? = nil
  let presenceSDK: PresenceSDK = PresenceSDK.getPresenceSDK()

  override func viewDidLoad() {
    super.viewDidLoad()
    presenceSDK.start(presenceSDKView: presenceSDKView, loginDelegate: self)

  }

  @IBAction func logout(_ sender: UIBarButtonItem) {
    presenceSDK.logOut()
  }
}

extension ViewController: PresenceLoginDelegate{

  func onLoginSuccessful(backendName: PresenceLogin.BackendName, accessToken: String) {
  }

  func onLoginCancelled(backendName: PresenceLogin.BackendName) {
  }

  func onMemberUpdated(backendName: PresenceLogin.BackendName, member: PresenceMember?) {
    if let pMember = member {
      print("Member Email: \(pMember.emailAddress)")
      print("Team Member-Id: \(pMember.AccountManagerMemberID)")
      print("Host Member-Id: \(pMember.HostMemberID)")
    }
  }

  func onLogoutAllSuccessful() {
  }

  func onLoginFailed(backendName: PresenceLogin.BackendName, error: NSError?) {
  }
}

{% endhighlight %}

You have finish integrating PresenceSDK. Now, you may run the application, if everything was configured properly, you should see your tickets once you log in.

# iOS Presence SDK Reference Guide
## Specifying a Branding Color
Configure your branding color with a UIColor object

{% highlight swift %}
presenceSDK.setBrandingColor(color: UIColor.blue)
{% endhighlight %}

## Configure Team Theme
Configure your team's theme as `SDKTheme.Light` (default) or `SDKTheme.Dark`. The theme configuration lets PresenceSDK
know how to setup various UI elements to contrast with branding color. For example, if branding 
color is in the dark color spectrum, a `Light` theme configuration will color various UI elements white.
This will allow crucial UI element to be visible to the user.
{% highlight swift %}
/**     
Method for configuring Team Apps theme color in PresenceSDK. This theme color will be used
on various UI elements of the SDK to provide a custom look for Team apps.
    
- Parameters:
- theme: Theme to be used in the SDK.
*/
func setTheme(theme: SDKTheme)
{% endhighlight %}


## Logout Methods
Following methods are provided for logging out of the Presence SDK.

{% highlight swift %}
//To logout from both Host and Archtics
PresenceSDK.getPresenceSDK().logOut()

//To logout from Ticketmaster Account 
PresenceSDK.getPresenceSDK().logOutHost()

//To logout from Account Manager
PresenceSDK.getPresenceSDK().logOutTeam()
{% endhighlight %}

A simple Logout handler function can look like this:

{% highlight swift %}
@IBAction func logout(_ sender: UIBarButtonItem) {
  PresenceSDK.getPresenceSDK().logOut()
}
{% endhighlight %}


## Check Login Status

Presence SDK also provides some helper methods for checking if user is logged into any of the supported services.

{% highlight swift %}
// Method to check if user is logged in any of the services i.e Host or Accounts
// Manager.
PresenceSDK.getPresenceSDK().isLoggedIn()

// Method to check if user is logged in Host.
PresenceSDK.getPresenceSDK().isLoggedIntoHost()

// Method to check if user is logged in Accounts Manager.
PresenceSDK.getPresenceSDK().isLoggedIntoTeam()
{% endhighlight %}


## Global Methods
{% highlight swift %}
  // This method returns version number of the SDK as a String.
  func getVersionNumber()

  /**
  Method for getting a valid OAUTH Access Token
     
  - Parameters:
  - backendName: Token for Host or AccountManager
  - success: This block will be called when a valid token is fetched
    successfully, the success block will provide a valid access token.
  - failure: This block will be called when there is some error fetching the
    token, the failure block will provide an error object. */  
  func getAccessToken(backendName: PresenceLogin.BackendName, 
                          success: @escaping AccessTokenSuccessCompletionHandler, 
                          failure: @escaping AccessTokenFailureCompletionHandler)
{% endhighlight %}




## Analytics
Presence SDK provides support for tracking user activity via its Analytics module.

For tracking user activity in the Presence SDK a separate class PresenceEventAnalytics is provided that lists all the user actions that are notified via local notifications together with the payload data. 

Notifications - You can observe these notifications to receive updates from Presence SDK.

{% highlight swift %}
@objcMembers final public class Action : NSObject {

  /////////////////////////////////////////////////////////////////////////////////////////
  // Notified when all user events are displayed
  // The payload will be nil.
  public static let ACTION_MYTICKETSCREENSHOWED: String

  // Notified when user selects a specific event to via tickets
  // The payload will contain all the mandatory data.
  public static let ACTION_MANAGETICKETSCREENSHOWED: String

  // Notified when user visits the Add Payment Method screen
  // The payload will contain all the mandatory data.
  public static let ACTION_ADDPAYMENTINFOSCREENSHOWED: String

  // Notified when user visits the Barcode screen
  // The payload will contain all the mandatory data.
  public static let ACTION_MYTICKETBARCODESCREENSHOWED: String

  // Notified when user visits the Tickets Detail screen
  // The payload will contain all the mandatory data.
  public static let ACTION_TICKETDETAILSSCREENSHOWED: String

  
  // Transactional Actions
  /////////////////////////////////////////////////////////////////////////////////////////

  // Notified when user tries to Initiate Ticket Transfer
  // The payload will contain all the mandatory data and will also contain
  // INITIATE_TRANSFER_TICKET_COUNT and INITIATE_TRANSFER_TICKET_FACEVALUE
  public static let ACTION_TRANSFERINITIATED: String

  // Notified when user Cancels a Ticket Transfer
  // The payload will contain all the mandatory data and will also contain
  // CANCEL_TRANSFER_ID
  public static let ACTION_TRANSFERCANCELLED: String

  // Notified when user Post a ticket for Resale
  // The payload will contain all the mandatory data and will also contain
  // INITIATE_RESALE_TICKET_COUNT and INITIATE_RESALE_PRICE
  // Payload will also contain RESALE_BUYER_FEES, RESALE_SELLER_FEES,
  // RESALE_SELLER_PAYOUT and RESALE_ORIGINAL_FACE_VALUE
  public static let ACTION_RESALEINITIATED: String

  // Notified when user Cancels a posted ticket for Resale
  // The payload will contain all the mandatory data and will also contain
  // CANCEL_RESALE_POSTING_ID
  public static let ACTION_RESALECANCELLED: String

  // Notified when user Edit a Posted ticket for Resale
  // The payload will contain all the mandatory data and will also contain
  // UPDATE_RESALE_POSTING_ID and UPDATE_RESALE_PRICE

  // Payload will also contain RESALE_BUYER_FEES, RESALE_SELLER_FEES,
  // RESALE_SELLER_PAYOUT and RESALE_ORIGINAL_FACE_VALUE
  public static let ACTION_RESALEEDITED: String
}

{% endhighlight %}

Payload Data for the Notifications – Only relevant information is sent out with the notification.

{% highlight swift %}
@objcMembers final public class Data : NSObject {

  // Mandatory Payload Data with all the Notifications
  public static let EVENT_ID: String

  public static let EVENT_NAME: String

  public static let EVENT_DATE: String

  public static let EVENT_IMAGE_URL: String

  public static let VENUE_NAME: String

  public static let VENUE_ID: String

  public static let CURRENT_TICKET_COUNT: String

  public static let ARTIST_NAME: String

  public static let ARTIST_ID: String


  // Notification Specific Payload Data
  public static let INITIATE_TRANSFER_TICKET_COUNT: String

  public static let INITIATE_TRANSFER_TICKET_FACEVALUE: String

  public static let CANCEL_TRANSFER_ID: String

  public static let CANCEL_TRANSFER_ORDER_ID: String

  public static let INITIATE_RESALE_TICKET_COUNT: String

  public static let INITIATE_RESALE_PRICE: String

  public static let UPDATE_RESALE_POSTING_ID: String

  public static let UPDATE_RESALE_PRICE: String

  public static let RESALE_BUYER_FEES: String

  public static let RESALE_ORIGINAL_FACE_VALUE: String

  public static let RESALE_SELLER_PAYOUT: String

  public static let RESALE_SELLER_FEES: String

  public static let CANCEL_RESALE_POSTING_ID: String
}
{% endhighlight %}

### Analytics Usage

If you want to track ACTION_MANAGETICKETSCREENSHOWED event you should add an observer inside your ViewController’s viewDidLoad() method like this:

{% highlight swift %}
override func viewDidLoad() {
  super.viewDidLoad()

  NotificationCenter.default.addObserver(self, selector: #selector(self.ticketsScreenShown),
    name: NSNotification.Name(rawValue:PresenceEventAnalytics.Action.ACTION_MANAGETICKETSCREENSHOWED),
    object: nil)
}
{% endhighlight %}

And the notification handler will look something like this:

{% highlight swift %}
@objc func ticketsScreenShown(_ notification: Notification) {
  let eventId = notification.userInfo?[PresenceEventAnalytics.Data.EVENT_ID] ?? ""
  let eventName = notification.userInfo?[PresenceEventAnalytics.Data.EVENT_NAME] ?? ""
  print("Event_Id: \(eventId), Event_Name: \(eventName)")
}
{% endhighlight %}


## Release
Following section describes the steps you need to follow to prepare your app for the App Store.

PresenceSDK is packaged as a Universal binary and it contains binary packages for all valid architectures including ARMv* and x86. This is great for development as you can run your app on both devices and simulators but for App Store submission you need to strip the simulator packages from your App. To do this we have provided “strip_frameworks.sh” file, just add this file to the Run Script phase under your app’s Build Phases settings and it will do the work for you. Here is a screenshot of what your Build phases will look like after adding this file:

![PresenceSDK iOS Step 5 result](/assets/img/products-and-docs/PresenceSDK-iOS-Store-Submission.png)

{% highlight shell %}
#For your copy and paste needs
bash "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/PresenceSDK.framework/strip_frameworks.sh"
{% endhighlight %}
