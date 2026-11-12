/* Daily tasks for /learn/daily/. One entry per day, 5 cards each.
   Card types:
     output  - code, a (right answer), w (wrong answers)
     choice  - q, a, w
     order   - q, items (in the correct order; shown shuffled)
     bug     - q, code (lines), bad (index of the line with the bug)
   Every card has: topic, why (shown after answering). Use `code` and **bold** in why.
   To add a day: append a new { cards: [...] } at the end. Day 1 = 12 Nov 2026. */
window.KV_DAILY = {
  start: [2026, 11, 12],
  days: [
    { cards: [
      { t: 'output', topic: 'Python', code: 'print(len("data") * 2)', a: '8', w: ['datadata', '4', '16'],
        why: '`len("data")` counts the letters: 4. Then `4 * 2` is `8`. Python works from the inside out.' },
      { t: 'choice', topic: 'Azure', q: 'You must store millions of raw CSV and JSON files cheaply, ready for analytics. Which Azure service?',
        a: 'Azure Data Lake Storage Gen2', w: ['Azure SQL Database', 'Power BI', 'Azure Functions'],
        why: '**Data Lake Storage Gen2** is cheap file storage built for big data. SQL Database is for tables, Power BI is for reports, Functions run code.' },
      { t: 'bug', topic: 'Python', q: 'This program will not run. Which line has the mistake?',
        code: ['nums = [3, 5, 7]', 'for n in nums', '    print(n * 2)'], bad: 1,
        why: 'A `for` line must end with a colon `:`. Python says `SyntaxError: expected \':\'`. Fixed: `for n in nums:`' },
      { t: 'order', topic: 'Git', q: 'Put the steps in order to save a code change and share it on GitHub.',
        items: ['Edit the file', 'git add main.py', 'git commit -m "Fix bug"', 'git push'],
        why: '`git add` picks the changes, `git commit` saves them with a message on your computer, and `git push` sends them to GitHub.' },
      { t: 'choice', topic: 'Linux', q: 'Which command lists the files in the current folder?',
        a: 'ls', w: ['cd', 'pwd', 'mkdir'],
        why: '`ls` lists files. `cd` changes folder, `pwd` prints where you are, `mkdir` makes a new folder.' }
    ] },
    { cards: [
      { t: 'output', topic: 'Python', code: 'x = 10\nx += 5\nprint(x // 4)', a: '3', w: ['3.75', '4', '15'],
        why: '`x += 5` makes x 15. `//` is floor division: 15 ÷ 4 = 3.75, and `//` drops the decimal part, so `3`.' },
      { t: 'choice', topic: 'Azure', q: 'An app sends millions of live events every second. Which service should receive them?',
        a: 'Azure Event Hubs', w: ['Azure Data Factory', 'Azure Synapse Analytics', 'Power BI'],
        why: '**Event Hubs** takes in huge streams of live events. Data Factory moves data in batches on a schedule; Synapse and Power BI come later in the pipeline.' },
      { t: 'order', topic: 'Data', q: 'Medallion architecture: order the layers from raw data to report-ready data.',
        items: ['Bronze: raw data, as it arrived', 'Silver: cleaned and joined', 'Gold: ready for reports'],
        why: 'Data gets better at each step: **bronze** keeps the raw copy, **silver** cleans it, **gold** shapes it for business reports.' },
      { t: 'bug', topic: 'Python', q: 'This program crashes with a TypeError. Which line crashes?',
        code: ['age = "25"', 'next_year = age + 1', 'print(next_year)'], bad: 1,
        why: '`age` is text (it has quotes). Text + number is not allowed: `TypeError: can only concatenate str (not "int") to str`. Fix: `int(age) + 1`.' },
      { t: 'choice', topic: 'Ansible', q: 'Which Ansible module installs a package on an Ubuntu server?',
        a: 'ansible.builtin.apt', w: ['ansible.builtin.copy', 'ansible.builtin.service', 'ansible.builtin.template'],
        why: '**apt** is Ubuntu’s package manager, so `ansible.builtin.apt` installs packages. `copy` sends files, `service` starts and stops services.' }
    ] },
    { cards: [
      { t: 'output', topic: 'Python', code: 'print("Azure"[1:4])', a: 'zur', w: ['Azu', 'zure', 'zu'],
        why: 'Positions start at 0: A=0, z=1, u=2, r=3, e=4. `[1:4]` takes 1, 2 and 3 (the end is not included): `zur`.' },
      { t: 'choice', topic: 'Azure', q: 'What is Azure Data Factory mainly used for?',
        a: 'Moving data between systems on a schedule (pipelines)', w: ['Drawing dashboards', 'Hosting websites', 'Training AI models'],
        why: '**Data Factory** builds pipelines that copy and move data, for example from a database into a data lake every night.' },
      { t: 'order', topic: 'Linux', q: 'Order the commands: make a folder, go into it, create a file, then list what is there.',
        items: ['mkdir project', 'cd project', 'touch notes.txt', 'ls'],
        why: '`mkdir` makes the folder, `cd` moves into it, `touch` creates an empty file, `ls` shows `notes.txt`.' },
      { t: 'bug', topic: 'Python', q: 'This program crashes. Which line crashes?',
        code: ['marks = [70, 80, 90]', 'total = sum(marks)', 'print(marks[3])'], bad: 2,
        why: 'The list has 3 items at positions 0, 1 and 2. There is no position 3: `IndexError: list index out of range`. The last item is `marks[2]` or `marks[-1]`.' },
      { t: 'choice', topic: 'DevOps', q: 'In CI/CD, what does CI stand for?',
        a: 'Continuous Integration', w: ['Code Inspection', 'Cloud Infrastructure', 'Continuous Installation'],
        why: '**Continuous Integration**: every code change is merged often and tested automatically. CD is Continuous Delivery or Deployment.' }
    ] },
    { cards: [
      { t: 'output', topic: 'Python', code: 'items = ["a", "b", "c"]\nprint(items[-2])', a: 'b', w: ['c', 'a', 'IndexError'],
        why: 'Negative positions count from the end: `-1` is `c`, `-2` is `b`.' },
      { t: 'choice', topic: 'Data', q: 'Which file format stores data by column and is best for big analytics tables?',
        a: 'Parquet', w: ['CSV', 'TXT', 'JSON'],
        why: '**Parquet** is columnar and compressed, so a query that needs 2 columns reads only those 2. CSV and JSON store row by row as plain text.' },
      { t: 'order', topic: 'Docker', q: 'Order the steps to run your app in a Docker container.',
        items: ['Write a Dockerfile', 'docker build -t myapp .', 'docker run -p 8080:80 myapp', 'Open the app in the browser'],
        why: 'The **Dockerfile** is the recipe, `docker build` makes an image from it, and `docker run` starts a container from that image.' },
      { t: 'bug', topic: 'Python', q: 'Python says IndentationError. Which line is wrong?',
        code: ['score = 80', 'if score > 50:', 'print("Pass")'], bad: 2,
        why: 'The line after `if ...:` must be indented (4 spaces): `    print("Pass")`. Python uses spaces to know what is inside the `if`.' },
      { t: 'choice', topic: 'SQL', q: 'Which SQL keyword keeps only the rows that match a condition?',
        a: 'WHERE', w: ['ORDER BY', 'SELECT', 'GROUP BY'],
        why: '`WHERE` filters rows, e.g. `SELECT * FROM orders WHERE amount > 500`. `ORDER BY` sorts, `GROUP BY` makes groups.' }
    ] },
    { cards: [
      { t: 'output', topic: 'Python', code: 'print(10 == 10.0)', a: 'True', w: ['False', 'Error', '10'],
        why: '`==` compares values. 10 and 10.0 are the same number, so `True`, even though one is an int and one is a float.' },
      { t: 'choice', topic: 'Azure', q: 'Which Azure service runs a small piece of code only when something happens, like a file upload, and charges only for that run?',
        a: 'Azure Functions', w: ['Azure Virtual Machines', 'Azure SQL Database', 'Power BI'],
        why: '**Azure Functions** is serverless: no server to manage, it wakes up on an event and you pay per run. A VM runs (and costs) all the time.' },
      { t: 'order', topic: 'Data', q: 'Order a simple Azure data pipeline from start to finish.',
        items: ['Ingest: Data Factory', 'Store: Data Lake', 'Transform: Databricks', 'Show: Power BI'],
        why: 'Collect the data, store it, clean and shape it, then show it in reports. You can practise this in the **Build the Data Pipeline** game.' },
      { t: 'bug', topic: 'Python', q: 'This program crashes with a TypeError. Which line crashes?',
        code: ['def greet(name):', '    return "Hi " + name', 'print(greet())'], bad: 2,
        why: '`greet` needs one value for `name`, but the call gives none: `TypeError: greet() missing 1 required positional argument: \'name\'`. Fix: `greet("Asha")`.' },
      { t: 'choice', topic: 'Git', q: 'Which command downloads a full copy of a GitHub repository to your computer?',
        a: 'git clone', w: ['git push', 'git commit', 'git init'],
        why: '`git clone <url>` copies the repository and its history. `git init` starts a new empty one; `push` uploads.' }
    ] },
    { cards: [
      { t: 'output', topic: 'Python', code: 'for i in range(2, 8, 2):\n    print(i)', a: '2\n4\n6', w: ['2\n4\n6\n8', '2\n3\n4\n5\n6\n7', '4\n6\n8'],
        why: '`range(start, stop, step)`: start at 2, jump by 2, stop **before** 8. So 2, 4, 6.' },
      { t: 'choice', topic: 'Ansible', q: 'You run the same playbook twice. The second run shows changed=0. What is this good property called?',
        a: 'Idempotency', w: ['Inventory', 'Templating', 'Encryption'],
        why: '**Idempotent** means running it again changes nothing if the server is already right. That makes automation safe to repeat.' },
      { t: 'order', topic: 'DevOps', q: 'A user reports a bug. Order the steps a professional follows.',
        items: ['Reproduce the bug', 'Find the cause', 'Fix the code', 'Test again'],
        why: 'First make the bug happen yourself, then find **why** it happens, fix it, and test that it is really fixed (and nothing else broke).' },
      { t: 'bug', topic: 'Python', q: 'This program crashes with a KeyError. Which line crashes?',
        code: ['ages = {"Asha": 21}', 'ages["Ravi"] = 25', 'print(ages["Kiran"])'], bad: 2,
        why: 'Adding a key with `ages["Ravi"] = 25` is fine. Reading a missing key crashes: `KeyError: \'Kiran\'`. Safe way: `ages.get("Kiran", 0)`.' },
      { t: 'choice', topic: 'Azure', q: 'In Azure, what groups the resources of one project (VM, disk, network) so you can manage or delete them together?',
        a: 'Resource group', w: ['Management group', 'Tenant', 'Region'],
        why: 'A **resource group** is a folder for related resources. Delete the group and everything in it goes. Management groups sit higher and hold subscriptions.' }
    ] },
    { cards: [
      { t: 'output', topic: 'Python', code: 'words = ["hi", "there"]\nprint(" ".join(words).upper())', a: 'HI THERE', w: ['hi there', 'HITHERE', "['HI', 'THERE']"],
        why: '`" ".join(words)` joins the list with a space: `hi there`. Then `.upper()` makes it capitals.' },
      { t: 'choice', topic: 'SQL', q: 'Which query counts the rows in a table called orders?',
        a: 'SELECT COUNT(*) FROM orders;', w: ['SELECT SUM(orders);', 'COUNT orders;', 'SELECT * FROM COUNT(orders);'],
        why: '`COUNT(*)` counts rows. The pattern is always `SELECT <what> FROM <table>`.' },
      { t: 'order', topic: 'Azure', q: 'Order Azure’s levels from the biggest container to a single resource.',
        items: ['Management group', 'Subscription', 'Resource group', 'Resource (e.g. a VM)'],
        why: 'Management groups hold subscriptions, a subscription holds resource groups (and gets the bill), and resource groups hold the actual resources.' },
      { t: 'bug', topic: 'Python', q: 'This program crashes with a NameError. Which line crashes?',
        code: ['total = 0', 'for n in range(5):', '    total = total + m', 'print(total)'], bad: 2,
        why: 'A typo: the loop variable is `n`, but the line uses `m`, which was never created: `NameError: name \'m\' is not defined`.' },
      { t: 'choice', topic: 'Docker', q: 'What is a Docker image?',
        a: 'A packaged template with the app and everything it needs to run', w: ['A running server', 'A screenshot of the app', 'A backup of a database'],
        why: 'An **image** is the package (code, libraries, settings). A **container** is a running copy of that image.' }
    ] }
  ]
};
