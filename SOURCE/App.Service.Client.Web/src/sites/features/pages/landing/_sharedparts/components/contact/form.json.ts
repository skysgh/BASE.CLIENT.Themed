export const formData = {
  "type": "object",
  "properties": {
    "GivenName": { "type": "string" },
    "Email": { "type": "string" },
    "Subject": { "type": "string" },
    "Message": { "type": "string" }
  },
  "layout": [
    {
      "type": "div", "items": [
        { "key": "GivenName" },
        { "key": "Email" }
      ]
    },
    {
      "type": "div", "items": [
        { "key": "Subject" },
      ]
    },
    {
      "type": "div", "items": [
        { "key": "PlaceOfBirth" }
      ]
    }
  ]}
