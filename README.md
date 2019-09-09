# black-jack

## How to Play

- Dealer will hit until win, bust, or tie at 21
- Aces are worth 11 initially
- Jack, Queen and King are worth 10
- If bust (score > 21) AND have one or more Aces,
  convert Aces value from 11 to 1,
  one at a time until score is not over 21,
  or no more Aces to convert.
  This applies to player and dealer.
- Split is enabled when player has two cards.
  It splits one hand into two hands,
  then each hand gets hit once, then dealer plays.
- If player splits, then dealer will try to beat higher hand

## TODO:

- Splitting - After Split clicked, disable buttons Stand, Hit, Split,
  then Dealer plays, then show Win, Lose or Tie for 21 for all 3 hands.

- Player Stands - Bug: Dealer Plays, thinks it wins with lower score.

## How the code works

- Get the card data from the API and store in array cards[]
- 3 Arrays for cards for Dealer, Player and Split.
  Split the second hand if the player gets two identical cards,
  and decides to split it into two hands.
- Arrays for Dealer, Player and Split cards contain indexes into cards[] array.
  To deal a card into a hand, a random number is chosen from 0 to size of cards[] array minus 1.
  So if the cards array was length 100, random numbers would be 0 to 99,
  because they are indexes in the cards[] array.
  This in not realistic for two reasons:
  1. The same card can be picked more than once
  2. The cards are not disposed once the hand is done. It's a full deck each time.
  Since there are 6 decks, you could get multiple cards with the same suit and value,
  even if you used each card once. I could mark a card as dirty, so it's not used twice,
  then reshuffle once I ran out of cards to deal, if I wanted it more realistic.
- To start, 1 card is dealt to dealer, and 2 to player.
  The one card to dealer simulates one card turned down.
