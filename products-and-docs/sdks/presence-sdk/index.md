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
{: .article}
# Presence SDK 

The Ticketmaster Presence SDK provides a simple way to add Ticketmaster features in your 3rd party iOS and Android apps
{: .lead .article}

## Importing the SDK
{: .article }

Let's start by importing the SDK into your mobile app project

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

          <ul>
              <li>To integrate the Presence SDK into your iOS application you will need the <strong>PresenceSDK.framework</strong> file</li>
          </ul>

          <ul>
            <li>Drag and drop the framework file into your project’s <strong>General -> Embedded Binaries</strong> pane</li>
          </ul>

          <img src="/assets/img/products-and-docs/PresenceSDK-iOS-Step-1.png" alt="iOS Step 1" height="768" width="1152">

        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="importing-android">

          <ul>
              <li>To integrate the Presence SDK into your Android application you will need the <strong>PresenceSDK-{version number}.aar</strong> file</li>
          </ul>

          <ul>
              <li>Import the Presence SDK by getting to the "Create New Module" menu in Android Studio <strong>File -> New -> New Module -> Import .JAR / .AAR package</strong></li>
          </ul>

          <img src="/assets/img/products-and-docs/PresenceSDK-Android-Step-1.png" alt="Android Step 1" height="892" width="1152">

          <ul>
              <li>After selecting <strong>Import .JAR / .AAR package</strong> specify the path to your Presence SDK aar file</li>
          </ul>

          <img src="/assets/img/products-and-docs/PresenceSDK-Android-Step-1-2.png" alt="Android Step 1.2" height="892" width="1152">

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
          <ul>
              <li>Drag and drop a UIView from the Object Library in the Utility panel inside your UIViewController, then change the class to PresenceSDKView and Module to PresenceSDK</li>
              <li>Position and size the view as desired before moving on</li>
          </ul>

          <img src="/assets/img/products-and-docs/PresenceSDK-iOS-Step-2.png" alt="iOS Step 2" height="702" width="1152">
        </div>

        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="views-android">
          <ul>
            <li>Specify a layout view in your desired layout file, for now this layout should fill the whole screen</li>
            <li>The ID for this layout will be referenced in the next step</li>
          </ul>

        <figure class="highlight"><pre><code class="language-xml" data-lang="xml"><span>&lt;</span><span class="nt">android.support.constraint.ConstraintLayout</span>
    <span class="nt">android</span><span style="color: blue">:id=</span><span class="nc">"@+id/presenceSDKView"</span>
    <span class="nt">android</span><span style="color: blue">:layout_width=</span><span class="nc">"0dp"</span>
    <span class="nt">android</span><span style="color: blue">:layout_height=</span><span class="nc">"0dp"</span>
    <span class="nt">android</span><span style="color: blue">:layout_marginBottom=</span><span class="nc">"0dp"</span>
    <span class="nt">android</span><span style="color: blue">:layout_marginEnd=</span><span class="nc">"0dp"</span>
    <span class="nt">android</span><span style="color: blue">:layout_marginStart=</span><span class="nc">"0dp"</span>
    <span class="nt">android</span><span style="color: blue">:layout_marginTop=</span><span class="nc">"0dp"</span>
    <span class="nt">app</span><span style="color: blue">:layout_constraintBottom_toBottomOf=</span><span class="nc">"parent"</span>
    <span class="nt">app</span><span style="color: blue">:layout_constraintEnd_toEndOf=</span><span class="nc">"parent"</span>
    <span class="nt">app</span><span style="color: blue">:layout_constraintStart_toStartOf=</span><span class="nc">"parent"</span>
    <span class="nt">app</span><span style="color: blue">:layout_constraintTop_toTopOf=</span><span class="nc">"parent"</span><span>/&gt;</span></code></pre></figure>
        </div>

    </div>
</form>
</div>

## Initializing the SDK
{: .article }

Now that we've imported the SDK into your project we can start to get it initalized

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#initializing-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#initializing-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="initializing-ios">
        <ul>
           <li>First configure the SDK with your Ticketmaster credentials, this is best done in your AppDelegate class inside applicationDidFinishLaunchingWithOptions() function</li>
         </ul>

         <figure class="highlight"><pre><code class="language-swift" data-lang="swift"><span style="color: blue">func </span><span>application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {</span>

    <span>// Override point for customization after application launch.</span>

    <span style="color: blue">let </span><span>presenceSDK = </span><span class="nb">PresenceSDK</span><span>.</span><span class="nb">getPresenceSDK</span><span>()</span>
    <span>presenceSDK.</span><span class="nb">setConfig</span><span>(consumerKey: </span><span class="nb">CONSUMER_KEY_FROM_DEVELOPER_PORTAL</span><span>, 
                        displayName: </span><span class="nb">YOUR_SPORTS_TEAM_NAME</span><span>)</span>
    
<span>}</span></code></pre></figure>


         <ul>
           <li>Next go to your applications view controller file and import the Presence SDK</li>
         </ul>

         <figure class="highlight"><pre><code class="language-swift" data-lang="swift"><span style="color: blue">import </span><span>PresenceSDK</span></code></pre></figure>

         <ul>
           <li>Now we can make the view controller extend our login delegate, this will give you callback functions to help you with the login process</li>
         </ul>

         <figure class="highlight"><pre><code class="language-swift" data-lang="swift"><span style="color: blue">class </span><span>ViewController: </span><span class="nb">UIViewController</span><span>, </span><span class="nb">PresenceLoginDelegate </span><span>{</span>
    <span style="color: blue">func </span><span>onLoginSuccessful(</span><span style="color: blue">_ </span><span>succeeded:</span><span class="nb">Bool</span><span>, error:</span><span class="nb">NSError</span><span>?)</span>
    <span style="color: blue">func </span><span>onLoginCancelled()</span>
    <span style="color: blue">func </span><span>onMemberUpdated(</span><span style="color: blue">_ </span><span>member:</span><span class="nb">PresenceMember</span><span>?)</span>
<span>}</span></code></pre></figure>

         <ul>
           <li>Now we can create outlet view that we established in the previous step</li>
         </ul>

         <figure class="highlight"><pre><code class="language-swift" data-lang="swift"><span style="color: blue">@IBOutlet weak var </span><span>presenceSDKView: </span><span class="nb">PresenceSDKView</span><span>? = </span><span style="color: blue">nil</span></code></pre></figure>

        <ul>
        <li>Next we'll start the SDK and this is best done in the viewDidLoad function of you </li>
        </ul>

    <figure class="highlight"><pre><code class="language-swift" data-lang="swift"><span style="color: blue">override func </span><span>viewDidLoad() {</span>
    <span style="color: blue">super.</span><span class="nb">viewDidLoad()</span>
        
    <span style="color: blue">let </span><span>presenceSDK = </span><span class="nb">PresenceSDK</span><span>.</span><span class="nb">getPresenceSDK</span><span>()</span>
    <span>presenceSDK.</span><span class="nb">start</span><span>(presenceSDKView: </span><span class="nb">presenceSDKView</span><span>, loginDelegate: </span><span style="color: blue">self</span><span>)</span>
<span>}</span></code></pre></figure>
    </div>

        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="initializing-android">
            <ul>
              <li>Go to the onCreate method of the activity file you'd like to use to manage your Presence SDK instance</li>
              <li>This activity needs to extend AppCompatActivity</li>
            </ul>

             <figure class="highlight"><pre><code class="language-java" data-lang="java"><span class="nb">PresenceSDK</span> presenceSDK = <span class="nb">PresenceSDK</span><span>.</span><span class="nb">getPresenceSDK</span><span>(</span><span style="color: blue">this</span><span>);</span></code></pre></figure>

         <ul>
           <li>Next we'll configure the SDK with your Ticketmaster credentials, this is best done in the viewDidLoad function of your view controller</li>
         </ul>

         <figure class="highlight"><pre><code class="language-java" data-lang="java"><span>presenceSDK.</span><span class="nb">setConfig</span><span>(consumerKey: </span><span class="nb">CONSUMER_KEY_FROM_DEVELOPER_PORTAL</span><span>, 
                        displayName: </span><span class="nb">YOUR_SPORTS_TEAM_NAME</span><span>)</span></code></pre></figure>  

         <ul>
           <li>Now we can start the SDK using the AppCompatActivity and the ID of the layout from the previous step and the </li>
         </ul>



          <figure class="highlight"><pre><code class="language-java" data-lang="java"><span>presenceSDK.start(</span><span style="color: blue">this</span><span>, R.id.</span><span style="color: blue">presenceSDK</span><span>, </span><span style="color: blue">new </span><span>TMLoginListener() {</span>
    <span class="nb">@Override</span>
    <span style="color: blue">public void </span><span>onLoginSuccessful(TMLoginApi.BackendName backendName, String accessToken) {
        //Handle successful login     
    }</span>
    <span class="nb">@Override</span>
    <span style="color: blue">public void </span><span>onLoginFailed(TMLoginApi.BackendName backendName, String errorMessage) {
        //Handle failed login     
    }</span>
    <span class="nb">@Override</span>
    <span style="color: blue">public void </span><span>onLoginCancelled(TMLoginApi.BackendName backendName) {
        //Handle cancelled login     
    }</span>
    <span class="nb">@Override</span>
    <span style="color: blue">public void </span><span>onLoginMethodUsed(TMLoginApi.BackendName backendName, TMLoginApi.LoginMethod method) {
        //See the method that was used for login
    }</span>
     <span class="nb">@Override</span>
    <span style="color: blue">public void </span><span>onLoginForgotPasswordClicked(TMLoginApi.BackendName backendName) {
        //Handle forgot password clicked
    }
});</span></code></pre></figure>
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
            <ul>
              <li>Configure your branding color with a UIColor object</li>
            </ul>

             <figure class="highlight"><pre><code class="language-xml" data-lang="xml"><span>presenceSDK.</span><span class="nb">setBrandingColor</span><span>(color: </span><span class="nb">UIColor.blue</span><span>)</span></code></pre></figure>
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="color-android">
            <ul>
              <li>Configure your branding color by defining it in your <strong>colors.xml</strong> file</li>
            </ul>

            <figure class="highlight"><pre><code class="language-xml" data-lang="xml"><span>&lt;</span><span class="nt">color</span><span style="color: blue"> name=</span><span class="nb">"tmx_color_branding"</span><span>&gt;#FFAA81&lt;/</span><span class="nt">color&gt;</span></code></pre></figure>
        </div>

    </div>
</form>
</div>

## Logging out
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
            <ul>
              <li>We provide a few functions for helping you log out</li>
            </ul>

             <figure class="highlight"><pre><code class="language-xml" data-lang="xml"><span>//Logs out both Host and Archtics
presenceSDK.</span><span class="nb">logOut</span><span>()</span><span>
//Logs out Host
presenceSDK.</span><span class="nb">logOutHost</span><span>()</span><span>
//Logs out Archtics
presenceSDK.</span><span class="nb">logOutTeam</span><span>()</span></code></pre></figure>
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="logout-android">
            <ul>
              <li>We provide a few functions for helping you log out</li>
            </ul>

             <figure class="highlight"><pre><code class="language-xml" data-lang="xml"><span>//Logs out both Host and Archtics
presenceSDK.</span><span class="nb">logOut</span><span>()</span><span>
//Logs out Host
presenceSDK.</span><span class="nb">logOutHost</span><span>()</span><span>
//Logs out Archtics
presenceSDK.</span><span class="nb">logOutTeam</span><span>()</span></code></pre></figure>
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
            <ul>
              <li>Here is how you can receive notification when user clicks on a specfic event to view tickets.</li>
            </ul>

             <figure class="highlight"><pre><code class="language-swift" data-lang="swift"><span style="color: blue">override func </span><span>viewDidLoad() {</span>
    <span style="color: blue">super.</span><span class="nb">viewDidLoad()</span>
        
    <span style="color: blue">let </span><span>presenceSDK = </span><span class="nb">PresenceSDK</span><span>.</span><span class="nb">getPresenceSDK</span><span>()</span>
    <span>presenceSDK.</span><span class="nb">start</span><span>(presenceSDKView: </span><span class="nb">presenceSDKView</span><span>, loginDelegate: </span><span style="color: blue">self</span><span>)</span>

    //Add obbserver for ticket screen.
    <span>NotificationCenter.default.addObserver(self, selector: #selector(self.ticketsScreenShown),
            name: NSNotification.Name(rawValue: <span class="nb">PresenceEventAnalytics.Action.ACTION_MANAGETICKETSCREENSHOWED</span>),
                                        object: nil)</span>
<span>}</span></code></pre></figure>

            <figure class="highlight"><pre><code class="language-swift" data-lang="swift"><span style="color: blue">func </span><span>ticketsScreenShown(_ notification: Notification) {</span>
    <span>let eventId = notification.userInfo?[<span class="nb">PresenceEventAnalytics.Data.EVENT_ID</span>] ?? ""</span>
    <span>let eventName = notification.userInfo?[<span class="nb">PresenceEventAnalytics.Data.EVENT_NAME</span>] ?? ""</span>
    <span>print("Event_Id: \(eventId), Event_Name: \(eventName)")</span>
<span>}</span></code></pre></figure>

    <span>For a complete list of all analytics actions and its corresponding payload data please refer PresenceEventAnalytics class.</span>
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="analytics-android">
            <ul>
              <li>Here is how you can receive notification when user clicks on a specfic event to view tickets.</li>
            </ul>

             <figure class="highlight"><pre><code class="language-swift" data-lang="swift"><span style="color: blue">override func </span><span>viewDidLoad() {</span>
    <span style="color: blue">super.</span><span class="nb">viewDidLoad()</span>
        
    <span style="color: blue">let </span><span>presenceSDK = </span><span class="nb">PresenceSDK</span><span>.</span><span class="nb">getPresenceSDK</span><span>()</span>
    <span>presenceSDK.</span><span class="nb">start</span><span>(presenceSDKView: </span><span class="nb">presenceSDKView</span><span>, loginDelegate: </span><span style="color: blue">self</span><span>)</span>

    //Add obbserver for ticket screen.
    <span>NotificationCenter.default.addObserver(self, selector: #selector(self.ticketsScreenShown),
            name: NSNotification.Name(rawValue: <span class="nb">PresenceEventAnalytics.Action.ACTION_MANAGETICKETSCREENSHOWED</span>),
                                        object: nil)</span>
<span>}</span></code></pre></figure>

            <figure class="highlight"><pre><code class="language-swift" data-lang="swift"><span style="color: blue">func </span><span>ticketsScreenShown(_ notification: Notification) {</span>
    <span>let eventId = notification.userInfo?[<span class="nb">PresenceEventAnalytics.Data.EVENT_ID</span>] ?? ""</span>
    <span>let eventName = notification.userInfo?[<span class="nb">PresenceEventAnalytics.Data.EVENT_NAME</span>] ?? ""</span>
    <span>print("Event_Id: \(eventId), Event_Name: \(eventName)")</span>
<span>}</span></code></pre></figure>

    <span>For a complete list of all analytics actions and its corresponding payload data please refer PresenceEventAnalytics class.</span>
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
            <ul>
              <li>PresenceSDK is packaged as a Universal binary and it contains binary packages for all valid architectures including ARMv* and x86. This is great for development as you can run your app on both devices and simulators but for App Store submission you need to strip the simulator packages from your App. To do this we have provided <span style="color: red">“strip_frameworks.sh”</span> file, just add this file to the Run Script phase under your app’s Build Phases settings and it will do the work for you. Here is a screenshot of what your Build phases will look like after adding this file.</li>
            </ul>

            <img src="/assets/img/products-and-docs/PresenceSDK-iOS-Step-3.png" alt="iOS Step 1" height="666" width="1121">
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="release-android">

        </div>

    </div>
</form>
</div>