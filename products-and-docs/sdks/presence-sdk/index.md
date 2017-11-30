---
layout: documentation-single
categories:
- documentation
- sdks
- presence-sdk
title: Presence SDK
excerpt: The Ticketmaster Presence SDK provides a simple way to add Ticketmaster features in your 3rd party iOS and Android apps
keywords: SDK, Presence, Ticket Management, iOS, Android
---


{% capture iOS_importing %}

Step 1: Drag and drop the PresenceSDK.framework and iOSExperienceSDK.framework into your project’s General -> Embedded Binaries settings (copy items if needed)

![PresenceSDK iOS Step 1](/assets/img/products-and-docs/PresenceSDK-iOS-Step-1.png)

Step 2: Go to your app’s AppDelegate file and import the PresenceSDK module. You may delete the line where UIKit is being imported if you like. In the PresenceSDK module, UIKit is already being imported for you.

{% highlight swift %}
import PresenceSDK  //Import this module
{% endhighlight %}

Step 3: Create a configurePresenceSDK() method inside your AppDelegate class. In this method, the account credentials and branding color will be configured.

{% highlight swift %}
//Swift Version
func configurePresenceSDK() {
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

In your storyboard, create a UIViewController or you may use the preset one provided by XCode when a new project is created.  This UIViewController will be the starting point for Presence SDK. 

Step 5: Drag and drop a UIView from the Object Library in the Utility panel inside this UIViewController. For this UIView, change the class to PresenceSDKView and Module as PresenceSDK. Before moving on make sure you set the constraints for this UIView.

![PresenceSDK iOS Step 5](/assets/img/products-and-docs/PresenceSDK-iOS-Step-2.png)

If you have provided correct configuration you will see a similar screen at startup when you run the application:


![PresenceSDK iOS Step 5 result](/assets/img/products-and-docs/PresenceSDK-iOS-Step-5.png)
{% endcapture %}



{% capture Android_importing %}
Step 1. Drop Presence sdk file in your application project libs folder

Step 2. Import it through “File -> New -> New Module -> Import .JAR / .AAR package”. Specify and locate the Presence sdk aar file.

![PresenceSDK Android Step 1](/assets/img/products-and-docs/PresenceSDK-Android-Step-1.png)

![PresenceSDK Android Step 2](/assets/img/products-and-docs/PresenceSDK-Android-Step-1-2.png)

Step 3. Go to your app module build gradle file and set the name of each aar file as compile dependencies as follows:

{% highlight java %}
compile project(‘:PresenceSDK-release-1.3.1.0’)
{% endhighlight %}

Step 4. Add the following dependencies in the same place as step #3:

{% highlight java %}
compile 'com.android.support:cardview-v7:25.3.1'
compile 'com.android.support:appcompat-v7:25.3.1'
compile 'com.android.support:support-v4:25.3.1'
compile 'com.android.support:recyclerview-v7:25.3.1'
compile 'com.android.support:design:25.3.1'
compile 'com.android.volley:volley:1.0.0'
compile 'com.google.code.gson:gson:2.4'
compile 'com.squareup.picasso:picasso:2.5.2'
compile 'com.romandanylyk:pageindicatorview:0.0.5'
compile 'com.google.zxing:core:3.2.1'
compile 'com.android.support:percent:25.3.1'
{% endhighlight %}

After adding them, the build gradle dependencies will look similar to the one shown as below:

![PresenceSDK Android Step 4](/assets/img/products-and-docs/PresenceSDK-Android-Step-1-4.png)

Step 5. Create a configurePresenceSDK() method inside your activity class. In this method, the account credentials and branding color will be configured.

{% highlight java %}
private void configurePresenceSDK() {
  PresenceSDK.getPresenceSDK(getApplicationContext()).setConfig(consumerKey /*Consumer key provided on dev portal*/, 
    displayName /*your team display name */, 
    useNewAccountManager /*true/false for choosing between new or old account manager, by default it will choose old accounts manager */);

  // Configure your branding color for the SDK
  //opaque red
  presenceSDK.getPresenceSDK(getApplicationContext()).setBrandingColor(
  Color.parseColor("#ffff0000")); 
}

{% endhighlight %}

**NOTE:**

1. Be aware that you need to pass application context object (not activity context) to PresenceSDK.getPresenceSDK() method. If it is not an application context, the presence sdk might reject and throw a runtime exception with a message to bring it to developer’s attention.

2. To get consumer key please create an account on [https://developer.ticketmaster.com](https://developer.ticketmaster.com) and register your app and it will generate a consumer key that can be used in the above method. Before you can use Presence SDK you will have to provide the generated consumer key together with consumer secret and redirect URI to Presence SDK support team so we can configure your app on our end!


Step 6.  Create launchPresenceSDK() method inside the same 	activity class. In this method, you will implement a login 	listener and start the presence sdk 

{% highlight java %}
private void launchPresenceSDK() {
  PresenceSDK.getPresenceSDK(getApplicationContext()).start(this,
    R.id.presenceSDK /*the id of the framelayout defined in 		activity layout where you want to load PreseneSDK UI fragment */
    , new TMLoginListener() {
        @Override
        public void onLoginSuccessful(TMLoginApi.BackendName 			backendName, String accessToken) {
          Log.i(TAG, "Inside onLoginSuccessful");
        }

        Override
        public void onLoginFailed(TMLoginApi.BackendName backendName, 			String errorMessage) {
          Log.i(TAG, "Inside onLoginFailed");
        }

        @Override
        public void onLoginCancelled(TMLoginApi.BackendName 			backendName) {
          Log.i(TAG, "Inside onLoginCancelled");
        }

        @Override
        public void onLoginMethodUsed(TMLoginApi.BackendName 			backendName, TMLoginApi.LoginMethod method) {
          Log.i(TAG, "Inside onLoginMethodUsed");
        }

        @Override
        public void onLoginForgotPasswordClicked(TMLoginApi.BackendName 			backendName) {
          Log.i(TAG, "Inside onLoginForgotPasswordClicked");
        }

        @Override
        public void onCacheCleared() {
          Log.i(TAG, "Inside onCacheCleared");
        }

        @Override
        public void onMemberUpdated(@Nullable TMLoginApi.MemberInfo 			member) {
          Log.i(TAG, "Inside onMemberUpdated");
        }
		  });
}

{% endhighlight %}

**NOTE:** 

You need to have a hosting activity layout where you need to add a 	framelayout to hold Presence sdk entry 	fragment. So, you will need to use the 	correct id of the framelayout specified in PresenceSDK.start() method. See code 	comment above.

Step 7. Create configureExperienceSDK() method inside the same activity class. In this method, you will configure about experience sdk.
	
Here is the sample code about how to set experience sdk wrapper object and set it to presence sdk.

{% highlight java %}
private void configureExperienceSDK() {
  // specify these parameters to integrate ExperienceSDK
  // and pass them into PresenceSDK
  // this will NOT crash if no ExperienceSDK lib provided
  // presenceSDK.start() will check the availability of ExperienceSDK lib
  ExperienceConfiguration wrapper = new ExperienceConfiguration.Builder()
    .setAppId(TmxConstants.Experience.EXPERIENCE_APP_ID)
    .setAppName(TmxConstants.Experience.EXPERIENCE_APP_NAME)
    .setApiKey(TmxConstants.Experience.EXPERIENCE_API_KEY)
    .setAppSource(TmxConstants.Experience.EXPERIENCE_APP_NAME)
    .setSubdomain(TmxConstants.Experience.EXPERIENCE_SUBDOMAIN)
    .setDevServers(false)
    .build();
	
    presenceSDK.setExperienceConfiguration(wrapper);
}
{% endhighlight %}

Step 8. Call the configurePresenceSDK(), launchPresenceSDK() and configureExperienceSDK() methods in the activity class onCreate() method.

{% highlight java %}
@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  // set layout where you want to load presence sdk login entry view
  setContentView(R.layout.activity_main); 
  // call configure presence sdk method
  configurePresenceSDK();
  // configure experience sdk
  configureExperienceSDK();
  // call launch presence sdk method
  launchPresenceSDK();
}

{% endhighlight %}

This will load the entry fragment (UI shown below) where a login screen will be prompted to users to choose Ticketmaster or Team Account to login. 

![PresenceSDK Android Step 7](/assets/img/products-and-docs/PresenceSDK-Android-Step-1-7.png)

Step 9. Define the “AppTheme” style in styles.xml as follows:

{% highlight html %}
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
{% endhighlight %}

Step 10. Add tools:replace for theme and label in application level  as follow:

{% highlight html %}
<application
android:allowBackup="true"
android:icon="@mipmap/ic_launcher"
android:label="@string/app_name"
android:roundIcon="@mipmap/ic_launcher_round"
android:supportsRtl="true"
android:testOnly="false"
android:theme="@style/AppTheme"
tools:replace="android:theme, android:label">

{% endhighlight %}

Step 11: Try to build and compile. At this point, it should be compiled without errors.

{% endcapture %}


{% capture iOS_set_view %}
## Configuring Your ViewController

**Note**: This is a basic example for configuring the ViewController

Step 1: Import PresenceSDK. Again, UIKit is imported automatically by importing PresenceSDK so if you like, you may delete the import UIKit code-line.

{% highlight swift %}
import PresenceSDK
{% endhighlight %}

Step 2: Create an outlet to the UIView that is of type PresenceSDKView.

{% highlight swift %}
//Connect your PresenceSDKView here
@IBOutlet weak var presenceSDKView: PresenceSDKView? = nil
{% endhighlight %}

Step 3: Conform your ViewController to PresenceLoginDelegate and implement the three required protocol functions.

{% highlight swift %}
extension ViewController: PresenceLoginDelegate {
  ///- parameter succeeded: Returns `true` if the user granted app access/logged in.
  ///- parameter error: If available, an `NSError` object is returned. Defaults is `nil`.
  func onLoginSuccessful(_ succeeded:Bool, error:NSError?)

  ///User dismissed login window via the Cancel button
  func onLoginCanceled()
    
  ///Called when results are returned for a member info request after successful login
  ///- parameter member: PresenceMember object. PresenceMember object is `nil` if login 
  ///fails or an error is returned fetching member details.
  func onMemberUpdated(_ member: PresenceMember?)
}
{% endhighlight %}

Step 4: Start PresenceSDK inside viewDidLoad() life cycle method.

{% highlight swift %}
override func viewDidLoad() {
  super.viewDidLoad()        
  PresenceSDK.getPresenceSDK().start(presenceSDKView: presenceSDKView, loginDelegate: self)
}
{% endhighlight %}

Step 5: If you need to get information for logged in member, you can use one the protocol methods.

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


class ViewController: UIViewController, PresenceLoginDelegate {

  @IBOutlet weak var presenceSDKView: PresenceSDKView?
  var presenceSDK: PresenceSDK?

  override func viewDidLoad() {
    super.viewDidLoad()
    self.navigationItem.title = NSLocalizedString("My Events", comment: "")
    presenceSDK = PresenceSDK.getPresenceSDK()
    presenceSDK.start(presenceSDKView: presenceSDKView, loginDelegate: self)

  }
 
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
  }

  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }

  @IBAction func logout(sender: UIButton) {
    presenceSDK.logOut()
  }


  func onLoginSuccessful(_ succeeded:Bool, error:NSError?) {
  }

  //User dismissed login window via the Cancel button
  func onLoginCancelled() {
  }

  ///Called when results are returned for a Member info request after login
  ///- parameter member: Member object. Member object is `nil` if login fails or an error is returned fetching member details.
  func onMemberUpdated(_ member: PresenceMember?) {
    if let pMember = member {
      print("Member Email: \(pMember.emailAddress)")
      print("Team Member-Id: \(pMember.AccountManagerMemberID)")
      print("Host Member-Id: \(pMember.HostMemberID)")
    }
  }
}

{% endhighlight %}

This is all you need to integrate the Presence SDK. Now you can run the application and Login into your configured accounts.

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
    .build()
  PresenceSDK.getPresenceSDK().setExperienceConfiguration(experienceConfiguration)
}
{% endhighlight %}

You can call this method from didFinishLaunchingWithOptions() method of AppDelegate class.


{% endcapture %}

{% capture Android_set_view %}

## Configuring Your Layout View

Specify a layout view in your desired layout file, for now this layout should fill the whole screen
The ID for this layout will be referenced in the next step

{% highlight java %}
<android.support.constraint.ConstraintLayout
  android:id="@+id/presenceSDKView"
  android:layout_width="0dp"
  android:layout_height="0dp"
  android:layout_marginBottom="0dp"
  android:layout_marginEnd="0dp"
  android:layout_marginStart="0dp"
  android:layout_marginTop="0dp"
  app:layout_constraintBottom_toBottomOf="parent"
  app:layout_constraintEnd_toEndOf="parent"
  app:layout_constraintStart_toStartOf="parent"
  app:layout_constraintTop_toTopOf="parent"/>
{% endhighlight %}

{% endcapture %}

{% capture iOS_branding_color %}
Configure your branding color with a UIColor object

{% highlight java %}
presenceSDK.setBrandingColor(color: UIColor.blue)
{% endhighlight %}

{% endcapture %}

{% capture Android_branding_color %}
Presence sdk clients can set their own branding theme color by defining this color value in their application resource “colors.xml” file:

{% highlight html %}
<color name="presence_sdk_color_branding">#FFAA81</color>
{% endhighlight %}

The defined color will be displayed on all action buttons, action bars and ticket details page. If the above color variable is not defined in the client’s apk project, Tmx sdk will use a default color.

Also, there is a way to change the color at run time.

{% highlight java %}
presenceSDK.getPresenceSDK(this).setBrandingColor(Color.parseColor("#ffff0000")); 
{% endhighlight %}

The defined color will be displayed on all action buttons, action bars and ticket details page. If the above color variable is not defined in the client’s apk project, Tmx sdk will use a default color.
{% endcapture %}

{% capture iOS_logout_methods %}
Following methods are provided for logout

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
@IBAction func logout(sender: UIButton) {
  PresenceSDK.getPresenceSDK().logOut()
}
{% endhighlight %}

## Check Login Status

Presence SDK also provides some helper methods for checking if user is logged into any of the supported services.

{% highlight swift %}
// Method to check if user is logged in any of the services i.e Host or Accounts Manager.
PresenceSDK.getPresenceSDK().isLoggedIn()

// Method to check if user is logged in Host.
PresenceSDK.getPresenceSDK().isLoggedIntoHost()

// Method to check if user is logged in Accounts Manager.
PresenceSDK.getPresenceSDK().isLoggedIntoTeam()
{% endhighlight %}
{% endcapture %}

{% capture Android_logout_methods %}
You can implement log out functionality on your UI with by calling these API :

{% highlight java %}
// TM logout
PresenceSDK.getPresenceSDK(context).logOutHost();
// Team logout 
PresenceSDK.getPresenceSDK(context).logOutTeam();
// logout both
PresenceSDK.getPresenceSDK(context).logOut();
{% endhighlight %}

## Check Login Status

Presence SDK also provides some helper methods for checking if user is logged into any of the supported services.

{% highlight java %}
// Method to check if user is logged in any of the service  i.e Host or Accounts 	Manger
PresenceSDK.getPresenceSDK(context).isLoggedIn();
// Method to check if user is logged in Host
PresenceSDK.getPresenceSDK(context).isLoggedIntoHost();
// Method to check if user is logged in Accounts Manager
PresenceSDK.getPresenceSDK(context).isLoggedIntoTeam();
{% endhighlight%}

{% endcapture %}

{% capture iOS_global_methods %}
{% highlight swift %}
  // This method returns version number of the SDK as a String.
  func getVersionNumber()
{% endhighlight %}
{% endcapture %}

{% capture Android_global_methods %}
{% highlight java %}
  // This method returns version number of the SDK as a String.
  public String getVersionNumber()
{% endhighlight %}
{% endcapture %}

{% capture iOS_analytics %}
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

## Analytics Usage

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
{% endcapture %}

{% capture Android_analytics %}
For tracking user activity in the Presence SDK a separate class PresenceEventAnalytics is provided that lists all the user actions that are notified via local broadcast manager notifications together with the payload data.

Notification Events – You can observe these notifications to receive udpates from Presence SDK.

{% highlight java %}
public static final class Action {

  /////////////////////////////////////////////////////////////////////////////////////////
  // UI events (Start)
  /////////////////////////////////////////////////////////////////////////////////////////
  public static final String ACTION_MYTICKETSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.MYTICKETSCREENSHOWED";
  public static final String ACTION_MANAGETICKETSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.MANAGETICKETSCREENSHOWED";
  public static final String ACTION_ADDPAYMENTINFOSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.ADDPAYMENTINFOSCREENSHOWED";
  public static final String ACTION_REVIEWPOSTINGSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.REVIEWPOSTINGSCREENSHOWED";
  public static final String ACTION_POSTINGCONFIRMATIONSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.POSTINGCONFIRMATIONSCREENSHOWED";
  public static final String ACTION_CANCELPOSTINGSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.CANCELPOSTINGSCREENSHOWED";
  public static final String ACTION_CANCELPOSTINGCONFIRMSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.CANCELPOSTINGCONFIRMSCREENSHOWED";
  public static final String ACTION_MYTICKETBARCODESCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.MYTICKETBARCODESCREENSHOWED";
  public static final String ACTION_TICKETDETAILSSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.TICKETDETAILSSCREENSHOWED";
  public static final String ACTION_TICKETSTUBIMAGESHARED = "com.ticketmaster.presencesdk.eventanalytic.action.TICKETSTUBIMAGESHARED";

  /////////////////////////////////////////////////////////////////////////////////////////
  // UI events (End)
  /////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////
  // Business operation events (Start)
  /////////////////////////////////////////////////////////////////////////////////////////
  public static final String ACTION_TRANSFERINITIATED = "com.ticketmaster.presencesdk.eventanalytic.action.TRANSFERINITIATED";
  public static final String ACTION_TRANSFERCANCELLED = "com.ticketmaster.presencesdk.eventanalytic.action.TRANSFERCANCELLED";
  public static final String ACTION_TRANSFERACCEPTED = "com.ticketmaster.presencesdk.eventanalytic.action.TRANSFERACCEPTED";
  public static final String ACTION_RESALEINITIATED = "com.ticketmaster.presencesdk.eventanalytic.action.RESALEINITIATED";
  public static final String ACTION_RESALECANCELLED = "com.ticketmaster.presencesdk.eventanalytic.action.RESALECANCELLED";
  public static final String ACTION_RESALEUPDATED = "com.ticketmaster.presencesdk.eventanalytic.action.RESALEEDITED";
  /////////////////////////////////////////////////////////////////////////////////////////
  // Business operation events (End)
  /////////////////////////////////////////////////////////////////////////////////////////
}
{% endhighlight %}

Payload Data for the Notifications – Only relevant information is sent out with the notification.

{% highlight java %}
public static final class Data {

  // general data for event details, and ticket details
  public static final String EVENT_ID = "event_id";
  public static final String EVENT_NAME = "event_name";
  public static final String EVENT_DATE = "event_date";
  public static final String EVENT_IMAGE_URL = "event_image_url";
  public static final String EVENT_ORDER_ID = "event_order_id";
  public static final String VENUE_NAME = "venue_name";
  public static final String VENUE_ID = "venu_id";
  public static final String CURRENT_TICKET_COUNT = "current_ticket_count";
  public static final String EVENT_ARTIST_NAME = "artist_name";
  public static final String EVENT_ARTIST_ID = "artist_id";

  // data for transfer initiate event
  public static final String INITIATE_TRANSFER_TICKET_COUNT = "initiate_transfer_ticket_count";
  public static final String INITIATE_TRANSFER_TICKET_FACEVALUE = "initiate_transfer_ticket_facevalue";
  public static final String INITIATE_TRANSFER_TICKET_SERIALIZABLE = "initiate_transfer_ticket_serializable";

  // data for transfer cancel event
  public static final String CANCEL_TRANSFER_ID = "cancel_transfer_id";
  public static final String CANCEL_TRANSFER_ORDER_ID = "cancel_transfer_order_id";


  // data for resale initiate event
  public static final String INITIATE_RESALE_TICKET_COUNT = "initiate_resale_ticket_count";
  public static final String INITIATE_RESALE_PRICE = "initiate_resale_price";
  public static final String INITIATE_RESALE_TICKET_SERIALIZABLE = "initiate_resale_ticket_serializable";

  // data for resale update event
  public static final String UPDATE_RESALE_PRICE = "update_resale_price";
  public static final String UPDATE_RESALE_POSTING_ID = "update_resale_posting_id";

  // data for resale initiate and update events
  public static final String RESALE_BUYER_FEES = "resale_buyer_fees";
  public static final String RESALE_ORIGINAL_FACE_VALUE = "resale_original_face_value";
  public static final String RESALE_SELLER_PAYOUT = "resale_seller_payout";
  public static final String RESALE_SELLER_FEES = "resale_seller_fees";

  // data for resale cancel event
  public static final String CANCEL_RESALE_POSTING_ID = "cancel_resale_posting_id";

  //data for sharing image
  public static final String SHARE_TICKET_IMAGE_DIR = "share_ticket_image_path";
  public static final String SHARE_TICKET_IMAGE_FILENAME = "share_ticket_image_filename";
  public static final String SHARE_TICKET_EVENT_ID = "share_ticket_event_id";
  public static final String SHARE_TICKET_EVENT_NAME = "share_ticket_event_name";
}
{% endhighlight %}

## Analytics Usage

If you want to track ACTION_MANAGETICKETSCREENSHOWED event, you should register a local broadcast listener as below:

{% highlight java %}
IntentFilter analyticEventFilter = new IntentFilter();
analyticEventFilter.addAction(PresenceEventAnalytics.Action.ACTION_MYTICKETSCREENSHOWED);
LocalBroadcastManager.getInstance(MainActivity.this).registerReceiver(mAnalyticEventReceiver, analyticEventFilter);
{% endhighlight %}

You can implement receiver mAnalyticsEventReceiver as follows:

{% highlight java %}
private BroadcastReceiver mAnalyticEventReceiver = new BroadcastReceiver() {
  @Override
  public void onReceive(Context context, Intent intent) {

    if (PresenceEventAnalytics.Action.ACTION_MYTICKETSCREENSHOWED.equals(intent.getAction())) {
      Toast.makeText(MainActivity.this, "Analytic Event: My tickets screen showed.", Toast.LENGTH_LONG).show();
    }
  }
};
{% endhighlight %}
{% endcapture %}

{% capture iOS_release %}
PresenceSDK is packaged as a Universal binary and it contains binary packages for all valid architectures including ARMv* and x86. This is great for development as you can run your app on both devices and simulators but for App Store submission you need to strip the simulator packages from your App. To do this we have provided “strip_frameworks.sh” file, just add this file to the Run Script phase under your app’s Build Phases settings and it will do the work for you. Here is a screenshot of what your Build phases will look like after adding this file:

![PresenceSDK iOS Step 5 result](/assets/img/products-and-docs/PresenceSDK-iOS-Store-Submission.png)
{% endcapture %}

{% capture Android_release %}
No additional actions required.
{% endcapture %}

{% capture iOS_whatyouneed %}

To integrate the Presence SDK in your application, you will need PresenceSDK.framework

## Release Notes Version 1.3.1

To integrate the Presence SDK in your application, you will need PresenceSDK.framework and iOSExperienceSDK.framework.

### Requirements for using Swift 4 build

- To build, you must use XCode 9.0 and the iOS 11.0 SDK
- Minimum iOS 9.0, supported through iOS 11

### Requirements for using Swift 3.1 build

- To build, you must use XCode 8.3.3 and the iOS 10.3 SDK
- Minimum iOS 9.0, supported through iOS 10.3.3

### What’s New?

-	Experience SDK Integration.
-	Improved Login Screen for the SDK.
-	Support for iPhone X screen size.
-	Added refresh button for fans with no tickets
-	Added support for honoring custom tint color for navigation bar configured via UIAppearance.
-	Bug fixes for adding Mastercard as refund card and other UI issues.


{% endcapture %}

{% capture Android_whatyouneed %}

To integrate Presence sdk in your application, you will need the following aar file:

-	PresenceSDK-release-1.3.*.*.aar

Supported API levels

-	API level 16 ~ 25

## Release Notes Version 1.3.1

### Requirements

-	Supported API level 16 ~ 25

### What’s New?

- Experience sdk integration
- Android wallet support
- Main login entry screen change
- Fixed potential resource naming collision issue with client projects. All presence sdk resources are named with “presence_sdk_” prefix.
- Bug fixes for master card and branding coloring support for action bar

{% endcapture %}


{% capture iOS_changelog %}
### Changes (11/21/17 Release 1.3.1)
- Fixed experience sdk integration issues.
- Fixed crash while adding a credit card for Host.

### Changes (11/6/17 Release 1.3.0)
- Experience SDK Integration.
- Improved Login Screen for the SDK.
- Support for iPhone X screen size.
- Added refresh button for fans with no tickets
- Added support for honoring custom tint color for navigation bar configured via UIAppearance.
- Bug fixes for adding Mastercard as refund card and other UI issues.


### Changes (10/16/17 Release 1.2.0)

-	Added support for entering verification code for linking TMR account for Archtics.
-	Fixed seat description selection for posting flow for Archtics.
-	Separated the login flow from main SDK so it can just be used for login and fetching valid access token. 

### Changes (10/5/17 Release 1.1.1)

-	Added support for choosing between different payout methods during Resale flow for Archtics.

### Changes (09/29/17 Release 1.1.0)

-	Added support for Apigee and made integration with SDK much simpler.
-	Added support for seat selection in Transfer and Resale flow.
-	Added support for pre-fetching Apple Wallet Passes
-	Added 3 new helper methods for checking login status
-	Fixed few minor issues in the SDK

### Changes (09/15/17 Release 1.0.8)

-	Switched to XCode 9 and Swift 4.

### Changes (09/13/17 Release 1.0.7)

-	Fixed couple of issues related to accepting terms of use if user has not accepted it yet.
-	Cancel Transfer option is immediately available after initiating a transfer.
-	Scan Barcode option is immediately available after canceling transfer if barcode is available.
-	Added a configuration parameter in the SDK to select new accounts manager flow for resetting password and creating account on main login screen.
-	Added SDK version number on the main login screen.

### Changes (09/5/17 Release 1.0.6)

-	Fixed the issue related to not able to post multiple tickets for resale at the same time.
-	Removed ticket price information from the Ticket Details View since that information is not provided.
-	Fixed an issue related to ‘Cancel’ button not appearing on Login screen in some cases.
-	Fixed an issue related to automatic scrolling to ticket card which has been successfully posted for resale.
-	Fixed the appearance of login button on Events List View when the current logged in account does not have any tickets.

### Changes (08/24/17 Release 1.0.5)

-	Updated the main login screen and added a button for user to create new account or reset password.
-	Fixed a bug related to SDK hanging during the login flow.

### Changes (08/22/17 Release 1.0.4)

-	Added some safety checks to avoid some crashes during Login flow.
-	Handled case for events that don’t have date and have TBD or some date override text.

### Changes (08/18/17 Release 1.0.3)

-	Fixed issue related to grouping of ticket card when multiple tickets are transferred together.
-	Fixed another issue related to missing tickets from Transfer Group Selection View.

### Changes (08/17/17 Release 1.0.2)

-	Fixed issue related to missing tickets from Transfer Group Selection View.

### Changes (08/11/17 Release 1.0.1)

-	Added support to Add to Apple Wallet for ticket passes.
-	Added support for html tags in Accept Terms of Use screen.
-	Fixed couple of bugs while Adding and Editing deposit account.
-	Fixed issue related to handling of “Session Expired” error.
{% endcapture %}

{% capture Android_changelog %}

### Changes (11/21/2017 Release 1.3.1)
- Fixed experience sdk integration issues.
- Fixed experience button menu missing after second time the ticket view is visited.

### Changes (11/06/2017 Release 1.3.0)
- Experience sdk integration
- Android wallet support
- Main login entry screen change
- Fixed potential resource naming collision issue with client projects. All presence sdk resources are named with “presence_sdk_” prefix.
- Bug fixes for master card and branding coloring support for action bar


### Changes (10/16/2017 Release 1.2.0)

- Added support for entering verification code for linking TMR account for
- Fixed seat description selection for posting flow for Archtics
- Fixed intermittent logout issue
- Separated the login flow from main SDK so it can just be used for login and fetching valid access token.
- Fixed other in-field issues

### Changes (10/05/2017 Release 1.1.1)

-	Added support for choosing between different payout methods during Resale flow for Archtics.

### Changes (09/29/2017 Release 1.1.0)

-	Added support for Apigee and made integration with SDK much simpler.
-	Added support for seat selection in Transfer and Resale flow.
-	Added 3 new helper methods for checking login status
-	Fixed few minor issues in the SDK.

### Changes (09/13/2017 Release 1.0.0)

-	Resolved login issue of getting stuck in log-in screen after logging in and clicking“authorize” button.
-	Resolved login issue of getting 401 status when clicking on an event
-	Handled session expiry error
-	Fixed crashlytics crashes
-	Fixed crash due to multiple loading of TmxMainView
-	Fixed missing seats at group selection view in transfer/resale flow
-	Fixed in-field crash/issues
-	Fixed edit resale operation with 4 digit price
-	Added forgot password on log-in UI (08/24/2017)
-	Fixed duplicate ticket card in listing pending state (09/05/2017)
-	Added price breakdown in ticket details (09/05/2017)
-	Supported upsell items (09/05/2017)
-	Fixed payment account delete operation failure in concurrent log-in scenario (09/05/2017)
-	Restored barcode immediately after resale/transfer cancel (09/12/2017)
-	Fix to automatically refresh the event list view once user logs in to second server (09/12/2017)
-	Bundle and unbundle multi tickets resale or transfer operations (09/12/2017)
-	Added support for password recovery for teams still on old account manager (09/13/2017)

{% endcapture %}

{% capture iOS_sdk %}
[Download](/products-and-docs/sdks/presence/ios/PresenceSDK+ExperienceSDK - Version 1_3_1.zip) Presence SDK iOS - Swift 4.

[Download](/products-and-docs/sdks/presence/ios/PresenceSDK+ExperienceSDK-Swift3.1 - Version 1_3_1.zip) Presence SDK iOS - Swift 3.1.
{% endcapture %}

{% capture Android_sdk %}
[Download](/products-and-docs/sdks/presence/android/Android Presence SDK - Version 1_3_1 .zip)  Presence SDK Android.
{% endcapture %}

{: .article}
# Presence SDK 

The Ticketmaster Presence SDK provides a simple way to add Ticketmaster features in your 3rd party iOS and Android apps
{: .lead .article}

## What You Need
{: .article }

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#whatyouneed-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#whatyouneed-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="whatyouneed-ios">
					{{ iOS_whatyouneed | markdownify }}          
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="whatyouneed-android">
					{{ Android_whatyouneed | markdownify }}
        </div>

    </div>
</form>
</div>

## Importing the SDK
{: .article }

Follow these simple steps to integrate and configure the SDK.

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#importing-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#importing-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="importing-ios">
					{{ iOS_importing | markdownify }}          
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="importing-android">
					{{ Android_importing | markdownify }}
        </div>

    </div>
</form>
</div>

## Setting up the views
{: .article }

Now that we've imported the SDK into your project we can set up the views to display the UI

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#views-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#views-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="views-ios">
          {{ iOS_set_view | markdownify }}
        </div>

        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="views-android">
          {{ Android_set_view | markdownify }}
        </div>

    </div>
</form>
</div>

## Specifying a branding color
{: .article }

Now that the SDK is initalized you can add some flair by specifying your team color to change the look of the SDK throughout

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#color-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#color-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="color-ios">
						{{ iOS_branding_color | markdownify }}
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="color-android">
            {{ Android_branding_color | markdownify }}
        </div>

    </div>
</form>
</div>

## Logout Methods
{: .article }

You've got logging in all set up, now you can set up logging out

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#logout-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#logout-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="logout-ios">
            {{ iOS_logout_methods | markdownify }}
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="logout-android">
            {{ Android_logout_methods | markdownify }}
        </div>

    </div>
</form>
</div>

## Global Methods
{: .article }

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#global-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#global-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="global-ios">
            {{ iOS_global_methods | markdownify }}
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="global-android">
            {{ Android_global_methods | markdownify }}
        </div>

    </div>
</form>
</div>

## Analytics
{: .article }

Presence SDK provides support for tracking user activity via its Analytics module.
<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#analytics-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#analytics-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="analytics-ios">
        	{{ iOS_analytics | markdownify }}
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="analytics-android">
        	{{ Android_analytics | markdownify }}
        </div>

    </div>
</form>
</div>

## Release
{: .article }

Following section describes the steps you need to follow to prepare your app for Apple or Google Store.
<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#release-ios" data-toggle="tab" aria-expanded="true">Apple Store</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#release-android" data-toggle="tab" aria-expanded="false">Google Store</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="release-ios">
        		{{ iOS_release | markdownify }}
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="release-android">
						{{ Android_release | markdownify }}
        </div>

    </div>
</form>
</div>

## Change log
{: .article }

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#changelog-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#changelog-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="changelog-ios">
					{{ iOS_changelog | markdownify }}          
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="changelog-android">
					{{ Android_changelog | markdownify }}
        </div>

    </div>
</form>
</div>

## SDK
{: .article }

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#sdk-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#sdk-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="sdk-ios">
					{{ iOS_sdk | markdownify }}          
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="sdk-android">
					{{ Android_sdk | markdownify }}
        </div>

    </div>
</form>
</div>

<script>
  (function(){
      $(document).ready(function(){
        $('.nav.nav-tabs').on('click', 'li', function(e) {
            var tabIndex = $(this).index();
            var scrollTop = $(this).offset().top;
            $('.nav.nav-tabs li').removeClass('active');
            $('.tab-pane.fade.active.in').removeClass('active in');
            $('.nav.nav-tabs').each(function(i){
            $('.nav.nav-tabs').eq(i).find('li').eq(tabIndex).addClass('active');
            $('.nav.nav-tabs').eq(i).next().children('.tab-pane').eq(tabIndex).addClass('active in');
          });
        });
      });
   }());
</script>


