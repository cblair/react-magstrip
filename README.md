# react-magstripe
A react component for reading magstripe data from a USB mag strip like the MSR90 via the virtual keyboard and calling back 
with card data.

The parser for this component follows the ISO7813 format, but not strictly. In the real world, we see cards loosely following
this format, with lots of flipping of first / last names, and leaving data like security codes out. Sometimes some fields are
completely missing. As a minimum, for processers like Stripe you'll need `card_number`, `first_name` and `last_name`.

I've open sourced this component as an attempt to help others, and to find better parsing rules to get more card data to work.
Please share example data of cards that don't work! (Redact actual card numbers of course.) And please PR and fixes you'd like
to see added.

# Install
```
npm install react-magstripe
```

# Usage
```
import MagStripe from "react-magstripe";

<MagStripe onComplete={data => console.log(data)} />
```

Example data from `onComplete` callback:
```
{
  card_number: '4242424242424242',
  last_name: 'BLAIR',
  first_name: 'COLBY',
  YY: '23',
  MM: '01',
  service_code: '',
  discretionary_data: ''
}
```
