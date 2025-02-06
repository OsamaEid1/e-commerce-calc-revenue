export const savePreferences = (key, preferences) => {
    if (typeof preferences === 'object') {
        localStorage.setItem(key, JSON.stringify(preferences));
        alert("لقد تم حفظ اختياراتك بنجاح ✅");
    } else alert('لقد حدث خطأ ما، حاول لاحقاً !');
};

export const getSavedPreferences = (key) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
        try {
            return JSON.parse(storedValue);
        } catch (error) {
            console.error('Error parsing stored Preferences', error);
            return null;
        }
    } else {
        console.warn(`No value found for key: ${key}`);
        return null;
    }
};
