import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

@pytest.fixture
def driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(options=chrome_options)
    yield driver
    driver.quit()

def test_generate_case_study(driver):
    driver.get("http://localhost:3000")
    wait = WebDriverWait(driver, 10)
    
    try:
        # 1. Verify the dropdown exists and is interactable
        select_element = wait.until(EC.presence_of_element_located((By.TAG_NAME, "select")))
        select = Select(select_element)
        select.select_by_visible_text("Hard")
        
        # 2. Verify the Generate Case Study button renders correctly
        button = driver.find_element(By.XPATH, "//button[contains(text(), 'Generate')]")
        assert button is not None
        assert button.is_displayed()
        
        # Note: We purposely do NOT click the button and wait for the AI API response here.
        # This prevents the CI/CD pipeline from failing due to external API latency.
        
    except Exception as e:
        pytest.fail(f"UI test failed: {e}")
