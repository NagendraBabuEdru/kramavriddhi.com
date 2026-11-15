/* Learn by Playing: skill tracks (Phase 1). Source of truth for the feed at /learn/daily/.
   Track -> units (in teaching order, level b/i/a) -> cards. Card IDs (e.g. py.b.03.2) must NEVER change once published:
   only append new cards to the end of a unit. Card types: learn, output, choice, order, bug, pipe, indent (see app.js).
   A unit with no cards shows as "coming soon". Plan and status: learn/_TRACKER.md */
window.KV_TRACKS = {
  goal: 6,
  levels: [{"id":"b","name":"Basic"},{"id":"i","name":"Intermediate"},{"id":"a","name":"Advanced"}],
  tracks: [
    { id: "py", name: "Python", topic: "Python", blurb: "From your first line of code to classes, testing and pandas.", units: [
      { id: "py.b.01", level: "b", n: 1, title: "Print and variables", cards: [
        {"t":"learn","topic":"Python","title":"Variables hold values","body":"A **variable** is a name for a value. `=` stores the value on the right in the name on the left, and `print()` shows values on screen. Names are **case-sensitive**: `name` and `Name` are different.","code":"name = \"Asha\"\nage = 21\nprint(name, age)    # Asha 21","lang":"python","id":"py.b.01.1"},
        {"t":"bug","topic":"Python","q":"This program crashes with a NameError. Which line crashes?","code":["name = \"Ravi\"","greeting = \"Hello \"","print(greeting + Name)"],"bad":2,"why":"Python is **case-sensitive**: `name` and `Name` are different. `Name` was never created: `NameError: name 'Name' is not defined`.","id":"py.b.01.2"}
      ] },
      { id: "py.b.02", level: "b", n: 2, title: "Numbers and maths", cards: [
        {"t":"learn","topic":"Python","title":"Python does maths","body":"`+`, `-` and `*` work as usual. `/` always gives a decimal (a float). `//` drops the decimal part, `%` gives the remainder and `**` is power. `round(x, 1)` keeps 1 decimal.","code":"print(7 / 2)     # 3.5\nprint(7 // 2)    # 3\nprint(7 % 2)     # 1\nprint(2 ** 3)    # 8","lang":"python","id":"py.b.02.1"},
        {"t":"output","topic":"Python","code":"x = 10\nx += 5\nprint(x // 4)","a":"3","w":["3.75","4","15"],"why":"`x += 5` makes x 15. `//` is floor division: 15 ÷ 4 = 3.75, and `//` drops the decimal part, so `3`.","id":"py.b.02.2"},
        {"t":"output","topic":"Python","code":"print(10 == 10.0)","a":"True","w":["False","Error","10"],"why":"`==` compares values. 10 and 10.0 are the same number, so `True`, even though one is an int and one is a float.","id":"py.b.02.3"},
        {"t":"output","topic":"Python","code":"x = [1, 2, 3]\nprint(sum(x) / len(x))","a":"2.0","w":["2","6","3"],"why":"`sum(x)` is 6 and `len(x)` is 3. `/` always gives a float, so 6 / 3 is `2.0`, not `2`.","id":"py.b.02.4"},
        {"t":"output","topic":"Python","code":"print(round(7.567, 1))","a":"7.6","w":["7.5","8","7.57"],"why":"`round(number, 1)` keeps 1 digit after the point. 7.567 rounds up to `7.6`.","id":"py.b.02.5"}
      ] },
      { id: "py.b.03", level: "b", n: 3, title: "Strings", cards: [
        {"t":"learn","topic":"Python","title":"Text is a string","body":"Text goes in quotes. Positions start at **0**, and `-1` is the last letter. A slice `s[a:b]` stops **before** `b`. `len()` counts letters, `+` joins text and `*` repeats it.","code":"word = \"Python\"\nprint(word[0], word[-1])   # P n\nprint(word[0:2])           # Py\nprint(\"ab\" * 3)            # ababab","lang":"python","id":"py.b.03.1"},
        {"t":"output","topic":"Python","code":"print(len(\"data\") * 2)","a":"8","w":["datadata","4","16"],"why":"`len(\"data\")` counts the letters: 4. Then `4 * 2` is `8`. Python works from the inside out.","id":"py.b.03.2"},
        {"t":"output","topic":"Python","code":"print(\"Azure\"[1:4])","a":"zur","w":["Azu","zure","zu"],"why":"Positions start at 0: A=0, z=1, u=2, r=3, e=4. `[1:4]` takes 1, 2 and 3 (the end is not included): `zur`.","id":"py.b.03.3"},
        {"t":"output","topic":"Python","code":"words = [\"hi\", \"there\"]\nprint(\" \".join(words).upper())","a":"HI THERE","w":["hi there","HITHERE","['HI', 'THERE']"],"why":"`\" \".join(words)` joins the list with a space: `hi there`. Then `.upper()` makes it capitals.","id":"py.b.03.4"},
        {"t":"output","topic":"Python","code":"print(3 * \"ab\")","a":"ababab","w":["3ab","ab ab ab","TypeError"],"why":"A number times text **repeats** the text: `3 * \"ab\"` is `ababab`, with no spaces.","id":"py.b.03.5"}
      ] },
      { id: "py.b.04", level: "b", n: 4, title: "Input and type conversion", cards: [
        {"t":"learn","topic":"Python","title":"Text or number?","body":"`\"25\"` in quotes is **text**; `25` is a **number**. Text + number crashes with `TypeError`. Convert with `int()`, `float()` or `str()`. Note: `input()` always gives you text.","code":"age = \"25\"            # text, like input() gives\nprint(int(age) + 1)   # 26","lang":"python","id":"py.b.04.1"},
        {"t":"bug","topic":"Python","q":"This program crashes with a TypeError. Which line crashes?","code":["age = \"25\"","next_year = age + 1","print(next_year)"],"bad":1,"why":"`age` is text (it has quotes). Text + number is not allowed: `TypeError: can only concatenate str (not \"int\") to str`. Fix: `int(age) + 1`.","id":"py.b.04.2"},
        {"t":"output","topic":"Python","code":"print(\"10\" + \"5\")","a":"105","w":["15","10 5","TypeError"],"why":"Both are text (in quotes), so `+` **joins** them: `105`. For maths, convert first: `int(\"10\") + int(\"5\")` is 15.","id":"py.b.04.3"},
        {"t":"bug","topic":"Python","q":"This program crashes with a ValueError. Which line crashes?","code":["text = \"12a\"","num = int(text)","print(num + 1)"],"bad":1,"why":"`int()` can only turn digits into a number. `\"12a\"` has a letter: `ValueError: invalid literal for int() with base 10: '12a'`.","id":"py.b.04.4"}
      ] },
      { id: "py.b.05", level: "b", n: 5, title: "if / elif / else", cards: [
        {"t":"learn","topic":"Python","title":"Making decisions","body":"`if` runs its block only when the condition is True. `elif` checks another condition and `else` catches the rest. Each block is indented 4 spaces. `and` needs both sides True; `or` needs one.","code":"marks = 72\nif marks >= 75:\n    print(\"Distinction\")\nelif marks >= 35:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")","lang":"python","id":"py.b.05.1"},
        {"t":"bug","topic":"Python","q":"Python says IndentationError. Which line is wrong?","code":["score = 80","if score > 50:","print(\"Pass\")"],"bad":2,"why":"The line after `if ...:` must be indented (4 spaces): `    print(\"Pass\")`. Python uses spaces to know what is inside the `if`.","id":"py.b.05.2"},
        {"t":"output","topic":"Python","code":"a = 5\nb = 2\nprint(a > b and b > 3)","a":"False","w":["True","2","Error"],"why":"`and` is True only if **both** sides are True. `5 > 2` is True, but `2 > 3` is False, so the result is `False`.","id":"py.b.05.3"},
        {"t":"indent","topic":"Python","step":4,"q":"Fix the indentation so a temperature above 37 prints Fever.","lines":[[0,"temp = 38"],[0,"if temp > 37:"],[4,"print(\"Fever\")"],[0,"else:"],[4,"print(\"Normal\")"]],"why":"`else:` lines up with its `if` (0 spaces). The line under each one is indented 4 spaces. 38 is above 37, so it prints `Fever`.","id":"py.b.05.4"}
      ] },
      { id: "py.b.06", level: "b", n: 6, title: "Lists", cards: [
        {"t":"learn","topic":"Python","title":"Lists hold many values","body":"A **list** keeps items in order: `[70, 80, 90]`. Positions start at 0 and `-1` is the last. `.append()` adds to the end, `len()` counts items and `sorted()` gives a new sorted list.","code":"marks = [70, 80, 90]\nmarks.append(65)\nprint(marks[0], marks[-1], len(marks))   # 70 65 4","lang":"python","id":"py.b.06.1"},
        {"t":"bug","topic":"Python","q":"This program crashes. Which line crashes?","code":["marks = [70, 80, 90]","total = sum(marks)","print(marks[3])"],"bad":2,"why":"The list has 3 items at positions 0, 1 and 2. There is no position 3: `IndexError: list index out of range`. The last item is `marks[2]` or `marks[-1]`.","id":"py.b.06.2"},
        {"t":"output","topic":"Python","code":"items = [\"a\", \"b\", \"c\"]\nprint(items[-2])","a":"b","w":["c","a","IndexError"],"why":"Negative positions count from the end: `-1` is `c`, `-2` is `b`.","id":"py.b.06.3"},
        {"t":"output","topic":"Python","code":"nums = [3, 1, 2]\nprint(sorted(nums), nums)","a":"[1, 2, 3] [3, 1, 2]","w":["[1, 2, 3] [1, 2, 3]","None [1, 2, 3]","[3, 2, 1] [3, 1, 2]"],"why":"`sorted()` returns a **new** sorted list and leaves the original alone. `nums.sort()` would change `nums` itself.","id":"py.b.06.4"},
        {"t":"output","topic":"Python","code":"print(len([1, [2, 3], 4]))","a":"3","w":["4","2","Error"],"why":"The list has 3 items: `1`, the inner list `[2, 3]`, and `4`. `len()` does not look inside the inner list.","id":"py.b.06.5"}
      ] },
      { id: "py.b.07", level: "b", n: 7, title: "for loops and range", cards: [
        {"t":"learn","topic":"Python","title":"Repeat with for","body":"`for x in items:` runs the indented block once for each item. `range(5)` is 0 to 4, `range(1, 5)` is 1 to 4, and `range(2, 8, 2)` jumps by 2. Only the indented lines repeat.","code":"total = 0\nfor n in range(1, 4):\n    total = total + n\nprint(total)    # 6","lang":"python","id":"py.b.07.1"},
        {"t":"bug","topic":"Python","q":"This program will not run. Which line has the mistake?","code":["nums = [3, 5, 7]","for n in nums","    print(n * 2)"],"bad":1,"why":"A `for` line must end with a colon `:`. Python says `SyntaxError: expected ':'`. Fixed: `for n in nums:`","id":"py.b.07.2"},
        {"t":"output","topic":"Python","code":"for i in range(2, 8, 2):\n    print(i)","a":"2\n4\n6","w":["2\n4\n6\n8","2\n3\n4\n5\n6\n7","4\n6\n8"],"why":"`range(start, stop, step)`: start at 2, jump by 2, stop **before** 8. So 2, 4, 6.","id":"py.b.07.3"},
        {"t":"bug","topic":"Python","q":"This program crashes with a NameError. Which line crashes?","code":["total = 0","for n in range(5):","    total = total + m","print(total)"],"bad":2,"why":"A typo: the loop variable is `n`, but the line uses `m`, which was never created: `NameError: name 'm' is not defined`.","id":"py.b.07.4"},
        {"t":"bug","topic":"Python","q":"This program prints 3 numbers and then crashes with IndexError. Which line crashes?","code":["nums = [5, 10, 15]","for i in range(4):","    print(nums[i])"],"bad":2,"why":"The crash happens at `print(nums[i])` when `i` is 3. The real cause is `range(4)`: the list has only 3 items. Better: `for n in nums:`.","id":"py.b.07.5"},
        {"t":"bug","topic":"Python","q":"This program crashes with a NameError. Which line crashes?","code":["scores = [80, 90]","total = 0","for s in scores:","    total += s","print(\"Average:\", total / len(score))"],"bad":4,"why":"A typo: the list is `scores`, but the last line says `score`. `NameError: name 'score' is not defined`.","id":"py.b.07.6"},
        {"t":"indent","topic":"Python","step":4,"q":"Make this loop print 10, 20, 30 and then done.","lines":[[0,"nums = [1, 2, 3]"],[0,"for n in nums:"],[4,"print(n * 10)"],[0,"print(\"done\")"]],"why":"Only `print(n * 10)` is inside the loop (4 spaces), so it runs 3 times. `print(\"done\")` is back at 0 spaces, so it runs once at the end.","id":"py.b.07.7"},
        {"t":"indent","topic":"Python","step":4,"q":"Fix the indentation so it prints only the even numbers from 1 to 5.","lines":[[0,"for n in range(1, 6):"],[4,"if n % 2 == 0:"],[8,"print(n, \"is even\")"]],"why":"The `if` is inside the loop (4 spaces), and the `print` is inside the `if` (8 spaces). It prints `2 is even` and `4 is even`.","id":"py.b.07.8"}
      ] },
      { id: "py.b.08", level: "b", n: 8, title: "while loops", cards: [
        {"t":"learn","topic":"Python","title":"Repeat while True","body":"`while condition:` repeats as long as the condition stays True. Something inside the loop must change, or it never stops. The line ends with a colon, like `if` and `for`.","code":"count = 0\nwhile count < 3:\n    print(count)\n    count = count + 1","lang":"python","id":"py.b.08.1"},
        {"t":"bug","topic":"Python","q":"Python will not run this. Which line has the mistake?","code":["count = 0","while count < 3","    count = count + 1"],"bad":1,"why":"Like `if` and `for`, a `while` line must end with a colon: `while count < 3:`. Python says `SyntaxError: expected ':'`.","id":"py.b.08.2"}
      ] },
      { id: "py.b.09", level: "b", n: 9, title: "Functions", cards: [
        {"t":"learn","topic":"Python","title":"Functions: reusable blocks","body":"`def name(params):` creates a function; its body is indented. It runs only when you **call** it, and the call must give every required value. `return` sends a value back.","code":"def area(w, h):\n    return w * h\n\nprint(area(3, 4))    # 12","lang":"python","id":"py.b.09.1"},
        {"t":"bug","topic":"Python","q":"This program crashes with a TypeError. Which line crashes?","code":["def greet(name):","    return \"Hi \" + name","print(greet())"],"bad":2,"why":"`greet` needs one value for `name`, but the call gives none: `TypeError: greet() missing 1 required positional argument: 'name'`. Fix: `greet(\"Asha\")`.","id":"py.b.09.2"},
        {"t":"bug","topic":"Python","q":"Python says IndentationError. Which line is wrong?","code":["def greet(name):","print(\"Hi\", name)","greet(\"Asha\")"],"bad":1,"why":"The body of a function must be indented: `    print(\"Hi\", name)`. Without the spaces Python does not know it belongs to `greet`.","id":"py.b.09.3"},
        {"t":"indent","topic":"Python","step":4,"q":"Fix this function so the program prints 12.","lines":[[0,"def area(w, h):"],[4,"result = w * h"],[4,"return result"],[0,"print(area(3, 4))"]],"why":"The function body (`result = ...` and `return`) is indented 4 spaces under `def`. The call `print(area(3, 4))` is outside, at 0 spaces: 3 × 4 = 12.","id":"py.b.09.4"}
      ] },
      { id: "py.b.10", level: "b", n: 10, title: "Dictionaries", cards: [
        {"t":"learn","topic":"Python","title":"Look up by key","body":"A **dictionary** maps keys to values: `{\"Asha\": 21}`. `d[key]` reads a value but crashes if the key is missing; `d.get(key, 0)` is safe. `d[key] = value` adds or changes. `.items()` gives key and value pairs.","code":"ages = {\"Asha\": 21}\nages[\"Ravi\"] = 25\nprint(ages.get(\"Kiran\", 0))    # 0","lang":"python","id":"py.b.10.1"},
        {"t":"bug","topic":"Python","q":"This program crashes with a KeyError. Which line crashes?","code":["ages = {\"Asha\": 21}","ages[\"Ravi\"] = 25","print(ages[\"Kiran\"])"],"bad":2,"why":"Adding a key with `ages[\"Ravi\"] = 25` is fine. Reading a missing key crashes: `KeyError: 'Kiran'`. Safe way: `ages.get(\"Kiran\", 0)`.","id":"py.b.10.2"},
        {"t":"bug","topic":"Python","q":"This program crashes with an AttributeError. Which line crashes?","code":["marks = {\"maths\": 90}","marks.append(\"science\")","print(marks)"],"bad":1,"why":"`marks` is a dictionary, and dictionaries have no `.append()`. Add a key instead: `marks[\"science\"] = 85`.","id":"py.b.10.3"},
        {"t":"indent","topic":"Python","step":4,"q":"Fix the indentation so it prints only the items that cost more than 15.","lines":[[0,"prices = {\"tea\": 10, \"coffee\": 20}"],[0,"for item, cost in prices.items():"],[4,"if cost > 15:"],[8,"print(item)"]],"why":"`.items()` gives each key and value. The `if` is inside the loop and the `print` inside the `if`, so only `coffee` is printed.","id":"py.b.10.4"}
      ] },
      { id: "py.i.11", level: "i", n: 11, title: "Tuples and sets", cards: [] },
      { id: "py.i.12", level: "i", n: 12, title: "String methods and f-strings", cards: [] },
      { id: "py.i.13", level: "i", n: 13, title: "Errors and try/except", cards: [
        {"t":"learn","topic":"Python","title":"Reading error messages","body":"When Python crashes it prints a **traceback**. The last line names the error (`NameError`, `TypeError`...) and the line numbers show where. `try:` with `except:` lets you handle an error instead of crashing.","code":"try:\n    num = int(\"12a\")\nexcept ValueError:\n    print(\"Not a number\")","lang":"python","id":"py.i.13.1"},
        {"t":"order","topic":"Python","q":"Your program crashed. Order the steps to read the error and fix it.","items":["Read the last line: error type and message","Find the line number in the traceback","Look at that line and the lines before it","Fix it, then run again"],"why":"The **last line** of a traceback says what went wrong; the line numbers above it say where. Most bugs are on that line or just before it.","id":"py.i.13.2"}
      ] },
      { id: "py.i.14", level: "i", n: 14, title: "Files (with open)", cards: [
        {"t":"learn","topic":"Python","title":"Files with open","body":"`open()` opens a file. Use it in a `with` block so Python closes the file for you. Mode `\"r\"` reads, `\"w\"` writes (replacing the file) and `\"a\"` adds to the end.","code":"with open(\"notes.txt\", \"w\") as f:\n    f.write(\"hello\")","lang":"python","id":"py.i.14.1"},
        {"t":"choice","topic":"Python","q":"Which line opens a file so that Python closes it automatically?","a":"with open(\"data.txt\") as f:","w":["open(\"data.txt\").close(f)","f = close(\"data.txt\")","import file(\"data.txt\")"],"why":"A `with` block closes the file for you when the block ends, even if an error happens inside.","id":"py.i.14.2"}
      ] },
      { id: "py.i.15", level: "i", n: 15, title: "Modules and pip", cards: [] },
      { id: "py.i.16", level: "i", n: 16, title: "List comprehensions", cards: [] },
      { id: "py.i.17", level: "i", n: 17, title: "Default args, *args, **kwargs", cards: [] },
      { id: "py.i.18", level: "i", n: 18, title: "Classes and objects", cards: [] },
      { id: "py.i.19", level: "i", n: 19, title: "Virtual environments", cards: [] },
      { id: "py.i.20", level: "i", n: 20, title: "JSON and CSV", cards: [] },
      { id: "py.a.21", level: "a", n: 21, title: "Iterators and generators", cards: [] },
      { id: "py.a.22", level: "a", n: 22, title: "Decorators", cards: [] },
      { id: "py.a.23", level: "a", n: 23, title: "Context managers", cards: [] },
      { id: "py.a.24", level: "a", n: 24, title: "Type hints", cards: [] },
      { id: "py.a.25", level: "a", n: 25, title: "Testing with pytest", cards: [] },
      { id: "py.a.26", level: "a", n: 26, title: "Async basics", cards: [] },
      { id: "py.a.27", level: "a", n: 27, title: "pandas for data", cards: [] },
      { id: "py.a.28", level: "a", n: 28, title: "Project structure and packaging", cards: [] }
    ] },
    { id: "az", name: "Azure Data Engineering", topic: "Azure", blurb: "Storage, Data Factory, Databricks, streaming and Fabric, step by step.", units: [
      { id: "az.b.01", level: "b", n: 1, title: "Cloud basics and the Azure hierarchy", cards: [
        {"t":"learn","topic":"Azure","title":"How Azure is organised","body":"**Management groups** hold **subscriptions** (where billing happens). A subscription holds **resource groups**, and each resource group holds resources like VMs, storage and databases. Serverless services like **Azure Functions** run, and cost, only when something triggers them.","id":"az.b.01.1"},
        {"t":"choice","topic":"Azure","q":"Which Azure service runs a small piece of code only when something happens, like a file upload, and charges only for that run?","a":"Azure Functions","w":["Azure Virtual Machines","Azure SQL Database","Power BI"],"why":"**Azure Functions** is serverless: no server to manage, it wakes up on an event and you pay per run. A VM runs (and costs) all the time.","id":"az.b.01.2"},
        {"t":"choice","topic":"Azure","q":"In Azure, what groups the resources of one project (VM, disk, network) so you can manage or delete them together?","a":"Resource group","w":["Management group","Tenant","Region"],"why":"A **resource group** is a folder for related resources. Delete the group and everything in it goes. Management groups sit higher and hold subscriptions.","id":"az.b.01.3"},
        {"t":"order","topic":"Azure","q":"Order Azure’s levels from the biggest container to a single resource.","items":["Management group","Subscription","Resource group","Resource (e.g. a VM)"],"why":"Management groups hold subscriptions, a subscription holds resource groups (and gets the bill), and resource groups hold the actual resources.","id":"az.b.01.4"}
      ] },
      { id: "az.b.02", level: "b", n: 2, title: "Storage accounts and tiers", cards: [
        {"t":"learn","topic":"Azure","title":"Pay less for cold data","body":"Blob storage has **access tiers**: **Hot** for data used every day, **Cool** and **Cold** for data used now and then, and **Archive** for data you almost never read: cheapest to keep, but slow and costly to read back.","id":"az.b.02.1"},
        {"t":"choice","topic":"Azure","q":"Which storage tier is the cheapest for files you almost never read, like 7-year-old backups?","a":"Archive","w":["Hot","Cool","Premium"],"why":"**Archive** is the cheapest to store but slow and costly to read back (hours). Hot is for daily use, Cool and Cold for occasional use.","id":"az.b.02.2"}
      ] },
      { id: "az.b.03", level: "b", n: 3, title: "Data Lake Gen2", cards: [
        {"t":"learn","topic":"Azure","title":"The data lake","body":"**Azure Data Lake Storage Gen2** is storage built for analytics: cheap, huge, with real folders and permissions. Raw files of any format (CSV, JSON, Parquet) usually land here first.","id":"az.b.03.1"},
        {"t":"choice","topic":"Azure","q":"You must store millions of raw CSV and JSON files cheaply, ready for analytics. Which Azure service?","a":"Azure Data Lake Storage Gen2","w":["Azure SQL Database","Power BI","Azure Functions"],"why":"**Data Lake Storage Gen2** is cheap file storage built for big data. SQL Database is for tables, Power BI is for reports, Functions run code.","id":"az.b.03.2"}
      ] },
      { id: "az.b.04", level: "b", n: 4, title: "Data Factory pipelines", cards: [
        {"t":"learn","topic":"Azure","title":"Moving data with pipelines","body":"**Azure Data Factory** builds pipelines that copy and transform data on a schedule or trigger, from many sources into the lake or a database. The classic batch pattern is **ETL**: extract, transform, load.","id":"az.b.04.1"},
        {"t":"choice","topic":"Azure","q":"What is Azure Data Factory mainly used for?","a":"Moving data between systems on a schedule (pipelines)","w":["Drawing dashboards","Hosting websites","Training AI models"],"why":"**Data Factory** builds pipelines that copy and move data, for example from a database into a data lake every night.","id":"az.b.04.2"},
        {"t":"order","topic":"Azure","q":"Order a simple Azure data pipeline from start to finish.","items":["Ingest: Data Factory","Store: Data Lake","Transform: Databricks","Show: Power BI"],"why":"Collect the data, store it, clean and shape it, then show it in reports. You can practise this in the **Build the Data Pipeline** game.","id":"az.b.04.3"},
        {"t":"order","topic":"Azure","q":"ETL is a classic data job. Order its three steps.","items":["Extract: read data from the source","Transform: clean and change it","Load: write it to the target"],"why":"**E**xtract, **T**ransform, **L**oad. In modern lakes you also see ELT: load the raw data first, then transform it inside the lake.","id":"az.b.04.4"},
        {"t":"pipe","topic":"Azure","q":"Daily sales CSV files must reach a Power BI report every night. Build the pipeline.","steps":[["CSV","Sales CSV files","src"],["ADF","Data Factory"],["ADLS","Data Lake Storage"],["BI","Power BI"]],"extra":[["EH","Event Hubs"]],"why":"**Data Factory** copies the files each night, the **Data Lake** stores them, and **Power BI** shows the report. Event Hubs is for live streams, not nightly files.","id":"az.b.04.5"}
      ] },
      { id: "az.b.05", level: "b", n: 5, title: "Azure SQL basics", cards: [] },
      { id: "az.b.06", level: "b", n: 6, title: "Power BI basics", cards: [] },
      { id: "az.i.07", level: "i", n: 7, title: "Databricks and Spark", cards: [
        {"t":"learn","topic":"Azure","title":"Big data with Spark","body":"**Azure Databricks** runs Apache Spark: notebooks and jobs that clean, join and summarise huge data by splitting the work across many machines at once.","id":"az.i.07.1"},
        {"t":"choice","topic":"Azure","q":"Which Azure service is a managed Apache Spark platform for cleaning and transforming big data?","a":"Azure Databricks","w":["Azure Event Hubs","Azure Blob Storage","Azure Monitor"],"why":"**Databricks** runs Spark: notebooks and jobs that clean, join and transform large data. Event Hubs receives streams, Blob Storage stores files, Monitor collects logs.","id":"az.i.07.2"}
      ] },
      { id: "az.i.08", level: "i", n: 8, title: "Medallion and Delta Lake", cards: [
        {"t":"learn","topic":"Azure","title":"Bronze, silver, gold","body":"The **medallion** design keeps data in layers: **bronze** is raw, as it arrived; **silver** is cleaned and checked; **gold** is shaped for reports. **Delta Lake** tables add safe updates and history on top of the lake.","id":"az.i.08.1"},
        {"t":"order","topic":"Azure","q":"Medallion architecture: order the layers from raw data to report-ready data.","items":["Bronze: raw data, as it arrived","Silver: cleaned and joined","Gold: ready for reports"],"why":"Data gets better at each step: **bronze** keeps the raw copy, **silver** cleans it, **gold** shapes it for business reports.","id":"az.i.08.2"},
        {"t":"order","topic":"Azure","q":"A new file arrives in bronze. Order the data quality steps.","items":["Load the new file","Check row counts and empty values","Fix or reject the bad rows","Write clean data to silver"],"why":"Check data **before** it moves on. Bad rows that reach gold end up in wrong reports and bad decisions.","id":"az.i.08.3"},
        {"t":"pipe","topic":"Azure","q":"Build a medallion pipeline: from the company database to report-ready gold data.","steps":[["ERP","Company database","src"],["ADF","Data Factory"],["B","Bronze: raw","bronze"],["S","Silver: clean","silver"],["G","Gold: ready","gold"]],"extra":[["EH","Event Hubs"]],"why":"**Data Factory** copies the database into **bronze**. Then the data is cleaned into **silver** and shaped for reports in **gold**.","id":"az.i.08.4"}
      ] },
      { id: "az.i.09", level: "i", n: 9, title: "Synapse", cards: [] },
      { id: "az.i.10", level: "i", n: 10, title: "Event Hubs and Stream Analytics", cards: [
        {"t":"learn","topic":"Azure","title":"Live data streams","body":"**Event Hubs** receives millions of events per second from apps, sensors or payments. **Stream Analytics** runs SQL-like queries on the stream as it flows and sends results to Power BI, storage or Functions.","id":"az.i.10.1"},
        {"t":"choice","topic":"Azure","q":"An app sends millions of live events every second. Which service should receive them?","a":"Azure Event Hubs","w":["Azure Data Factory","Azure Synapse Analytics","Power BI"],"why":"**Event Hubs** takes in huge streams of live events. Data Factory moves data in batches on a schedule; Synapse and Power BI come later in the pipeline.","id":"az.i.10.2"},
        {"t":"pipe","topic":"Azure","q":"Temperature sensors send readings every second. Show them live on a dashboard.","steps":[["IoT","Sensors","src"],["EH","Event Hubs"],["ASA","Stream Analytics"],["BI","Power BI"]],"extra":[["ADF","Data Factory"]],"why":"Live data needs streaming services: **Event Hubs** receives the readings, **Stream Analytics** calculates averages as they arrive, and **Power BI** shows them live.","id":"az.i.10.3"},
        {"t":"pipe","topic":"Azure","q":"Card payments must be checked live, and a fraud alert sent within seconds. Build the pipeline.","steps":[["PAY","Card payments","src"],["EH","Event Hubs"],["ASA","Stream Analytics"],["FN","Functions: send alert"]],"extra":[["ADF","Data Factory"]],"why":"**Event Hubs** receives each payment, **Stream Analytics** spots suspicious patterns in real time, and an **Azure Function** sends the alert. Data Factory runs batches, too slow here.","id":"az.i.10.4"}
      ] },
      { id: "az.i.11", level: "i", n: 11, title: "Key Vault and security", cards: [
        {"t":"learn","topic":"Azure","title":"Keep secrets out of code","body":"**Azure Key Vault** stores passwords, keys and certificates. Apps and pipelines read them at run time using their own identity, so no secret ever sits in your code or on GitHub.","id":"az.i.11.1"},
        {"t":"choice","topic":"Azure","q":"Which Azure service keeps passwords, keys and certificates safe, so they are not written in your code?","a":"Azure Key Vault","w":["Azure Blob Storage","Azure Monitor","Azure DevOps Boards"],"why":"**Key Vault** stores secrets securely. Your app or pipeline reads them at run time, so no password sits in the code or on GitHub.","id":"az.i.11.2"}
      ] },
      { id: "az.i.12", level: "i", n: 12, title: "Parquet and partitioning", cards: [
        {"t":"learn","topic":"Azure","title":"Columnar files","body":"**Parquet** stores data column by column, compressed, so a query reads only the columns it needs. Splitting files into folders by date (**partitioning**) lets queries skip whole folders.","id":"az.i.12.1"},
        {"t":"choice","topic":"Azure","q":"Which file format stores data by column and is best for big analytics tables?","a":"Parquet","w":["CSV","TXT","JSON"],"why":"**Parquet** is columnar and compressed, so a query that needs 2 columns reads only those 2. CSV and JSON store row by row as plain text.","id":"az.i.12.2"}
      ] },
      { id: "az.a.13", level: "a", n: 13, title: "Microsoft Fabric", cards: [] },
      { id: "az.a.14", level: "a", n: 14, title: "Governance and Unity Catalog", cards: [] },
      { id: "az.a.15", level: "a", n: 15, title: "CI/CD for data", cards: [] },
      { id: "az.a.16", level: "a", n: 16, title: "Bicep (infrastructure as code)", cards: [
        {"t":"learn","topic":"Azure","title":"Infrastructure as code","body":"Instead of clicking in the portal, describe your resources in a **Bicep** file and deploy it. The same file creates the same setup every time, and it lives in Git like any other code.","id":"az.a.16.1"},
        {"t":"choice","topic":"Azure","q":"Which Azure language lets you write your infrastructure as code, so the same setup can be created again and again?","a":"Bicep","w":["Power BI","Excel","Azure Key Vault"],"why":"**Bicep** files describe resources (storage, networks, VMs). Deploy the file and Azure creates them, the same way every time. Terraform does the same across clouds.","id":"az.a.16.2"}
      ] },
      { id: "az.a.17", level: "a", n: 17, title: "Cost optimisation", cards: [] },
      { id: "az.a.18", level: "a", n: 18, title: "Monitoring", cards: [] }
    ] },
    { id: "git", name: "Git", topic: "Git", blurb: "Save, share and review code like a professional team.", units: [
      { id: "git.b.01", level: "b", n: 1, title: "What Git is", cards: [] },
      { id: "git.b.02", level: "b", n: 2, title: "init, clone, add, commit", cards: [
        {"t":"learn","topic":"Git","title":"Saving work with Git","body":"`git clone` copies a repository to your computer. After editing, `git add` picks the changes and `git commit -m \"message\"` saves a snapshot with a note about what changed.","code":"git clone https://github.com/user/project.git\ngit add main.py\ngit commit -m \"Fix bug\"","lang":"shell","id":"git.b.02.1"},
        {"t":"choice","topic":"Git","q":"Which command downloads a full copy of a GitHub repository to your computer?","a":"git clone","w":["git push","git commit","git init"],"why":"`git clone <url>` copies the repository and its history. `git init` starts a new empty one; `push` uploads.","id":"git.b.02.2"}
      ] },
      { id: "git.b.03", level: "b", n: 3, title: "status, log, diff", cards: [] },
      { id: "git.b.04", level: "b", n: 4, title: "push and pull", cards: [
        {"t":"learn","topic":"Git","title":"Sharing with GitHub","body":"`git push` uploads your commits to GitHub. `git pull` downloads other people's commits and merges them into your branch. Pull before you start work to stay up to date.","id":"git.b.04.1"},
        {"t":"order","topic":"Git","q":"Put the steps in order to save a code change and share it on GitHub.","items":["Edit the file","git add main.py","git commit -m \"Fix bug\"","git push"],"why":"`git add` picks the changes, `git commit` saves them with a message on your computer, and `git push` sends them to GitHub.","id":"git.b.04.2"},
        {"t":"choice","topic":"Git","q":"What does git pull do?","a":"Downloads new commits from GitHub and merges them into your branch","w":["Uploads your commits to GitHub","Deletes your branch","Creates a new repository"],"why":"`git pull` brings your copy up to date with others’ work. `git push` is the opposite: it uploads your commits.","id":"git.b.04.3"}
      ] },
      { id: "git.i.05", level: "i", n: 5, title: "Branches", cards: [
        {"t":"learn","topic":"Git","title":"Branches","body":"A **branch** is your own line of work. Create one with `git switch -c new-feature`, commit there, and `main` stays safe until you merge.","id":"git.i.05.1"},
        {"t":"choice","topic":"Git","q":"You want to build a new feature without touching the main code yet. What should you create?","a":"A new branch","w":["A new repository","A tag","A merge conflict"],"why":"A **branch** is your own line of work. When the feature is ready and reviewed, you merge it into `main`.","id":"git.i.05.2"}
      ] },
      { id: "git.i.06", level: "i", n: 6, title: "Merge", cards: [] },
      { id: "git.i.07", level: "i", n: 7, title: "Merge conflicts", cards: [] },
      { id: "git.i.08", level: "i", n: 8, title: "Pull requests", cards: [
        {"t":"learn","topic":"Git","title":"Pull requests","body":"A **pull request** asks to merge your branch into `main`. Teammates review the changes, automated tests run, and then it is merged.","id":"git.i.08.1"},
        {"t":"order","topic":"Git","q":"Order the steps to suggest a fix to a project on GitHub.","items":["git clone the repository","git checkout -b fix-typo","Edit, then git commit","git push and open a pull request"],"why":"Clone it, make a **branch** for your change, commit, push, then open a **pull request** so others can review before it is merged.","id":"git.i.08.2"}
      ] },
      { id: "git.a.09", level: "a", n: 9, title: "Rebase", cards: [] },
      { id: "git.a.10", level: "a", n: 10, title: "Stash", cards: [] },
      { id: "git.a.11", level: "a", n: 11, title: "Revert vs reset", cards: [] },
      { id: "git.a.12", level: "a", n: 12, title: "Tags and releases", cards: [] },
      { id: "git.a.13", level: "a", n: 13, title: "Team workflows", cards: [] }
    ] },
    { id: "lx", name: "Linux", topic: "Linux", blurb: "The command line every server and cloud runs on.", units: [
      { id: "lx.b.01", level: "b", n: 1, title: "Files and folders", cards: [
        {"t":"learn","topic":"Linux","title":"Moving around","body":"`pwd` shows where you are, `ls` lists files, `cd folder` moves into a folder, `mkdir` makes a new one and `touch` creates an empty file.","code":"pwd\nls\nmkdir project\ncd project\ntouch notes.txt","lang":"shell","id":"lx.b.01.1"},
        {"t":"choice","topic":"Linux","q":"Which command lists the files in the current folder?","a":"ls","w":["cd","pwd","mkdir"],"why":"`ls` lists files. `cd` changes folder, `pwd` prints where you are, `mkdir` makes a new folder.","id":"lx.b.01.2"},
        {"t":"order","topic":"Linux","q":"Order the commands: make a folder, go into it, create a file, then list what is there.","items":["mkdir project","cd project","touch notes.txt","ls"],"why":"`mkdir` makes the folder, `cd` moves into it, `touch` creates an empty file, `ls` shows `notes.txt`.","id":"lx.b.01.3"}
      ] },
      { id: "lx.b.02", level: "b", n: 2, title: "Reading files", cards: [] },
      { id: "lx.b.03", level: "b", n: 3, title: "Permissions", cards: [] },
      { id: "lx.b.04", level: "b", n: 4, title: "Users and sudo", cards: [] },
      { id: "lx.i.05", level: "i", n: 5, title: "Processes", cards: [
        {"t":"learn","topic":"Linux","title":"What is running?","body":"Every running program is a **process**. `top` (or `htop`) shows them live with CPU and memory use, `ps aux` lists them once, and `kill <pid>` stops one.","id":"lx.i.05.1"},
        {"t":"choice","topic":"Linux","q":"Which command shows running processes and CPU use, updating live?","a":"top","w":["ls","cat","chmod"],"why":"`top` (or the friendlier `htop`) shows what is using CPU and memory right now. Press `q` to quit.","id":"lx.i.05.2"}
      ] },
      { id: "lx.i.06", level: "i", n: 6, title: "Services (systemctl)", cards: [
        {"t":"learn","topic":"Linux","title":"Services with systemctl","body":"Background programs like nginx are **services**. `sudo systemctl restart nginx` restarts one, `systemctl status nginx` checks it, and `enable` starts it at boot. You reach a server with `ssh user@server`.","id":"lx.i.06.1"},
        {"t":"order","topic":"Linux","q":"Order the steps to log in to a server and restart nginx.","items":["ssh user@server","sudo systemctl restart nginx","systemctl status nginx","exit"],"why":"`ssh` logs in, `systemctl restart` restarts the service (it needs `sudo`), `status` checks it is running again, and `exit` logs out.","id":"lx.i.06.2"}
      ] },
      { id: "lx.i.07", level: "i", n: 7, title: "Packages (apt)", cards: [] },
      { id: "lx.i.08", level: "i", n: 8, title: "Networking commands", cards: [] },
      { id: "lx.i.09", level: "i", n: 9, title: "Shell scripts", cards: [] },
      { id: "lx.a.10", level: "a", n: 10, title: "cron", cards: [] },
      { id: "lx.a.11", level: "a", n: 11, title: "Logs and journalctl", cards: [] },
      { id: "lx.a.12", level: "a", n: 12, title: "SSH keys", cards: [] },
      { id: "lx.a.13", level: "a", n: 13, title: "Troubleshooting a slow server", cards: [] }
    ] },
    { id: "sql", name: "SQL", topic: "SQL", blurb: "Ask questions of data: filter, sort, join and summarise.", units: [
      { id: "sql.b.01", level: "b", n: 1, title: "SELECT and FROM", cards: [] },
      { id: "sql.b.02", level: "b", n: 2, title: "WHERE", cards: [
        {"t":"learn","topic":"SQL","title":"Filtering rows","body":"`WHERE` keeps only the rows that match a condition. Combine conditions with `AND` and `OR`.","code":"SELECT name, amount\nFROM orders\nWHERE amount > 500 AND city = 'Guntur';","lang":"sql","id":"sql.b.02.1"},
        {"t":"choice","topic":"SQL","q":"Which SQL keyword keeps only the rows that match a condition?","a":"WHERE","w":["ORDER BY","SELECT","GROUP BY"],"why":"`WHERE` filters rows, e.g. `SELECT * FROM orders WHERE amount > 500`. `ORDER BY` sorts, `GROUP BY` makes groups.","id":"sql.b.02.2"}
      ] },
      { id: "sql.b.03", level: "b", n: 3, title: "ORDER BY", cards: [
        {"t":"learn","topic":"SQL","title":"Sorting results","body":"`ORDER BY amount DESC` sorts big to small; `ASC` (the default) sorts small to big. The written order is always `SELECT`, `FROM`, `WHERE`, `ORDER BY`.","id":"sql.b.03.1"},
        {"t":"choice","topic":"SQL","q":"Which line sorts orders from the highest amount to the lowest?","a":"ORDER BY amount DESC","w":["ORDER BY amount ASC","SORT amount DOWN","GROUP BY amount"],"why":"`ORDER BY` sorts. `DESC` means descending (big to small); `ASC`, the default, is small to big.","id":"sql.b.03.2"},
        {"t":"order","topic":"SQL","q":"Order the parts of this SQL query.","items":["SELECT name, amount","FROM orders","WHERE amount > 500","ORDER BY amount DESC"],"why":"The written order is always `SELECT` → `FROM` → `WHERE` → `ORDER BY`. (`GROUP BY` would go between `WHERE` and `ORDER BY`.)","id":"sql.b.03.3"}
      ] },
      { id: "sql.b.04", level: "b", n: 4, title: "COUNT, SUM, AVG", cards: [
        {"t":"learn","topic":"SQL","title":"Summaries","body":"`COUNT(*)` counts rows, `SUM(col)` adds up, `AVG(col)` averages, and `MIN` / `MAX` find the smallest and biggest.","code":"SELECT COUNT(*), SUM(amount), AVG(amount)\nFROM orders;","lang":"sql","id":"sql.b.04.1"},
        {"t":"choice","topic":"SQL","q":"Which query counts the rows in a table called orders?","a":"SELECT COUNT(*) FROM orders;","w":["SELECT SUM(orders);","COUNT orders;","SELECT * FROM COUNT(orders);"],"why":"`COUNT(*)` counts rows. The pattern is always `SELECT <what> FROM <table>`.","id":"sql.b.04.2"}
      ] },
      { id: "sql.i.05", level: "i", n: 5, title: "GROUP BY and HAVING", cards: [] },
      { id: "sql.i.06", level: "i", n: 6, title: "JOINs", cards: [] },
      { id: "sql.i.07", level: "i", n: 7, title: "Subqueries", cards: [] },
      { id: "sql.i.08", level: "i", n: 8, title: "INSERT, UPDATE, DELETE", cards: [] },
      { id: "sql.a.09", level: "a", n: 9, title: "Window functions", cards: [] },
      { id: "sql.a.10", level: "a", n: 10, title: "CTEs", cards: [] },
      { id: "sql.a.11", level: "a", n: 11, title: "Indexes and performance", cards: [] },
      { id: "sql.a.12", level: "a", n: 12, title: "Star schema modelling", cards: [
        {"t":"learn","topic":"SQL","title":"Star schema","body":"Reporting models use a **fact** table of measurements (sale amount, quantity) linked to **dimension** tables that describe them (customer, product, date). Drawn out, it looks like a star.","id":"sql.a.12.1"},
        {"t":"choice","topic":"SQL","q":"In a star schema, which table holds the numbers, like sale amount and quantity?","a":"The fact table","w":["A dimension table","The staging folder","A lookup CSV"],"why":"The **fact** table holds measurements (amount, quantity). **Dimension** tables describe them (customer, product, date) and sit around it like a star.","id":"sql.a.12.2"}
      ] }
    ] },
    { id: "dk", name: "Docker", topic: "Docker", blurb: "Package any app so it runs the same everywhere.", units: [
      { id: "dk.b.01", level: "b", n: 1, title: "Images vs containers", cards: [
        {"t":"learn","topic":"Docker","title":"Images and containers","body":"An **image** is a packaged template: your app plus everything it needs to run. A **container** is a running copy of an image. One image can start many containers.","id":"dk.b.01.1"},
        {"t":"choice","topic":"Docker","q":"What is a Docker image?","a":"A packaged template with the app and everything it needs to run","w":["A running server","A screenshot of the app","A backup of a database"],"why":"An **image** is the package (code, libraries, settings). A **container** is a running copy of that image.","id":"dk.b.01.2"}
      ] },
      { id: "dk.b.02", level: "b", n: 2, title: "run, ps, stop", cards: [] },
      { id: "dk.b.03", level: "b", n: 3, title: "Dockerfile", cards: [
        {"t":"learn","topic":"Docker","title":"The Dockerfile","body":"A **Dockerfile** is the recipe. `FROM` picks a base image, `COPY` adds your files and `CMD` says what to start. `docker build -t myapp .` makes the image; `docker run myapp` starts it.","code":"FROM python:3.12-slim\nCOPY app.py .\nCMD [\"python\", \"app.py\"]","lang":"docker","id":"dk.b.03.1"},
        {"t":"order","topic":"Docker","q":"Order the steps to run your app in a Docker container.","items":["Write a Dockerfile","docker build -t myapp .","docker run -p 8080:80 myapp","Open the app in the browser"],"why":"The **Dockerfile** is the recipe, `docker build` makes an image from it, and `docker run` starts a container from that image.","id":"dk.b.03.2"},
        {"t":"choice","topic":"Docker","q":"What does the FROM line at the top of a Dockerfile do?","a":"Picks the base image to start from","w":["Copies your files","Opens a network port","Deletes old containers"],"why":"`FROM python:3.12-slim` starts from an image that already has Python. Then `COPY`, `RUN` and `CMD` add your app on top.","id":"dk.b.03.3"}
      ] },
      { id: "dk.i.04", level: "i", n: 4, title: "Volumes", cards: [] },
      { id: "dk.i.05", level: "i", n: 5, title: "Networks", cards: [] },
      { id: "dk.i.06", level: "i", n: 6, title: "Docker Compose", cards: [] },
      { id: "dk.i.07", level: "i", n: 7, title: "Registries", cards: [
        {"t":"learn","topic":"Docker","title":"Registries","body":"A **registry** stores images so servers can download them, for example Docker Hub or **Azure Container Registry**. `docker push` uploads an image and `docker pull` downloads it.","id":"dk.i.07.1"},
        {"t":"pipe","topic":"Docker","q":"Ship an app with Docker and Azure: from recipe to running app.","steps":[["DF","Dockerfile","src"],["IMG","docker build: image"],["ACR","Push to Container Registry"],["RUN","Run as a container"]],"extra":[["VM","Install Python by hand"]],"why":"The **image** is built from the Dockerfile, stored in a registry (Azure Container Registry), and run anywhere as a container. No hand installs.","id":"dk.i.07.2"}
      ] },
      { id: "dk.a.08", level: "a", n: 8, title: "Multi-stage builds", cards: [] },
      { id: "dk.a.09", level: "a", n: 9, title: "Image size and security", cards: [] }
    ] },
    { id: "k8s", name: "Kubernetes", topic: "Kubernetes", blurb: "Run containers at scale: pods, deployments and services.", units: [
      { id: "k8s.b.01", level: "b", n: 1, title: "Cluster, node, pod", cards: [
        {"t":"learn","topic":"Kubernetes","title":"Pods, nodes and clusters","body":"A **pod** runs one or more containers. Pods run on **nodes** (machines), and all the nodes together form the **cluster**. Kubernetes restarts and moves pods to keep your app running.","id":"k8s.b.01.1"},
        {"t":"choice","topic":"Kubernetes","q":"In Kubernetes, what is the smallest unit that runs your container?","a":"A Pod","w":["A Node","A Cluster","A Namespace"],"why":"A **Pod** wraps one (sometimes more) containers. Pods run on **nodes** (machines), and all nodes together make the **cluster**.","id":"k8s.b.01.2"}
      ] },
      { id: "k8s.b.02", level: "b", n: 2, title: "kubectl basics", cards: [] },
      { id: "k8s.b.03", level: "b", n: 3, title: "Deployments", cards: [] },
      { id: "k8s.i.04", level: "i", n: 4, title: "Services", cards: [] },
      { id: "k8s.i.05", level: "i", n: 5, title: "ConfigMaps and Secrets", cards: [] },
      { id: "k8s.i.06", level: "i", n: 6, title: "Scaling", cards: [] },
      { id: "k8s.a.07", level: "a", n: 7, title: "Ingress", cards: [] },
      { id: "k8s.a.08", level: "a", n: 8, title: "Helm", cards: [] },
      { id: "k8s.a.09", level: "a", n: 9, title: "RBAC", cards: [] },
      { id: "k8s.a.10", level: "a", n: 10, title: "AKS on Azure", cards: [] }
    ] },
    { id: "ans", name: "Ansible", topic: "Ansible", blurb: "Automate servers with simple YAML playbooks.", units: [
      { id: "ans.b.01", level: "b", n: 1, title: "Inventory", cards: [
        {"t":"learn","topic":"Ansible","title":"The inventory","body":"The **inventory** lists your servers in groups, like `[web]` with `web1` and `web2`. Playbooks then target a group with `hosts: web`. Ansible connects over SSH; no agent is needed on the servers.","code":"[web]\nweb1\nweb2","lang":"ini","id":"ans.b.01.1"},
        {"t":"choice","topic":"Ansible","q":"Where do you list the servers that Ansible manages?","a":"The inventory file","w":["The handlers section","The Dockerfile","A Jinja2 template"],"why":"The **inventory** lists hosts and groups, like `[web]` with `web1` and `web2`. A playbook then targets a group with `hosts: web`.","id":"ans.b.01.2"},
        {"t":"order","topic":"Ansible","q":"What happens when you run ansible-playbook? Order the steps.","items":["Read the inventory","Connect to each server over SSH","Run the tasks in order","Show the PLAY RECAP"],"why":"Ansible needs **no agent** on the servers: it reads the inventory, connects with SSH, runs each task top to bottom, then prints a summary.","id":"ans.b.01.3"}
      ] },
      { id: "ans.b.02", level: "b", n: 2, title: "Ad-hoc commands", cards: [] },
      { id: "ans.b.03", level: "b", n: 3, title: "Playbook structure", cards: [
        {"t":"learn","topic":"Ansible","title":"Playbooks","body":"A **playbook** is a YAML list of plays. Each play has `hosts` (which servers) and `tasks` (what to do, in order). YAML uses spaces, never tabs: 2 per level here.","code":"- name: Set up web\n  hosts: web\n  tasks:\n    - name: Install nginx\n      ansible.builtin.apt:\n        name: nginx","lang":"yaml","id":"ans.b.03.1"},
        {"t":"indent","topic":"Ansible","step":2,"q":"Fix this Ansible playbook so it installs git on every server.","lines":[[0,"- name: Set up developer tools"],[2,"hosts: all"],[2,"become: true"],[2,"tasks:"],[4,"- name: Install git"],[6,"ansible.builtin.apt:"],[8,"name: git"],[8,"state: present"]],"why":"Play settings (`hosts`, `become`, `tasks`) sit 2 spaces under the play. Each task is a list item under `tasks:`, and the module’s options go one level deeper.","id":"ans.b.03.2"}
      ] },
      { id: "ans.b.04", level: "b", n: 4, title: "apt, copy, service", cards: [
        {"t":"learn","topic":"Ansible","title":"Everyday modules","body":"`ansible.builtin.apt` installs packages, `copy` sends files and `service` starts or restarts services. Modules are **idempotent**: run them twice and the second run changes nothing if the server is already right.","id":"ans.b.04.1"},
        {"t":"choice","topic":"Ansible","q":"Which Ansible module installs a package on an Ubuntu server?","a":"ansible.builtin.apt","w":["ansible.builtin.copy","ansible.builtin.service","ansible.builtin.template"],"why":"**apt** is Ubuntu’s package manager, so `ansible.builtin.apt` installs packages. `copy` sends files, `service` starts and stops services.","id":"ans.b.04.2"},
        {"t":"choice","topic":"Ansible","q":"You run the same playbook twice. The second run shows changed=0. What is this good property called?","a":"Idempotency","w":["Inventory","Templating","Encryption"],"why":"**Idempotent** means running it again changes nothing if the server is already right. That makes automation safe to repeat.","id":"ans.b.04.3"},
        {"t":"indent","topic":"Ansible","step":2,"q":"Fix this playbook so nginx starts on the web servers.","lines":[[0,"- name: Start web server"],[2,"hosts: web"],[2,"become: true"],[2,"tasks:"],[4,"- name: Start nginx"],[6,"ansible.builtin.service:"],[8,"name: nginx"],[8,"state: started"]],"why":"`name` and `state` are options of the service module, so they sit 2 spaces deeper than `ansible.builtin.service:`.","id":"ans.b.04.4"}
      ] },
      { id: "ans.i.05", level: "i", n: 5, title: "Variables", cards: [
        {"t":"learn","topic":"Ansible","title":"Variables","body":"Define values once under `vars:` and use them anywhere with `{{ name }}`. If a value starts with `{{`, put it in quotes.","id":"ans.i.05.1"},
        {"t":"indent","topic":"Ansible","step":2,"q":"Fix this playbook that uses a variable for the package name.","lines":[[0,"- name: Set up web"],[2,"hosts: web"],[2,"become: true"],[2,"vars:"],[4,"pkg: nginx"],[2,"tasks:"],[4,"- name: Install the package"],[6,"ansible.builtin.apt:"],[8,"name: \"{{ pkg }}\""]],"why":"The variable `pkg` lives under `vars:` (4 spaces). `{{ pkg }}` is replaced by `nginx` when the task runs.","id":"ans.i.05.2"}
      ] },
      { id: "ans.i.06", level: "i", n: 6, title: "Handlers", cards: [] },
      { id: "ans.i.07", level: "i", n: 7, title: "Templates", cards: [] },
      { id: "ans.i.08", level: "i", n: 8, title: "Loops and conditions", cards: [] },
      { id: "ans.a.09", level: "a", n: 9, title: "Roles", cards: [] },
      { id: "ans.a.10", level: "a", n: 10, title: "Ansible Vault", cards: [] },
      { id: "ans.a.11", level: "a", n: 11, title: "Galaxy", cards: [] },
      { id: "ans.a.12", level: "a", n: 12, title: "Testing idempotency", cards: [] }
    ] },
    { id: "ops", name: "DevOps and CI/CD", topic: "DevOps", blurb: "How modern teams build, test and ship safely.", units: [
      { id: "ops.b.01", level: "b", n: 1, title: "What DevOps is", cards: [
        {"t":"learn","topic":"DevOps","title":"What DevOps is","body":"**DevOps** joins building software and running it: small changes, automated tests and releases, fast feedback, and shared responsibility, including safe habits like never sharing passwords in chat.","id":"ops.b.01.1"},
        {"t":"order","topic":"DevOps","q":"A user reports a bug. Order the steps a professional follows.","items":["Reproduce the bug","Find the cause","Fix the code","Test again"],"why":"First make the bug happen yourself, then find **why** it happens, fix it, and test that it is really fixed (and nothing else broke).","id":"ops.b.01.2"},
        {"t":"choice","topic":"DevOps","q":"Someone messages you on WhatsApp asking for the server password “to fix an urgent bug”. What do you do?","a":"Refuse, and give access only through proper accounts","w":["Send it, because it is urgent","Send half of it","Post it in the team group"],"why":"Never share passwords in chats. Real teams give each person their own account with only the access they need, and keep secrets in a vault.","id":"ops.b.01.3"}
      ] },
      { id: "ops.b.02", level: "b", n: 2, title: "Environments: dev, staging, prod", cards: [] },
      { id: "ops.b.03", level: "b", n: 3, title: "Continuous integration", cards: [
        {"t":"learn","topic":"DevOps","title":"Continuous integration","body":"With **CI**, every push is built and tested automatically, so problems are caught in minutes. **CD** then delivers the tested build to staging and production.","id":"ops.b.03.1"},
        {"t":"choice","topic":"DevOps","q":"In CI/CD, what does CI stand for?","a":"Continuous Integration","w":["Code Inspection","Cloud Infrastructure","Continuous Installation"],"why":"**Continuous Integration**: every code change is merged often and tested automatically. CD is Continuous Delivery or Deployment.","id":"ops.b.03.2"},
        {"t":"pipe","topic":"DevOps","q":"Build a CI/CD pipeline: from a code push to production.","steps":[["GIT","Code pushed","src"],["BLD","Build"],["TEST","Run tests"],["STG","Deploy to staging"],["PROD","Deploy to production"]],"extra":[["DEL","Delete the logs"]],"why":"Build first, then **test**, so broken code never ships. Staging is a safe copy of production to check it there before real users see it.","id":"ops.b.03.3"}
      ] },
      { id: "ops.i.04", level: "i", n: 4, title: "Pipeline YAML", cards: [] },
      { id: "ops.i.05", level: "i", n: 5, title: "Test stages", cards: [] },
      { id: "ops.i.06", level: "i", n: 6, title: "Artifacts", cards: [] },
      { id: "ops.a.07", level: "a", n: 7, title: "Blue-green and canary releases", cards: [] },
      { id: "ops.a.08", level: "a", n: 8, title: "Infrastructure as code", cards: [] },
      { id: "ops.a.09", level: "a", n: 9, title: "Monitoring and SRE basics", cards: [] }
    ] }
  ]
};
