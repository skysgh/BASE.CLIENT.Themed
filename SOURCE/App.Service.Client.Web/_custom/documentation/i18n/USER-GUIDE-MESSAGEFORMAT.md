# MessageFormat i18n - User Guide

**Feature:** Advanced Internationalization with MessageFormat v2  
**Status:** ✅ Active  
**Tier:** Core  
**Complexity:** Intermediate

---

## 🎯 What is MessageFormat?

MessageFormat is an **ICU (International Components for Unicode)** standard that allows translations to adapt to:
- **Gender** (he/she/they)
- **Plurality** (0 items / 1 item / 5 items)
- **Language-specific rules** (Chinese has no plurals, Arabic has 6 plural forms!)

**Without MessageFormat:**
```html
<span>{{ itemCount }} item(s)</span>
```
Result: "5 item(s)" 😢 (awkward!)

**With MessageFormat:**
```html
<span>{{ 'ITEMS_COUNT' | translate:{ count: itemCount } }}</span>
```
Result: "5 items" 😊 (proper grammar!)

---

## 📋 Quick Start

### 1. **In Your Translation Files** (`en.json`, `mi.json`, etc.)

Add MessageFormat syntax:

```json
{
  "BASE": {
    "ITEMS": {
      "COUNT": "{count, plural, =0{No items} one{# item} other{# items}}"
    }
  }
}
```

### 2. **In Your Components**

Use the translation with parameters:

```typescript
// TypeScript
this.translate.get('BASE.ITEMS.COUNT', { count: this.itemCount })
  .subscribe(translated => {
    console.log(translated); // "5 items"
  });
```

```html
<!-- HTML Template -->
<span>{{ 'BASE.ITEMS.COUNT' | translate:{ count: items.length } }}</span>
```

### 3. **Result**

- `count: 0` → "No items"
- `count: 1` → "1 item"
- `count: 5` → "5 items"

**Automatic, proper grammar!** ✨

---

## 🎓 Common Patterns

### **Pattern 1: Simple Plurals**

**Problem:** "You have 1 messages" is wrong grammar.

**Solution:**
```json
{
  "MESSAGES_COUNT": "{count, plural, =0{No messages} one{# message} other{# messages}}"
}
```

**Usage:**
```html
<p>{{ 'MESSAGES_COUNT' | translate:{ count: unreadMessages } }}</p>
```

---

### **Pattern 2: Gender-Aware**

**Problem:** "He/She uploaded the file" - you need to know gender.

**Solution:**
```json
{
  "FILE_UPLOADED": "{gender, select, male{He uploaded the file} female{She uploaded the file} other{They uploaded the file}}"
}
```

**Usage:**
```typescript
this.translate.get('FILE_UPLOADED', { 
  gender: user.gender // 'male', 'female', or 'other'
}).subscribe(t => console.log(t));
```

---

### **Pattern 3: Combined (Gender + Plural)**

**Problem:** "She sent you 1 requests" - both gender AND plurality wrong!

**Solution:**
```json
{
  "REQUESTS_RECEIVED": "{gender, select, male{He sent you} female{She sent you} other{They sent you}} {count, plural, =0{no requests} one{# request} other{# requests}}"
}
```

**Usage:**
```html
<span>{{ 'REQUESTS_RECEIVED' | translate:{ gender: sender.gender, count: requestCount } }}</span>
```

**Result:**
- `gender: 'male', count: 0` → "He sent you no requests"
- `gender: 'female', count: 1` → "She sent you 1 request"
- `gender: 'other', count: 5` → "They sent you 5 requests"

**Perfect grammar every time!** 🎯

---

### **Pattern 4: The Magic - Nested Keys + MessageFormat**

**Problem:** You want to reuse existing translation keys INSIDE MessageFormat.

**Solution:**
```json
{
  "BASE": {
    "ACTIONS": {
      "CREATE": "Create",
      "DELETE": "Delete"
    },
    "TASKS": {
      "CREATED_BY": "{gender, select, male{He {{BASE.ACTIONS.CREATE}}d this task} female{She {{BASE.ACTIONS.CREATE}}d this task} other{They {{BASE.ACTIONS.CREATE}}d this task}}"
    }
  }
}
```

**Usage:**
```typescript
this.translate.get('BASE.TASKS.CREATED_BY', { gender: 'male' })
  .subscribe(t => console.log(t)); // "He Created this task"
```

**Both systems working together!** ✨

---

## 🌍 Language-Specific Examples

### **English:**
```json
{
  "ITEMS": "{count, plural, =0{No items} one{# item} other{# items}}"
}
```

### **Chinese (No Plurals!):**
```json
{
  "ITEMS": "{count, plural, other{# 项}}"
}
```

### **Arabic (6 Plural Forms!):**
```json
{
  "ITEMS": "{count, plural, =0{لا توجد عناصر} one{عنصر واحد} two{عنصران} few{# عناصر} many{# عنصرًا} other{# عنصر}}"
}
```

### **Maori:**
```json
{
  "ITEMS": "{count, plural, one{# mea} other{# mea}}"
}
```

**MessageFormat knows ALL the rules!** 🌏

---

## 📊 Syntax Reference

### **Plural Syntax:**
```
{variable, plural, =0{zero} one{singular} other{plural}}
```

**Keywords:**
- `=0`, `=1`, etc. - Exact match
- `one` - Singular form (language-specific!)
- `two` - Dual form (Arabic, Slovenian)
- `few` - Few form (Polish, Russian)
- `many` - Many form (Polish, Russian)
- `other` - Default/fallback

**Special Symbol:**
- `#` - Replaced with the number

---

### **Select (Gender) Syntax:**
```
{variable, select, male{he} female{she} other{they}}
```

**Keywords:**
- Any custom value (`male`, `female`, `admin`, etc.)
- `other` - Default/fallback (required!)

---

### **Combining:**
```
{gender, select, male{He has} female{She has} other{They have}} {count, plural, one{# item} other{# items}}
```

---

## 🎨 Real-World Examples

### **Example 1: Cart Items**

**Before:**
```html
<span>{{ cartItems.length }} item(s) in cart</span>
```
Result: "1 item(s) in cart" 😢

**After:**
```json
{
  "CART_ITEMS": "{count, plural, =0{Cart is empty} one{# item in cart} other{# items in cart}}"
}
```
```html
<span>{{ 'CART_ITEMS' | translate:{ count: cartItems.length } }}</span>
```
Result: "1 item in cart" 😊

---

### **Example 2: Friend Requests**

**Before:**
```html
<span>{{ sender.name }} sent you {{ requests.length }} friend request(s)</span>
```
Result: "Jane sent you 1 friend request(s)" 😢

**After:**
```json
{
  "FRIEND_REQUESTS": "{gender, select, male{He} female{She} other{They}} sent you {count, plural, =0{no requests} one{# friend request} other{# friend requests}}"
}
```
```html
<span>{{ 'FRIEND_REQUESTS' | translate:{ gender: sender.gender, count: requests.length } }}</span>
```
Result: "She sent you 1 friend request" 😊

---

### **Example 3: File Upload**

**Before:**
```html
<span>{{ uploader.name }} uploaded {{ files.length }} file(s)</span>
```

**After:**
```json
{
  "FILES_UPLOADED": "{gender, select, male{He uploaded} female{She uploaded} other{They uploaded}} {count, plural, =0{no files} one{# file} other{# files}}"
}
```
```html
<span>{{ 'FILES_UPLOADED' | translate:{ gender: uploader.gender, count: files.length } }}</span>
```

---

## ⚠️ Common Mistakes

### ❌ **Mistake 1: Forgetting `other`**

**Wrong:**
```json
{
  "ITEMS": "{count, plural, one{# item}}"
}
```

**Right:**
```json
{
  "ITEMS": "{count, plural, one{# item} other{# items}}"
}
```

The `other` clause is **required** as a fallback!

---

### ❌ **Mistake 2: Wrong Parameter Name**

**Translation:**
```json
{
  "ITEMS": "{count, plural, one{# item} other{# items}}"
}
```

**Wrong Usage:**
```typescript
this.translate.get('ITEMS', { number: 5 }) // ❌ Wrong parameter name!
```

**Right Usage:**
```typescript
this.translate.get('ITEMS', { count: 5 }) // ✅ Matches translation!
```

---

### ❌ **Mistake 3: Not Testing Edge Cases**

Always test:
- `0` (zero items)
- `1` (singular)
- `2+` (plural)
- Negative numbers (if applicable)

---

## 🎯 Best Practices

### ✅ **DO:**
1. Use MessageFormat for **user-facing text** with numbers
2. Use MessageFormat for **gender-specific** messages
3. Keep translations **simple** - don't over-complicate
4. Test with **real data** (0, 1, 2, 5, 100, etc.)
5. Document **parameter names** for translators

### ❌ **DON'T:**
1. Use MessageFormat for **static text** (no parameters)
2. Create **overly complex** nested conditions
3. Forget the **`other`** clause
4. Assume English plural rules work for all languages
5. Hard-code numbers in templates

---

## 📁 File Locations

### **Translation Files:**
```
src/core/assets/deployed/i18n/
├── en.json                          (English)
├── mi.json                          (Maori)
├── to.json                          (Tongan)
├── ws.json                          (Samoan)
├── zh.json                          (Chinese)
└── _messageformat-examples.json     (Examples!)
```

### **Documentation:**
```
_custom/documentation/i18n/
└── MESSAGEFORMAT-EXAMPLES.md        (30+ examples)
```

---

## 🧪 Testing Your Translations

### **In Browser Console:**
```typescript
// Inject TranslateService in your component
constructor(private translate: TranslateService) {}

// Test in console
this.translate.get('BASE.ITEMS.COUNT', { count: 0 }).subscribe(console.log);
this.translate.get('BASE.ITEMS.COUNT', { count: 1 }).subscribe(console.log);
this.translate.get('BASE.ITEMS.COUNT', { count: 5 }).subscribe(console.log);
```

### **In Component:**
```typescript
ngOnInit() {
  // Test different counts
  [0, 1, 2, 5, 100].forEach(count => {
    this.translate.get('BASE.ITEMS.COUNT', { count })
      .subscribe(result => console.log(`${count}: ${result}`));
  });
}
```

---

## 🌟 Advanced: Language-Specific Rules

MessageFormat automatically handles language-specific plural rules:

**English:** `one`, `other`
**Polish:** `one`, `few`, `many`, `other`
**Arabic:** `zero`, `one`, `two`, `few`, `many`, `other`
**Chinese:** `other` (no plural distinction!)

**You don't have to know the rules!** MessageFormat does it for you! 🎉

---

## 🆘 Troubleshooting

### **Problem: Translation shows the key instead of text**

**Cause:** MessageFormat syntax error.

**Solution:**
1. Check your JSON syntax (valid JSON?)
2. Check you have an `other` clause
3. Check parameter names match

---

### **Problem: Plural not working correctly**

**Cause:** Not passing the `count` parameter.

**Solution:**
```html
<!-- Wrong -->
<span>{{ 'ITEMS' | translate }}</span>

<!-- Right -->
<span>{{ 'ITEMS' | translate:{ count: items.length } }}</span>
```

---

### **Problem: Nested keys not resolving**

**Cause:** Using wrong bracket style.

**Solution:**
- Nested keys: `{{BASE.ACTIONS.CREATE}}`
- MessageFormat parameters: `{count, plural, ...}`

**Don't mix them up!**

---

## 🎓 Learning Resources

### **Online Sandbox:**
https://messageformat.github.io/messageformat/

Test your MessageFormat syntax before deploying!

### **ICU Documentation:**
https://unicode-org.github.io/icu/userguide/format_parse/messages/

Official ICU MessageFormat documentation.

### **Our Examples:**
`src/core/assets/deployed/i18n/_messageformat-examples.json`

30+ copy-paste examples ready to use!

---

## 📊 Summary

**MessageFormat gives you:**
- ✅ Automatic plural handling
- ✅ Gender-aware translations
- ✅ Language-specific rules
- ✅ Proper grammar always
- ✅ Professional localization

**Use it for:**
- Counts (items, messages, files)
- Gender-specific text
- User-facing notifications
- Any text that changes based on context

**Avoid it for:**
- Static text without parameters
- Simple one-word translations
- Non-user-facing content

---

**Your app is now WORLD-READY!** 🌍🌎🌏

**Next:** Start adding MessageFormat to your most visible user-facing messages!

---

**Last Updated:** 2025-12-28  
**Feature Tier:** Core  
**Status:** ✅ Production-Ready
