# Google Tag Manager — booking conversion

Container `GTM-WJXJ44J6`, account `6354941427`, workspace `252221269`.

`ads-booking-conversion.json` creates the one thing the container is missing: a
Google Ads conversion tag listening for the `purchase` event this site emits.

## Why this file exists

The site's job ends at "a booking completed and it was worth €X". It pushes one
event and names no tag:

```js
{
  event: 'purchase',
  transaction_id: 'LPS-2026-8841',  // ParkingPro's reservationCode
  value: 201.49,                     // totalWithTax, gross, bounded
  currency: 'EUR',
  value_missing: false,              // true when the value could not be read
  booking_source: 'online-payment'   // or 'in-frame'
}
```

Nothing in the container was listening for it. Six tags exist and not one is a
Google Ads Conversion Tracking tag — the "Book appointment" conversions in the
ad account were arriving via a GA4 import carrying no booking value, which is
why 30 conversions totalled €26.31 and why a ROAS strategy had nothing to bid on.

The event contract lives in `src/lib/analytics.ts`. Change it there and here
together, or the tag reads fields that no longer exist.

## The conversion action

Created in Google Ads on 2026-08-07. Both values are already in the JSON:

| | |
|---|---|
| Conversion ID | `934465672` (the numeric part of `AW-934465672`) |
| Conversion label | `9jJnCMOKlt0cEIihy70D` |

**Its settings still need correcting.** Google's guided flow created the action
without ever asking about value, which means it defaulted to *"Use the same
value for each conversion"* — every booking reported at one fixed figure. That
is the exact fault this whole exercise exists to fix, so in Google Ads →
Goals → Conversions → the action → Edit settings:

- Name: `Boeking betaald - website`
- Value: **Use different values for each conversion**
- Default value `50`, currency **EUR** — applies only when a conversion arrives
  with no value, which `value_missing` makes visible
- Count: **One**. A visitor who refreshes has not booked twice

## Importing

GTM → Admin → **Import Container** → choose this file → workspace **Default** →
**Merge** → **Rename conflicting tags, triggers and variables**.

Merge + rename is deliberate: it cannot overwrite the six existing tags. If a
name collides you get a duplicate to inspect, not a silent replacement.

Then **Preview** before **Submit**, and confirm on a booking that the tag fires
once with a real value.

Google's setup page also asks for a **Conversion Linker** tag firing on all
pages. The container already has one, on All Pages, added a month before this.
Nothing to do — do not add a second.

## Afterwards

- **`Successfull Booking`** (existing GA4 event tag) still fires on a trigger
  built for the WordPress site and is almost certainly dead. Repoint it at
  `Custom Event - purchase` and add `value`, `currency` and `transaction_id`, or
  delete it.
- **In Google Ads**, set the new action as the only primary one for bookings and
  demote the GA4-imported "Book appointment", or every booking counts twice.
- **Watch `value_missing`.** It is `true` when a booking was confirmed but its
  value could not be read. The conversion still counts, so the failure is
  invisible in the conversion column — it shows up only as revenue that is
  quietly too low. Worth an alert.

## Why `DLV - value` has a default of 50

Because without one, a booking whose value we never received is reported to
Google Ads as **worth €0**, not as "value unknown".

Observed on production 2026-08-19. When ParkingPro's redirect carries no
`totalWithTax`, the site correctly emits `value_missing: true` and omits the
value — but GTM still sends the tag's value parameter, and an empty variable
serialises as `value=0` in the conversion ping:

```
/pagead/conversion/934465672/?oid=CHECK-NOVALUE&value=0&currency_code=EUR
```

The €50 fallback configured on the conversion action in Google Ads never
applies, because that only fires when the tag sends **no** value at all. So the
booking counts, with zero revenue attached.

That is worse than not counting it. A ROAS strategy reads a €0 conversion as
proof that whatever produced it is worthless and bids away from it — so a run of
value-less bookings actively teaches Smart Bidding to avoid the traffic that
books.

Setting the default here puts the €50 back one layer earlier, where it does
apply. It is the same number and the same intent as the conversion action's
fallback, enforced in the only place that works.

**This is a floor, not a fix.** Every conversion arriving at exactly €50 means
ParkingPro is not sending `totalWithTax` — check that before trusting the
revenue figures. `DLV - value_missing` is the field that tells you which is
which.
