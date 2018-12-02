import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container,
    Row,
    Col,
    Jumbotron,
    Button
} from 'reactstrap';

class App extends Component {
    constructor(props) {
        super(props);

        this.sayWord = this.sayWord.bind(this);
        this.restartTest = this.restartTest.bind(this);
        this.listenToWord = this.listenToWord.bind(this);
        this.validateWord = this.validateWord.bind(this);
        this.beginTest = this.beginTest.bind(this);
        this.callNextWord = this.callNextWord.bind(this);
        this.nextWord = this.nextWord.bind(this);
        this.getNewWord = this.getNewWord.bind(this);
        this.renderStarting = this.renderStarting.bind(this);
        this.renderTesting = this.renderTesting.bind(this);
        this.renderCompleted = this.renderCompleted.bind(this);
        this.wordsChange = this.wordsChange.bind(this);
        this.answerChange = this.answerChange.bind(this);
        this.state = {
	    mode: "starting",
            isOpen: false,
	    words: "",
	    all_words: new Map(),
	    completed_words: new Map(),
	    actual_word: "",
	    answer: "",
	    actual_value: "",
	    hint: "hello",
	    lang: "sv"
        };
    }

    restartTest() {
        this.setState({
            mode: "starting"
        });
    }

    wordsChange(event) {
	this.setState({words: event.target.value});
    }

    answerChange(event) {
	this.setState({answer: event.target.value});
    }

    sayWord(text, lang) {
	const do_slow = Math.random() > 0.5 ? "true" : "false"
	var sound = new Audio('tts?text=' + encodeURI(text) + '&lang=' + encodeURI(lang) + '&slow=' + encodeURI(do_slow))
	sound.play()
    }

    listenToWord() {
	// The text to synthesize
	console.log("listenToWord")
	this.sayWord(this.state.hint, this.state.lang)
    }

    validateWord() {
	// The text to synthesize
	console.log("validateWord")
	var completed_words = new Map(this.state.completed_words)
	var all_words = new Map(this.state.all_words)
	if (this.state.answer === this.state.actual_word) {
	    this.sayWord("bra", "sv")
	    completed_words.set(this.state.actual_word, this.state.actual_value)
	} else {
	    this.sayWord("oops!", "en")
	    all_words.set(this.state.actual_word, this.state.actual_value)
	}
	this.setState({
	    all_words: all_words,
	    completed_words: completed_words,
	    mode: "validating"
	    })
    }

    beginTest() {
	console.log("beginTest")
	var lines = this.state.words.split('\n');
	var all_words = new Map(this.state.all_words)
	for (var l_index in lines) {
	    var key, value
	    const line = lines[l_index].trim()

	    if (line === "") {
		continue
	    }

	    const key_and_value = line.split('=')
	    if (key_and_value.length > 1) {
		key = key_and_value[0].trim().toLowerCase()
		value = key_and_value[1].trim().toLowerCase()
	    } else if (key_and_value.length === 1) {
		key = key_and_value[0].trim().toLowerCase()
		value = key
	    } else {
		continue
	    }
	    all_words.set(key, {hint: value, lang: "sv"})
	    all_words.set(value, {hint: key, lang: "es"})
	    console.log("<<<<>>>> key " + key + " value " + value + " ---> " + all_words.get(key))
	}
	console.log("beginTest() will call nextWord...")
	console.log(" *** all words " + all_words.size)
	for (var key1 of all_words.keys()) {
	    console.log(" -- " + key1 + " => " + all_words.get(key1))
	}
	this.nextWord(all_words, new Map())
	console.log("beginTest() will return...")
    }

    callNextWord() {
	this.nextWord(this.state.all_words, this.state.completed_words)
    }

    nextWord(all_words, completed_words) {
	console.log("nextWord")
	var from_completed
        if (all_words.length === 1 && completed_words.length > 0) {
	    console.log("from completed")
            from_completed = true
        } else {
	    console.log("NOT from completed")
            from_completed = false
	}

        if(this.getNewWord(from_completed, all_words, completed_words)) {
	    console.log("Next mode is testing...")
	    this.setState({mode: "testing"})
	} else {
	    console.log("Next mode is completed...")
	    this.setState({
		mode: "completed",
		all_words: all_words,
		completed_words: completed_words
	    })
	}
    }

    getNewWord(from_completed, all_words, completed_words) {
	console.log("getNewWord()")
	var word_list = new Map(from_completed ? completed_words : all_words)

	console.log(" --- all words " + all_words.size)
	for (var key1 of all_words.keys()) {
	    console.log(key1 + " => " + all_words.get(key1))
	}
	console.log(" --- completed words " + completed_words.size)
	for (var key2 of completed_words.keys()) {
	    console.log(key2 + " => " + completed_words.get(key2))
	}

	if (word_list.size <= 0) {
	    console.log("Word list is empty..")
	    return false
	}

	const indx = Math.floor((Math.random() * word_list.size));

	var actual_word = ""
	var actual_value = ""
	var hint = ""
	var lang = ""
	var k = 0
	console.log("Word list is " + word_list.size + " elements")
	for (var w of word_list.keys()) {
	    console.log("W is " + w + " k is " + k + " indx = " + indx)
	    if (k === indx) {
		actual_word = w
		actual_value = word_list.get(w)

		console.log("hint is actual word: " + actual_word)
		hint = actual_value.hint
		lang = actual_value.lang
	    }
	    k = k + 1
	}

	if (actual_word === "") {
	    console.log("actual_word is empty")
	    return false
	}

	word_list.delete(actual_word)

	if (from_completed) {
	    this.setState({
		completed_words: word_list,
		all_words: all_words
	    })
	} else {
	    this.setState({
		all_words: word_list,
		completed_words: completed_words
	    })
	}
	this.setState({
	    answer: "",
	    actual_word: actual_word,
	    actual_value: actual_value,
	    hint: hint,
	    lang: lang
	})

	console.log("got a word")
	return true
    }

    renderStarting() {
	console.log("renderStarting")
	return (
	    <Row>
            <Col>
	    <label>
            Skriv orden här:
            <textarea value={this.state.words} onChange={this.wordsChange} />
            </label>
            <p>
            <Button
            tag="a"
            color="success"
            size="large"
	    onClick={this.beginTest}
	    >
            Börja!
            </Button>
            </p>
            </Col>
            </Row>
	    )
    }

    renderTesting() {
	console.log("renderTesting")
	return (
	    <Row>
            <Col>
	    <label>
            Skriv svaret här:
	    <input
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChange={this.answerChange}
            value={this.state.answer}
	    />
            </label>
            <p>
            <Button
            tag="a"
            color="success"
            size="large"
	    onClick={this.listenToWord}
	    >
            Lyssna!
            </Button>
            <Button
            tag="a"
            color="success"
            size="large"
	    onClick={this.validateWord}
	    >
            Svara!
            </Button>
            </p>
            </Col>
            </Row>
	    )
    }

    renderValidating() {
	console.log("renderValidating")
	return (
	    <Row>
            <Col>
	    <label>
	    Du skrev {this.state.answer} -- Rätt ord var {this.state.actual_word}
            </label>
            <p>
            <Button
            tag="a"
            color="success"
            size="large"
	    onClick={this.callNextWord}
	    >
            Nästa ord!
            </Button>
            </p>
            </Col>
            </Row>
	    )
    }

    renderCompleted() {
	console.log("renderCompleted")
	return (
	    <Row>
            <Col>
	    <label>
	    Du klarade det!
            </label>
            <p>
            <Button
            tag="a"
            color="success"
            size="large"
	    onClick={this.restartTest}
	    >
            Börja om!
            </Button>
            </p>
            </Col>
            </Row>
	    )
    }

    render() {
	console.log("Mode: " + this.state.mode)
	var content
	switch(this.state.mode) {
	default:
	case "starting":
	    content = this.renderStarting()
	    break
	case "testing":
	    content = this.renderTesting()
	    break
	case "validating":
	    content = this.renderValidating()
	    break
	case "completed":
	    content = this.renderCompleted()
	    break
	}
        return (
            <div>
                <Navbar color="inverse" light expand="md">
                    <NavbarBrand href="">Gl00z00r</NavbarBrand>
                </Navbar>
                <Jumbotron>
            <Container>
	        {content}
                    </Container>
                </Jumbotron>
            </div>
        );
    }
}

export default App;
