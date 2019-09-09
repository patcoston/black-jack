# black-jack

## How to Play

- Dealer will hit until win, bust, or tie at 21
- Jack, Queen and King are worth 10
- Aces are worth 11 initially
- If bust (score > 21) AND have one or more Aces,
  it converts Aces value from 11 to 1,
  one at a time until score is not over 21,
  or no more Aces to convert.
  This applies to player and dealer.
- Split is enabled when player has two cards
  and has not split yet.
  It splits one hand into two hands,
  then each hand gets hit once, then dealer plays.
- If player splits, then dealer will try to beat higher hand

## TODO:

- Bug: Edge Case: Split and one or both hands gets 21, then dealer gets 21, it shows Win, not Tie
- Bug: If player splits, then left hand shows Stand label. Right hand should also show Stand label.

## How the code works

- Get card data from API and store in array cards[]
- 3 card Arrays for Dealer, Player and Split hand.
  Normally in Black Jack, player can split their hand if the cards have the same value.
  I originally implemented this constraint, but thought it was more fun to split any hand.
- Arrays for Dealer, Player and Split cards contain indexes into cards[] array.
  To deal a card into a hand, a random number is chosen from 0 to size of cards[] array minus 1.
  If the cards array was length 100, random numbers would be 0 to 99.
  This in not realistic for two reasons:
  1. The same card can be picked more than once
  2. The cards are not disposed once the hand is done. It's a full deck each time.
  Since there are 6 decks, you could get multiple cards with the same suit and value,
  even if you used each card once. I could mark a card as dirty, so it's not used twice,
  then reshuffle once I ran out of cards to deal, if I wanted it to be more realistic.
- To start, one card is dealt to dealer, and 2 to player.
  The one card to dealer simulates one card turned down.
