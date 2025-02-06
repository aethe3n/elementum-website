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
      const response = await fetch('https://www.jblanked.com/news/api/v1/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to connect to JB News API');
      }

      return true;
    } catch (error) {
      console.error('Error connecting to JB News:', error);
      return false;
    }
  }

  async load(eventId: number): Promise<boolean> {
    try {
      const response = await fetch(`https://www.jblanked.com/news/api/v1/event/${eventId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load event data');
      }

      this.info = await response.json();
      return true;
    } catch (error) {
      console.error('Error loading event:', error);
      return false;
    }
  }
} 