import requests
import time
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

TOKEN = '8231921033:AAE41G7Fz1yhbtPKp1OecYNMc3uNmQA7Qx8'
API_URL = f"https://api.telegram.org/bot{TOKEN}/getUpdates"
LOCAL_WEBHOOK_URL = "http://127.0.0.1:8000/api/telegram/webhook/"

def delete_webhook():
    logger.info("Deleting Active Webhooks so we can poll locally...")
    try:
        requests.get(f"https://api.telegram.org/bot{TOKEN}/deleteWebhook", timeout=10)
    except Exception as e:
        logger.error(f"Error deleting webhook: {e}")

def poll_updates():
    offset = None
    logger.info(f"Listening for Telegram messages locally... Send /start to @MedicoD1_Bot")
    while True:
        try:
            params = {'timeout': 10, 'offset': offset}
            logger.debug(f"Calling getUpdates with offset={offset}")
            resp = requests.get(API_URL, params=params, timeout=15)
            
            if not resp.ok:
                logger.error(f"Error from Telegram: {resp.text}")
                time.sleep(2)
                continue
                
            data = resp.json()
            if not data.get('ok'):
                logger.error(f"Bad response: {data}")
                time.sleep(2)
                continue
            
            updates = data.get('result', [])
            if updates:
                logger.info(f"Found {len(updates)} new updates.")
            
            for update in updates:
                # Forward the exact JSON to our Local Django Webhook
                chat_id = update.get('message', {}).get('chat', {}).get('id')
                logger.info(f"Received interaction from Chat ID: {chat_id}")
                try:
                    res = requests.post(LOCAL_WEBHOOK_URL, json=update, timeout=10)
                    logger.info(f"Forwarded update_id {update['update_id']} to Django, Response: {res.status_code}")
                except requests.exceptions.ConnectionError:
                    logger.error("ERROR: Django server is NOT responding on port 8000. Retrying in 5s...")
                    time.sleep(5)
                    continue
                except Exception as e:
                    logger.error(f"Forwarding error: {e}")
                
                # Acknowledge the update
                offset = update['update_id'] + 1
                logger.info(f"Updating offset to {offset}")
                
        except Exception as e:
            logger.error(f"Polling error: {e}")
            time.sleep(2)

if __name__ == '__main__':
    delete_webhook()
    poll_updates()
