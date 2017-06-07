package com.tkmdpa.taf;

import com.tkmdpa.taf.utils.OsCheck;
import io.github.bonigarcia.wdm.ChromeDriverManager;
import net.serenitybdd.jbehave.SerenityStories;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AcceptanceTestSuite extends SerenityStories {

    private static final Logger LOG = LoggerFactory.getLogger(AcceptanceTestSuite.class.getSimpleName());
    private static final String X64_ARCH = "amd64";
    public static String baseTestedUrl = new SerenityStories().getEnvironmentVariables().getProperty("webdriver.base.url");

    public AcceptanceTestSuite() {
        setDriverAccordingToOS();
        new SerenityStories().getSystemConfiguration().getEnvironmentVariables().setProperty("webdriver.chrome.driver", System.getProperty("webdriver.chrome.driver"));
    }

    private void setDriverAccordingToOS() {
        OsCheck.OSType ostype = OsCheck.getOperatingSystemType();
        switch (ostype) {
            case Windows:
                setChromeDriverWindows();
                break;
            case MacOS:
                setChromeDriverOsx();
                break;
            case Linux:
                if (X64_ARCH.equals(System.getProperty("os.arch"))) {
                    setChromeDriverLinux64();
                } else {
                    setChromeDriverLinux32();
                }
                break;
            case Other:
                LOG.error("Can't define OS");
                break;
        }
    }

    private void setChromeDriverLinux32() {
        ChromeDriverManager.getInstance().arch32().version("2.29").setup();
    }

    private void setChromeDriverLinux64() {
        ChromeDriverManager.getInstance().arch64().version("2.29").setup();
    }

    private void setChromeDriverWindows() {
        ChromeDriverManager.getInstance().setup();
    }

    private void setChromeDriverOsx() {
        ChromeDriverManager.getInstance().setup();
    }

}
