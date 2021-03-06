import React, { Component } from 'react';
import { Row } from 'react-materialize';
import Card from '../components/Card/Card';
import CardButtons from '../components/Card/CardButtons';
import { CorrectAnswers, IncorrectAnswers } from '../components/Card/Results';
import API from '../utils/API';

export class Libraries extends Component {
  state = {
    libraries: [],
    cards: [],
    correct: [],
    incorrect: [],
    question: '',
    answer: '',
    index: 0,
    libraryName: '',
    resultText: '',
    disabled: false,
    showNext: false,
    showFinish: false,
    step: 1
  };

  componentDidMount() {
    this.loadLibraries();
  }

  loadLibraries = () => {
    API.getLibraries()
      .then(res =>
        this.setState({
          libraries: res.data,
          index: 0,
          resultText: '',
          step: 1
        })
      )
      .catch(err => console.log(err));
  };

  loadCards = (id, name) => {
    const { index, step } = this.state;
    API.getLibrary(id)
      .then(res =>
        this.setState({
          correct: [],
          incorrect: [],
          cards: res.data.cardsID,
          libraryName: name,
          question: res.data.cardsID[index].question,
          answer: res.data.cardsID[index].answer,
          showNext: true,
          showFinish: true,
          disabled: false,
          step: step + 1
        })
      )
      .catch(err => console.log(err));
  };

  nextCard = () => {
    const { index, cards } = this.state;
    console.log(index, cards.length);

    if (index === cards.length - 1) {
      this.results();
    } else {
      this.setState(
        {
          index: index + 1,
          resultText: ''
        },
        () => {
          this.refreshCard();
        }
      );
    }
  };

  refreshCard = () => {
    const { index, cards } = this.state;
    this.setState({
      question: cards[index].question,
      answer: cards[index].answer,
      showNext: true,
      showFinish: false,
      disabled: false
    });
  };

  correct = () => {
    const { question, answer } = this.state;

    this.setState(
      {
        disabled: true,
        showNext: false,
        resultText: 'Got it!'
      },
      () => {
        this.state.correct.push({ question: question, answer: answer });
      }
    );
  };

  incorrect = () => {
    const { question, answer } = this.state;

    this.setState(
      {
        disabled: true,
        showNext: false,
        resultText: 'Missed it!'
      },
      () => {
        this.state.incorrect.push({ question: question, answer: answer });
      }
    );
  };

  results = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  render() {
    const {
      step,
      question,
      answer,
      showNext,
      showFinish,
      disabled
    } = this.state;

    switch (step) {
      case 1:
        return (
          <Row>
            <span className='black-text center-align'>
              <h4>Select A Library To Study</h4>
            </span>
            <div className='card'>
              <div className='card-content'>
                <div className='center-align libraries'>
                  {this.state.libraries.map(button => (
                    <ul key={button._id}>
                      <li>
                        <h5
                          onClick={() =>
                            this.loadCards(button._id, button.library)
                          }
                          className='libraryList grey-text text-darken-2'
                        >
                          {button.library}
                        </h5>
                      </li>
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          </Row>
        );
      case 2:
        return (
          <>
            <span className='black-text center-align'>
              <h4>{this.state.libraryName}</h4>
            </span>

            <Card question={question} answer={answer} />
            <CardButtons
              nextCard={this.nextCard}
              showNext={showNext}
              showFinish={showFinish}
              disabled={disabled}
              correct={this.correct}
              incorrect={this.incorrect}
              results={this.results}
            />
            <span className='black-text center-align'>
              <h5>{this.state.resultText}</h5>
            </span>
          </>
        );
      case 3:
        return (
          <>
            <span className='black-text center-align'>
              <h4>{this.state.libraryName}</h4>
            </span>
            <span className='black-text center-align'>
              <h5>Results</h5>
            </span>
            <CorrectAnswers>
              {this.state.correct.map(table => (
                <tr>
                  <td>{table.question}</td>
                  <td>{table.answer}</td>
                </tr>
              ))}
            </CorrectAnswers>
            <IncorrectAnswers>
              {this.state.incorrect.map(table => (
                <tr>
                  <td>{table.question}</td>
                  <td>{table.answer}</td>
                </tr>
              ))}
            </IncorrectAnswers>
          </>
        );
      default:
        return null;
    }
  }
}
export default Libraries;
