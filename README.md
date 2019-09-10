# black-jack

## How to Play

- Dealer will hit until win, bust, or tie at 21
- Jack, Queen and King are worth 10
- Aces are worth 11 initially
- If bust (score > 21) AND have one or more Aces, it converts Aces value from 11 to 1, one at a time until score is not over 21, or no more Aces to convert. This applies to player and dealer.
- Split is enabled when player has two cards and has not Split or Hit yet. It splits one hand into two hands, then each hand gets hit once, then dealer plays.
- If player splits, then dealer will try to beat higher hand.
- Normally in Black Jack, player can split their hand if the cards have the same value. I originally implemented this constraint, but thought it was more fun to split any hand.
- I had originally disabled the Deal Cards button while game was in play, but decided it was more fun to allow a re-deal at any time.

## How to install

- You need to be familiar with the command line to install and run.
- Install Node from https://nodejs.org/en/download/
- Install Git from https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- Open the command line
- Navigate to the folder you want to create the sub-folder black-jack
- Type or copy/paste this command into the command into the command line.
```
git clone https://github.com/patcoston/black-jack.git
```
Change into the black-folder folder
```
cd black-jack
```
Install the Node Modules
```
npm install
```
Run Black Jack
```
npm start
```
You may need to Git and/or Node to your path

## How the code works

- Get card data from API and store in array cards[]
- 3 card Arrays for Dealer, Player and Split hand.
- Arrays for Dealer, Player and Split cards contain indexes into cards[] array. To deal a card into a hand, a random number is chosen from 0 to size of cards[] array minus 1. If the cards array was length 100, random numbers would be 0 to 99.
  This in not realistic for two reasons:
  1. The same card can be picked more than once
  2. The cards are not disposed once the hand is done. It's a full deck each time.
  3. Worst case scenario is getting 22 Aces in a row, to Bust, each worth 1
  Since there are 6 decks, you could get multiple cards with the same suit and value, even if you used each card once. I could mark a card as dirty, so it's not used twice, then reshuffle once I ran out of cards to deal, if I wanted it to be more realistic.
- To start, one card is dealt to dealer, and 2 to player. The one card to dealer simulates one card turned down.

## Screen Shot 1

![Split and Dealer Busts](https://github.com/patcoston/black-jack/blob/master/public/bj1.png)

## Screen Shot 2

![Split and Dealer Tie Black Jack](https://github.com/patcoston/black-jack/blob/master/public/bj2.png)

## Screen Shot 3

![Dealer Wins Black Jack](https://github.com/patcoston/black-jack/blob/master/public/bj3.png)
