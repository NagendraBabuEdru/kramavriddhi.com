# Kramavriddhi Learn — Card writer brief

Read `REVIEWER.md` (same folder) section 2 for the product and section 3 for the quality bar: an expert reviewer checks every card you write against it.

## Output
ONE file (path given in your task):
```js
module.exports = {
  'aws.b.01': [ /* cards */ ],
  ...
};
```
Plain JavaScript object literals; double quotes for strings that contain a single quote. No other code.

## Each unit (in this order inside its array)
1. Exactly **one `learn` card first** (the units are new and empty).
2. Practice cards so the unit has **6 to 8 non-checkpoint cards in total** (aim for 7), using at least 3 different types.
3. Exactly **2 `check` cards last** covering the whole unit.
4. Each skill needs **at least two mini games** (`pipe` or `indent`) across its units.

## Card formats
- `{ t: 'learn', title, body, code?, lang? }` — body 2–3 short sentences, `backticks` for commands/code, **bold** for key words; code 1–5 lines.
- `{ t: 'choice', q, a, w: [3 wrong], why }`
- `{ t: 'output', q?, code, lang, a, w, why }` — only when the output is certain (SQL that runs the same in SQLite, or shown in official docs).
- `{ t: 'bug', q, code: [lines], lang, bad: 0-based index, why, fix: "corrected line" }` — exactly one wrong line; question says what goes wrong.
- `{ t: 'order', q, items: [3–5 items in the CORRECT order], why }`
- `{ t: 'pipe', q, steps: [[GLYPH, name], ...] (3–5; glyph max 4 capital letters; first step may add 'src' as 3rd item), extra: [[GLYPH, name]] (exactly 1 block that does not belong), why }`
- `{ t: 'indent', step: 2, q, lang: 'yaml' | 'k8s' | 'ci' | 'compose', lines: [[spaces, text], ...] (the CORRECT indentation), why }`
- `{ t: 'check', q, a, w, why }` or with `code` + `lang`.

`lang`: `'shell'` (aws / gcloud / bq / dnf / systemctl / firewall-cmd / oc / podman commands), `'sql'` (Snowflake, BigQuery, generic SQL), `'yaml'`, `'k8s'` (Kubernetes / OpenShift manifests), `'python'`.

## Rules
- `a` not in `w`; the 3 `w` different, believable beginner mistakes, none "also right".
- `why`: 1–2 short sentences that teach (and name the common mistake).
- Simple English. Indian context welcome (Asha, Ravi, Lakshmi; Guntur, Pune; ₹).
- **Facts exactly as in the official docs.** Put `src: "official page URL"` on every card that states a checkable fact (the reviewer opens them). No made-up flags or output. **No prices, quotas, free-tier amounts or limits** (they change). No preview features.
- Safety: never real secrets; mention stopping unused resources where natural.
- **SQL that is plain/portable** (SELECT, WHERE, GROUP BY, JOIN…): add `verify: { setup: "CREATE TABLE …; INSERT …;", query: "…", rows: [[…]] }` so we can run it in SQLite. Snowflake/BigQuery-only statements (COPY INTO, CREATE WAREHOUSE, UNDROP, Time Travel AT/BEFORE…) are concept cards with `src`.
- Every YAML (learn code, indent lines, bug code after `fix`) must be valid YAML.

## Units (Basic level) and what to teach
**Data Engineering (`de`, vendor-neutral)**
- de.b.01 What a data engineer does — moves data from sources to where people use it; pipelines; sources (apps, files, APIs); consumers (analysts, dashboards, ML); data engineer vs data analyst vs data scientist.
- de.b.02 ETL vs ELT — extract, transform, load; ELT loads raw first and transforms inside the warehouse; when each fits.
- de.b.03 Batch vs streaming — scheduled chunks vs continuous events; latency; examples (nightly sales vs card fraud alerts).
- de.b.04 Warehouse, lake and lakehouse — structured tables for analytics vs raw files of any type vs lake files with table features (e.g. Delta, Iceberg); schema-on-write vs schema-on-read.
- de.b.05 Data modelling: star schema — fact table (events, numbers) and dimension tables (who/what/where/when); keys; why stars make reports simple and fast.
- de.b.06 Pipelines and scheduling — steps with dependencies (a DAG), schedules, retries, idempotent re-runs, alerts on failure; Apache Airflow as a common scheduler.

**Snowflake (`snow`)**
- snow.b.01 What Snowflake is — cloud data platform; storage and compute are separate; runs on AWS, Azure or Google Cloud; SQL.
- snow.b.02 Virtual warehouses — compute clusters that run queries; sizes; auto-suspend and auto-resume save cost; a warehouse is not where data is stored.
- snow.b.03 Databases, schemas and tables — object hierarchy `database.schema.table`; `CREATE DATABASE/SCHEMA/TABLE`; `USE`.
- snow.b.04 Loading data: stages and COPY INTO — internal/external stages, `PUT` (to an internal stage, from SnowSQL), `COPY INTO table FROM @stage`, file formats (CSV, JSON, Parquet).
- snow.b.05 Querying with SQL — SELECT, WHERE, ORDER BY, LIMIT, GROUP BY on Snowflake tables; fully qualified names; result cache idea (keep simple).
- snow.b.06 Time Travel and cloning — query past data with `AT`/`BEFORE`, `UNDROP TABLE`, zero-copy `CLONE` (no data copied at first).

**AWS (`aws`)**
- aws.b.01 Cloud, regions and Availability Zones — on-demand resources, pay for use; Regions contain multiple isolated AZs; choose a Region near users (e.g. Mumbai `ap-south-1`); some services are global (IAM).
- aws.b.02 IAM: users, groups and roles — root user (protect with MFA, don't use daily); users, groups, policies; roles for services/apps (temporary credentials); least privilege.
- aws.b.03 EC2: virtual servers — instances, AMI, instance type, key pair, security group (virtual firewall), stop vs terminate.
- aws.b.04 S3: storage — buckets and objects, keys, globally unique bucket names, Block Public Access, storage classes idea, `aws s3 cp`, `aws s3 ls`.
- aws.b.05 VPC: networking basics — VPC, subnets (public/private), internet gateway, route tables, security groups vs network ACLs (stateful vs stateless).
- aws.b.06 Billing and Free Tier safety — pay-as-you-go, AWS Budgets and billing alerts, stop/terminate unused resources, tags for cost; never share access keys; no amounts.

**Google Cloud (`gcp`)**
- gcp.b.01 Projects, regions and zones — everything lives in a project (ID, number, billing account); regions and zones; resource hierarchy (organization, folders, projects).
- gcp.b.02 IAM roles — principals, roles (basic, predefined, custom), grant on a resource; least privilege; service accounts.
- gcp.b.03 Compute Engine VMs — instances, machine types, images, zones, stop vs delete, firewall rules allow traffic; `gcloud compute instances create/list`.
- gcp.b.04 Cloud Storage buckets — buckets and objects, globally unique names, locations, storage classes idea, `gcloud storage cp` / `gcloud storage ls`, public access prevention.
- gcp.b.05 BigQuery basics — serverless data warehouse; datasets and tables `project.dataset.table`; standard SQL; pay attention to data scanned (select only needed columns; preview instead of SELECT *).
- gcp.b.06 Billing and budgets — billing account linked to projects, budgets and alerts, delete/stop unused resources, shut down a project.

**Red Hat (`rh`)**
- rh.b.01 RHEL and other Linux — RHEL is an enterprise Linux with subscription and support; related: Fedora (upstream), CentOS Stream; same Linux basics apply; `cat /etc/redhat-release` / `/etc/os-release`.
- rh.b.02 Packages with dnf — `dnf install/remove/update/search/info`, repositories, `dnf list installed`, why `sudo`; yum is the older name.
- rh.b.03 Services with systemctl — `systemctl start/stop/restart/status/enable/disable`, `enable --now`, units.
- rh.b.04 Firewall with firewalld — `firewall-cmd --state`, zones, `--add-service=http`, `--add-port=8080/tcp`, `--permanent` + `--reload`, `--list-all`.
- rh.b.05 SELinux basics — modes enforcing/permissive/disabled, `getenforce`, `setenforce 0` is temporary, labels/contexts `ls -Z`, don't disable it to "fix" problems; `restorecon`.
- rh.b.06 OpenShift: what it is — Red Hat's Kubernetes platform; projects (namespaces with more), `oc` CLI (`oc login`, `oc new-project`, `oc get pods`), web console, Routes expose apps.
