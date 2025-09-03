export const getDayOfWeek = (): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const options = { timeZone: 'Asia/Kolkata', weekday: 'long' } as const;
    const dayInIST = new Intl.DateTimeFormat('en-US', options).format(today);
    return dayInIST;
  };
  
  export const getCurrentTime = (): string => {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false } as const;
    const timeInIST = new Intl.DateTimeFormat('en-US', options).format(now);
    return timeInIST;
  };
  