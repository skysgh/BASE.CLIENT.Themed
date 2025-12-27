# MessageFormat Examples for Your i18n Files

**Goal:** Add gender/plural awareness to translations WITHOUT breaking existing nested keys!

---

## 🎯 YOUR CURRENT SYNTAX (Still Works!)

### **Nested Keys (Recursive Resolution):**
```json
{
  "BASE": {
    "ACTIONS": {
      "CREATE": "Create",
      "SAVE": "Save"
    },
    "BUTTONS": {
      "CREATE_BUTTON": "{{BASE.ACTIONS.CREATE}}"
    }
  }
}
```

**Result:** `"Create"`  
**Status:** ✅ Still works with MessageFormat!

---

## 🆕 NEW: MessageFormat Syntax

### **1. PLURAL-AWARE (Quantity Changes Word)**

#### **Example: Items in Cart**

**Before (Simple):**
```json
{
  "CART": {
    "ITEMS": "{count} item(s)"
  }
}
```

**After (MessageFormat):**
```json
{
  "CART": {
    "ITEMS": "{count, plural, =0{No items} one{# item} other{# items}}"
  }
}
```

**Usage in Component:**
```typescript
this.translate.get('CART.ITEMS', { count: 0 }).subscribe(t => {
  console.log(t); // "No items"
});

this.translate.get('CART.ITEMS', { count: 1 }).subscribe(t => {
  console.log(t); // "1 item"
});

this.translate.get('CART.ITEMS', { count: 5 }).subscribe(t => {
  console.log(t); // "5 items"
});
```

---

#### **Example: Days Remaining**

**English:**
```json
{
  "SUBSCRIPTION": {
    "DAYS_LEFT": "{days, plural, =0{Expired today} one{# day left} other{# days left}}"
  }
}
```

**Maori (Different Rules!):**
```json
{
  "SUBSCRIPTION": {
    "DAYS_LEFT": "{days, plural, one{# rā e toe ana} other{# rā e toe ana}}"
  }
}
```

**Tongan (Different Rules!):**
```json
{
  "SUBSCRIPTION": {
    "DAYS_LEFT": "{days, plural, one{# 'aho 'oku toe} other{# 'aho 'oku toe}}"
  }
}
```

**Samoan (Different Rules!):**
```json
{
  "SUBSCRIPTION": {
    "DAYS_LEFT": "{days, plural, one{# aso ua toe} other{# aso ua toe}}"
  }
}
```

---

### **2. GENDER-AWARE (Gender Changes Word)**

#### **Example: User Profile**

**Before (Generic):**
```json
{
  "PROFILE": {
    "GREETING": "Welcome, {name}! You have {count} messages."
  }
}
```

**After (Gender-Aware):**
```json
{
  "PROFILE": {
    "GREETING": "{gender, select, male{Welcome, Mr. {name}!} female{Welcome, Ms. {name}!} other{Welcome, {name}!}} {count, plural, =0{You have no messages} one{You have # message} other{You have # messages}}"
  }
}
```

**Usage:**
```typescript
this.translate.get('PROFILE.GREETING', { 
  gender: 'male', 
  name: 'John', 
  count: 3 
}).subscribe(t => {
  console.log(t); // "Welcome, Mr. John! You have 3 messages"
});

this.translate.get('PROFILE.GREETING', { 
  gender: 'female', 
  name: 'Jane', 
  count: 1 
}).subscribe(t => {
  console.log(t); // "Welcome, Ms. Jane! You have 1 message"
});
```

---

#### **Example: Role Assignment**

**English:**
```json
{
  "ROLES": {
    "ASSIGNED": "{gender, select, male{He was assigned as {role}} female{She was assigned as {role}} other{They were assigned as {role}}}"
  }
}
```

**Maori (Gender in verbs!):**
```json
{
  "ROLES": {
    "ASSIGNED": "{gender, select, male{Kua tohua ia hei {role}} female{Kua tohua ia hei {role}} other{Kua tohua rātou hei {role}}}"
  }
}
```

---

### **3. COMBINED: Gender + Plural**

#### **Example: Friend Requests**

**English:**
```json
{
  "FRIENDS": {
    "REQUESTS": "{gender, select, male{He sent you} female{She sent you} other{They sent you}} {count, plural, =0{no requests} one{# friend request} other{# friend requests}}"
  }
}
```

**Result:**
- `gender: 'male', count: 0` → "He sent you no requests"
- `gender: 'male', count: 1` → "He sent you 1 friend request"
- `gender: 'female', count: 3` → "She sent you 3 friend requests"
- `gender: 'other', count: 2` → "They sent you 2 friend requests"

---

### **4. COMPLEX PACIFIC LANGUAGES**

#### **Samoan Example (Respect Levels):**

**Problem:** Samoan has different words based on respect level AND plurality!

```json
{
  "EDUCATION": {
    "TEACHERS": {
      "GREETING": "{respectLevel, select, formal{{count, plural, one{Le Faia'oga} other{Faia'oga}}} informal{{count, plural, one{a'oga} other{a'oga}}} other{Teacher(s)}}"
    }
  }
}
```

**Usage:**
```typescript
// Formal, singular
this.translate.get('EDUCATION.TEACHERS.GREETING', { 
  respectLevel: 'formal', 
  count: 1 
}); // "Le Faia'oga" (The Teacher - formal)

// Formal, plural
this.translate.get('EDUCATION.TEACHERS.GREETING', { 
  respectLevel: 'formal', 
  count: 3 
}); // "Faia'oga" (Teachers - formal)

// Informal
this.translate.get('EDUCATION.TEACHERS.GREETING', { 
  respectLevel: 'informal', 
  count: 2 
}); // "a'oga" (informal)
```

---

#### **Tongan Example (Possessive Changes):**

**Problem:** Tongan possessive changes based on relationship to owner!

```json
{
  "FAMILY": {
    "CHILDREN": "{possession, select, alienable{'eku fanau} inalienable{hoku fanau} other{my children}}"
  }
}
```

- `alienable` = things you can give away
- `inalienable` = part of you (body parts, family)

---

### **5. YOUR EXISTING NESTED KEYS + MessageFormat**

**You can COMBINE both!**

```json
{
  "BASE": {
    "ACTIONS": {
      "CREATE": "Create",
      "SAVE": "Save",
      "DELETE": "Delete"
    },
    "TASKS": {
      "CREATED_BY": "{gender, select, male{He {{BASE.ACTIONS.CREATE}}d this task} female{She {{BASE.ACTIONS.CREATE}}d this task} other{They {{BASE.ACTIONS.CREATE}}d this task}}"
    }
  }
}
```

**Result:**
- `gender: 'male'` → "He Created this task"
- `gender: 'female'` → "She Created this task"

**THIS IS THE MAGIC! ✨** You keep your nested key resolution AND add MessageFormat!

---

## 📊 LANGUAGE-SPECIFIC PLURAL RULES

### **English:**
- `one`: 1
- `other`: 0, 2, 3, 4, ...

### **Maori:**
- `one`: 1
- `other`: 0, 2, 3, 4, ...

### **Samoan:**
- `one`: 1
- `other`: 0, 2, 3, 4, ...

### **Tongan:**
- `one`: 1
- `other`: 0, 2, 3, 4, ...

### **Chinese (Simplified):**
- `other`: 0, 1, 2, 3, ... (NO PLURAL FORMS!)

**MessageFormat handles ALL of this automatically!** 🎉

---

## 🎯 MIGRATION STRATEGY

### **Phase 1: Keep Everything As-Is**
- ✅ Your existing translations work
- ✅ Nested keys still resolve
- ✅ No changes needed!

### **Phase 2: Add MessageFormat Gradually**
- ✅ Start with new translations
- ✅ Add to high-visibility areas first
- ✅ Test with each language

### **Phase 3: Refactor Old Translations**
- ✅ Replace generic plurals
- ✅ Add gender awareness
- ✅ Test thoroughly

---

## 🛠️ TOOLS TO HELP

### **MessageFormat Sandbox:**
https://messageformat.github.io/messageformat/

Test your syntax before deploying!

### **ICU User Guide:**
https://unicode-org.github.io/icu/userguide/format_parse/messages/

Official MessageFormat documentation.

---

## 📝 EXAMPLE: Your en.json (Updated)

**Before:**
```json
{
  "BASE": {
    "ACCOUNTS": {
      "SINGULAR": "Account",
      "PLURAL": "Accounts"
    }
  }
}
```

**After (MessageFormat):**
```json
{
  "BASE": {
    "ACCOUNTS": {
      "SINGULAR": "Account",
      "PLURAL": "Accounts",
      "COUNT": "{count, plural, =0{No accounts} one{# account} other{# accounts}}"
    }
  }
}
```

**Usage:**
```html
<!-- Old way (still works) -->
<span>{{ 'BASE.ACCOUNTS.PLURAL' | translate }}</span>

<!-- New way (context-aware) -->
<span>{{ 'BASE.ACCOUNTS.COUNT' | translate:{ count: userAccounts.length } }}</span>
```

---

## 🎉 SUMMARY

**What You Get:**
1. ✅ **Keep nested keys** (`{{BASE.ACTIONS.CREATE}}`)
2. ✅ **Add plural awareness** (`{count, plural, ...}`)
3. ✅ **Add gender awareness** (`{gender, select, ...}`)
4. ✅ **Language-specific rules** (automatic!)
5. ✅ **Backward compatible** (old keys work!)
6. ✅ **No refactoring required** (gradual migration!)

**This is the BEST of both worlds!** 🌏🌍🌎

---

**Next Steps:**
1. Update module configuration (5 min)
2. Test backward compatibility (5 min)
3. Create first MessageFormat example (10 min)
4. Test in Maori/Tongan/Samoan (15 min)
5. Document for team (10 min)

**Total: 45 minutes to full MessageFormat support!** ⚡

---

**Ready to update the module configuration?** 🚀
