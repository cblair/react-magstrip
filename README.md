# react-magstripe
A react component for reading magstripe data from a USB mag strip like the MSR90 via the virtual keyboard and calling back 
with card data.

The parser for this component follows the ISO7813 format, but not strictly. In the real world, we see cards loosely following
this format, with lots of flipping of first / last names, and leaving data like security codes out. Sometimes some fields are
completely missing. As a minimum, for processers like Stripe you'll need `card_number`, `first_name` and `last_name`.

The way the component works; it is mounted on a page in a browser window that is active in the operation system you're working on. You then plug in
the physical magstripe reader. Most, like the MSR90, act like a virtual 
keyboard, so this component is just reading from `keydown` data coming
in from the virtual keyboar. This typically included lots of keys like 
`Shift` that we don't care about and `<MagStripe />` filters out for you.
The result is clean, filtered, formatted data. If you are using another
magstripe reader and get lots of junk, create a github issue or PR and
those keys will be added to the filter.

The most likely application for this component is a kiosk style browser application
running on a captive version of an operating system like Linux. If you have
issues in that environment with this component, verify that plain keyboard
key presses register with `<MagStripe />`; if not, then your browser window
hosting the page is not active in the operating system foreground. 
Such issues are out of scope here, but
we've built many systems in this environment using `<MagStripe />` and 
haven't had many issues.

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
