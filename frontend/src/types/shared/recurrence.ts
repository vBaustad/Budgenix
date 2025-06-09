export const RecurrenceFrequencyOptions = [
    { value: 'None', label: 'Not Recurring' },
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'BiWeekly', label: 'Bi-Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Yearly', label: 'Yearly' },
  ] as const;
  
  export const RecurrenceFrequencyLabels: Record<string, string> = {
    None: 'Not Recurring',
    Daily: 'Daily',
    Weekly: 'Weekly',
    BiWeekly: 'Bi-Weekly',
    Monthly: 'Monthly',
    Quarterly: 'Quarterly',
    Yearly: 'Yearly',
  };
  
  export type RecurrenceFrequency = typeof RecurrenceFrequencyOptions[number]['value'];
  