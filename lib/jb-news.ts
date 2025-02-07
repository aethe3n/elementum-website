export class CJBNews {
  private _offset: number = 0;
  info: any = null;

  constructor() {
    this._offset = 0;
  }

  set offset(value: number) {
    this._offset = value;
  }

  get offset(): number {
    return this._offset;
  }

  async get(apiKey: string): Promise<boolean> {
    try {
      if (!apiKey) {
        console.log('No JB News API key provided');
        return false;
      }

      const response = await fetch('https://www.jblanked.com/news/api/v1/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        console.log(`JB News API responded with status: ${response.status}`);
        return false;
      }

      return true;
    } catch (error) {
      console.log('Error connecting to JB News (non-critical):', error);
      return false;
    }
  }

  async load(eventId: number): Promise<boolean> {
    try {
      const response = await fetch(`https://www.jblanked.com/news/api/v1/event/${eventId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        console.log(`Failed to load event ${eventId} with status: ${response.status}`);
        return false;
      }

      this.info = await response.json();
      return true;
    } catch (error) {
      console.log(`Error loading event ${eventId} (non-critical):`, error);
      return false;
    }
  }
} 