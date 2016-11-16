/// <reference path="testlist.js" />
/// <reference path="upload.js" />
/// <reference path="runner.js" />
/// <reference path="keynav.js" />

/*jshint nonew: false */

function TestList()
{
    this.resultsServerEndpoint = "http://localhost:35127/api.php/results";
    this.resultsSessionEndpoint = false;
}

TestList.prototype = {
    build_test_list: function ()
    {
        var test_list = document.getElementById("test_list");

        var testLink = this.create_test_link(-1, '', 'All');
        test_list.appendChild(testLink);

        // Build list of the tests
        for (var i = 0; i < tests.length; i++)
        {
            var test = tests[i];
            var testLink = this.create_test_link(i, test, test);
            test_list.appendChild(testLink);
        }
    },
    create_test_link: function (i, test, label)
    {
        var testLink = document.createElement("a");
        testLink.href = "#";
        testLink.className = "list-group-item row keynav";
        testLink.innerText = label;
        testLink.id = "test_" + i;
        this.install_handler(testLink, i);

        return testLink;
    },
    install_handler: function (testLink, i)
    {
        var start_test = this.start_test;
        testLink.addEventListener('click', function ()
        {
            this.start_test(i);
        }.bind(this));
    },
    start_test: function (i)
    {
        var path = document.getElementById("path");
        path.value = (-1 == i) ? "/" + tests.join(",/") : "/" + tests[i];

        var start_button = document.querySelector(".toggleStart");
        start_button.click();
    }
};

function RunnerSimple(runner)
{
    this.setup(runner);
};

RunnerSimple.prototype = 
{
    setup: function(runner)
    {
        this.runner = runner;
        this.keyNav = new KeyNav('.keynav');
        this.testList = new TestList();
        this.testList.build_test_list();

        // If there are any 'back' buttons then set them up to restore the state
        var backButtons = document.querySelectorAll(".backButton");
        for (var i = 0; i < backButtons.length; i++)
        {
            backButtons[i].addEventListener('click', this.on_back.bind(this));
        }

        // Setup the 'next' button
        var nextButton = document.querySelector(".nextButton");
        nextButton.addEventListener('click', this.on_next.bind(this));
        nextButton.style.display = 'none';

        // Register handlers with the runner
        this.runner.start_callbacks.push(this.on_start.bind(this));
        this.runner.done_callbacks.push(this.on_done.bind(this));
        this.runner.error_callbacks.push(this.on_error.bind(this));
    },
    on_start: function ()
    {
        this.set_display(".nextButton", "none");
        this.set_display(".test-list", "none");
        this.set_display(".test-runner", "block");
        this.set_display("#errorMessage", "none");
    },
    on_done: function ()
    {
        var i = this.get_test_index();
        if (i >= 0 && i+1 < tests.length)
        {
            this.set_display(".nextButton", "block");
        }
    },
    on_back: function ()
    {
        // If we are still running tests then stop them
        if (!this.runner.done_flag) {
            this.runner.done();
        }

        // Display the test list
        this.set_display(".test-list", "block");
        this.set_display(".test-runner", "none");

        // Select the running test in the list
        this.select_test();
    },
    on_next: function ()
    {
        var i = this.get_test_index();
        if (i >= 0 && i + 1 < tests.length)
        {
            this.testList.start_test(i + 1);
        }
    },
    on_error: function (message)
    {
        var errorMessage = document.getElementById("errorMessage");
        var errorMessageText = document.getElementById("errorMessageText");
        if (null != errorMessage && null != errorMessageText)
        {
            errorMessage.style.display = 'block';
            errorMessageText.innerText = message;
        }
    },
    set_display: function (selector, value) 
    {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++)
        {
            elements[i].style.display = value;
        };
    },
    select_test: function ()
    {
        var i = this.get_test_index();
        if (i >= 0)
        {
            var testElement = document.getElementById("test_" + i);
            this.keyNav.highlightFocusedElement(testElement, true);
        }
    },
    get_test_index: function ()
    {
        var pathElem = document.getElementById("path");
        var path = pathElem.value.substring(1);

        for (var i = 0; i < tests.length; i++)
        {
            if (tests[i] == path)
            {
                return i;
            }
        }

        return -1;
    }
}