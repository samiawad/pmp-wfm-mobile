WFM System Modernization
An Outline for Discussion and Planning
V1.0 - May 2024
Product Management

Concept Paper
Construct

This document is intended to provide an outline of the specifications, features and design concepts
associated with the “modernized” WFM system that is being planned by Globitel. It is, therefore, not a
final design document, but a high-level overview of the envisioned ultimate product, with the sole
purpose of providing the various stockholders and team members with better visibility on the product’s
characteristics and expected designs. This is to establish a baseline for commercial and market inputs,
and help in the planning process for the upcoming development and implementation.

Provision

Interpretation Nothing in this document should be interpreted as a definitive set of features or final
design. This document is not intended to set the boundaries for any of the
functionalities or features listed herein, where these concepts are expected to
incorporate additional and more detailed functional and design elements, unless
otherwise explicitly mentioned.
Original
Features
None of the original features and functionalities available within the current system
will be removed from the new system, unless otherwise clearly stated. The absence
of mention of any exiting feature or functionality is due solely to the lack of context,
and must not be taken as a ground for removing those from the new product.
Wording The wording used in the document is generic, and does not carry any notions in
relation to priorities or level of urgency for any of the functionalities, or an indication
of mandatory vs optional designs or specifications.
Interface
Elements
The wireframes exhibited in this document are intended for illustration purposes
only. These must not be considered in any way as final designs, or carry any
notations for the final UX/UI intended for this product.
Table of Contents
1 Foreword
2 System Structure
2.1 The Big Picture
2.2 System Modules and Components
3 System Design: Rational and Guiding Principles
3.1 System Identity and Orientation.............................................................................................................................
3.2 Modular Configuration Elements (Tool Kits)
3.3 Navigation..............................................................................................................................................................
4 Deployment Stages
5 Workforce Planner
5.1 Schedules
5.1.1 Scheduling Console
5.1.2 Schedules History
5.1.3 Create Schedule
5.1.4 Calendars
5.2 Forecasting
5.3 Resource Planning
5.4 Workforce Planner Tool Kit
6 Workforce Manager
6.1 Adherence
6.1.1 Daily Adherence Tracker
6.1.2 Historical Adherence
6.1.3 Adherence Analysis
6.2 WFM Insights
6.3 Real Time Monitor
6.4 Optemizer (AKA Schedule Maintenance)
6.5 Workforce Manager Tool Kit
7 Actions Manager
7.1 Requests
7.1.1 Requests Manager
7.1.2 Requests History
7.1.3 Requests Trends
8 Agent Functionalities
8.1 Agent Screens
8.1.1 My Schedule (Landing Page)
8.1.2 Inner Screens
8.2 New Agent Functionalities
9 Additional Considerations
9.1 Core Functionalities
9.2 Additional Best-Practice Features
9.3 Mobile App
1 Foreword
WFM system is one of Globitel’s flagship products that has been in the market for many years. The
system has gone through many improvements over the years, and has been elevated to a point where it
has become an operational staple in many call centers at several renowned organizations across the
region.

However, the system requires some modifications and improvements to allow it to better meet current
and future market needs. It needs to be equipped with additional key functionalities and capabilities in
line with the industry trends, and that customers are requesting on continues basis. Such customers’
requests are currently being addressed in a scattered fashion, where a better approach is needed to
rethink the system’s capabilities wholistically.

On the other hand, there are some pressing structural considerations that necessitate reevaluating the
product’s longevity and evolution:

▪ The current system is built on Web Forms, which is an outdated technology that may not carry
the product for a much longer time, and would hinder its evolution.
▪ The current system is monolithic, making it more difficult to maintain and modify. Moving to a
layered architecture with a modular structure is extremely critical for the evolution of this
product, not to mention the reduction of development time and effort in the future.
On that account, it has been decided to embark into a project to “modernize” the WFM system, in an
effort to address all the above issues and ensure an elevated market position in the coming years. This
modernization plan is based on two main pillars:

▪ The functionalities and capabilities of the system shall be uplifted to ensure that it converges
with the industry standards and best practices, and that it effectively meets current and future
market needs.
▪ The new system would be migrated to the Angular technology, and will use a modular and
layered architecture.
This document provides an outline of the envisioned system’s structure, functionalities, and design
concepts in line with the above.

2 System Structure
2.1 The Big Picture
In line with the vision described earlier, the new system would have to be restructured and refitted taking
the below elements into consideration:

▪ WFM system would be assimilated into the WFO Business Suite, which also includes PMP. Both
modules would have a set of interchangeable components accessed from within the same
navigation menu. This has been accounted for in the design of the new system.
▪ WFM – and PMP for that matter – would both be fitted on top of the Common Layer, which will
house the settings and configuration elements across the business suite. Therefore, it is
envisioned that the new WFM system will not use independent components to serve this
purpose, but will use the Common Layer.
The above are critical underlying design elements to allow for reusability and more effective utilization of
cross-functional components across the system.

2.2 System Modules and Components
The system structure being designed was based on the factors above. Therfore, and unlike the current
approach, the new system would be structured based on the relevent business cycles. The various
functionalities are to be grouped into modules and operational streems according to these cycles.

This is very important for streamlining the strcuture, elevating user experince, and allowing for seemless
incorporation of additional functionalities in the future.

The functionality map below shows this envisioned strcuture:

The above WFM system structure was shown in the context of the future WFO Business Suite for the
purpose of providing a wholistic view and a more futuristic outlook of the ultimate product.
Nonetheless, the full suite is not within the scope of this document, where it is intended to tackle WFM
native modules only.

In addition, it must be noted that the above functionality map does not show some of the components
associated with the system. However, these must be accounted for in the planning process. These
components are:

▪ Notifications: This is a typical functionality, accessed from the top bar. Not shown here as it
does not have any structural impact at this point, but needs to be accounted for, with the
assumption that it will undergo UX/UI modifications, with minimal changes to its function.
▪ Landing Page (Home): This is a screen that will be added as part of the business suit, but will not
be required for an individual product. If used, it will be a landing page providing details on user
profile and highlights from different components related to the specific user. It will then allow
accessing various components throughout the system.
▪ Agent Functionalities: Agents will be using the system, with a set of special screens. This is not
shown above, but is tackled in a separate part within this document (Chapter 8)
3 System Design: Rational and Guiding Principles
3.1 System Identity and Orientation.............................................................................................................................
The new system must be business driven, that is geared towards operational efficiency and effective
optimization. This is critical to fortify its market positioning and appeal. Accordingly, the key principles
adopted in the design process are:

Structural

As a business-driven system, it must be designed and structured based on the operational user journeys
and prevalent business cycles being addressed. Therefore, the various functions within the system
would be grouped, cascaded or sequentially accessed based on this rational.

Functional

The new system would have to be fitted for operational effectiveness. To that end, the system design
must allow comprehensive visibility across any functional area being managed, while providing
simultaneous actioning capabilities. Wherever applicable, the system must also allow for guided
handling, and sufficient “pre-action” insights on defects or anomalies for proactive management.

Usability

The system would have to allow for performing various activities on the go and access to information in a
clear and easy fashion. Several UX/UI design elements and new practices would have to be introduced
to allow this. The system would also have to be less dependent on grids and basic listings, and more
dependent on functional and action panels, and widget-like visual summaries. More details on this are
shown throughout this document.

3.2 Modular Configuration Elements (Tool Kits)
Being a large system (and even larger as a business suite), with a multitude of components for
configuration and settings, these components were structured as independent clusters based on
relevance to the various functional areas within the system.

Therefore, each component will incorporate a functional stream called “Tool Kit”, that handles all
settings related to that particular component (as opposed to squeezing all these into a single
“configuration” menu item). This is shown in the functionality map above.

This is a novel approach to enhance user experience and remove structural and interface clutter.

3.3 Navigation..............................................................................................................................................................
The system shall use Side-Bar Navigation as opposed to the current Top-Bar navigation. This is to ease
navigation, and allow for a more logical function-driven grouping of the various components. This will
also help in streamlining the design and removing UI clutter.

This will be a “Three-Fold” navigation as shown in the example below:

4 Deployment Stages
It is envisioned that the deployment of the new product will be on two stages as outlined below:

Stage One

This is the stage where the initial modernized product is released to the market. This release will entail
having a fully functional, market-ready system that:

▪ Is using the new technology and architecture as outlined above;
▪ Layered on top of the common layer; and
▪ Includes all components and functionalities designated for this stage (marked with Orange or
Blue in the functionality map above) or mentioned through the document.
Stage Two

This is an ongoing stage, where additional functionalities will continue to be added to the system in
iterations. This includes:

▪ The components and functionalities marked with Green in the functionality map above.;
▪ The new features and modifications mentioned throughout the document that are marked as
Stage 2 functionalities; and,
▪ Any additional functionalities that might arise in the future.
At a later stage, a plan shall be devised for prioritizing Stage 2 activities.

5 Workforce Planner
This module deals with the Planning Cycle associated with workforce management along with all
processes and activities related to the planning aspects of the business cycle. It consists of three
functional streams described in the following sections.

5.1 Schedules
This functional stream deals with schedules: understanding, analyzing, planning and creation.

5.1.1 Scheduling Console
This is a new functionality, which acts as a landing point for a user before embarking into the various
WFM activities. This is a very important usability approach for giving managers better visibility on the
current standings to allow them to better organize and prioritize.

This screen gives a birds-eye view on schedules and workload plans during the relevant planning period
(8-12 weeks), along with highlights on performance or issues related to each, or any upcoming activities
to be incorporated into the workforce planning process. Through this screen a user can learn in an
instance:

▪ Schedules in production, unscheduled periods, or draft schedules. This will be in a timeline
chart format for clarity and ease of use.
▪ Selecting a schedule from the timeline would update an adjoining panel with extended details
on that schedule, where the manager can invoke actions, such as publish a new schedule or
move to optimizing an existing one.
▪ The manger will also get high level insights on the current standings or any pressing issues
related to a certain schedule or scheduling period through an insights panel at the bottom of the
screen.
A user can then venture out to any of the various components to obtain more in-depth details or perform
actions prevalent to a specific component. Being a “steering” screen, a manager can access most other
functionalities here as opposed to referring to the main menu (Schedule Maintenance, Adherence, etc.).

The envisioned design concept is shown in the below wireframe:

5.1.2 Schedules History
This component is very similar to the current “View Schedules” screen, where it provides a list of all
schedules (current and past). Users can filter out based on certain criteria to view those in a simple grid
format.

However, some additional functionalities would be added to this listing of historical schedules, which is
to provide some analytical insights on each schedule in relation to areas such as performance,
deviation, effectiveness, and resources levels, in addition to some underlying factors in conjunction with
each element.

The user can use this screen to create, clone or import a schedule in a manner similar to the current
system (with some usability and UI enhancements)

5.1.3 Create Schedule
This is the functionality that allows the creation of new schedules. It is quite similar to the functionality
within the existing system. This can be accessed through the main menu, the “Scheduling Consol”, or
the “Schedules History” described above.

This will continue to follow a Wizard format, and will be directed in a manner similar to the existing
approach. However, some modifications will be required here in relation to the flow, inputs, and user
interface.

One key area that will change here is the “Staging” concept, where the scheduling manager would be
able to examine some variations to the created schedule or make modifications. At an advanced stage
in the future, this needs to evolve to cater for alternate scenarios and recommended changes, along
with multiple variations of a schedule (service vs cost vs moral) to select from. This can involve current
algorithms or more sophisticated AI techniques in the future. This is an intelligent way to have managers
make changes based on the system’s recommendations to better meet Service Level and cost
objectives.

In terms of function, new features would need to be introduced to the Scheduling component in line
with industry standards and best practices. These are described within chapter 9 of this document.

5.1.4 Calendars
This is simply the schedule itself, which is the same as the current “User Schedule” functionality. This is
simply a list of agents along with their working hours, activities, and notes for each day.

The modifications required to this functionality are:

▪ The addition of a collapsible summary panel at the top (to show totals for each state, workgroup,
and events).
▪ The addition of a new view to show the schedule on Monthly basis. This will show the schedule
in a calendar-like format (showing counts of agents per day and not named agents).
▪ The typical “Weekly” schedule view is to undergo some UI modifications.
This functionality is accessible from within the “Scheduling Console” described above or from the main
menu, and the user can switch between the weekly and monthly views from within the screen itself. If
accessed from the main menu, the user will be required to filter down by selecting a specific
schedule/skill group.

The user can use this screen to perform all types of actions to the schedules such as swaps, change
shifts, vacations, etc. (initiated by the manager and not as a request by the agent)

5.2 Forecasting
This functional stream deals with Forecasting: planning, preparing, and assessing accuracy.

This component will be restructured to provide better experience in conjunction with the usability flow
of the activities associated with the forecasting process. No design concept is available at this time, but
it should be presumed that this component will undergo changes to the function and usability (In line
with the principles and design concepts for other components shown in this document).

As part of the revamp process, the core forecasting functionalities must be examined to ensure that any
drawbacks or weaknesses (if present) are addressed and rectified within the new system, and that the
process follow industry standards and best practices.

In addition, some forecasting functionalities would have to be incorporated into the system, which are:

▪ Incorporate additional forecasting algorithms to better cater for outbound handling and
interaction blending.
▪ Incorporate additional forecasting algorithms to better cater for eChannels.
The above new features need to be incorporated into the system at some point, but are not critical for Stage 1. These
should be planned for future resales. Mentioned here for the purpose of added visibility.
5.3 Resource Planning
This operational stream is to be incorporated at later stages, and will not be required as part of the
release of the initial revamped product. However, a brief outline is provided herein for the purpose of
providing a wider view of the ultimate product. It is highly recommended that these are examined to
have a better view into the future product needs, bur need not be accounted for in the planning for
Stage1.

Budgeting & Costing

This is a functionality that allows planning and managing costing elements associated with WFM. The
current system provides basic costing, but this needs to broadened to include more in-depth planning,
cost compassion with respect to scheduling scenarios, break-even points for overtime, etc.

Time Bank

This is a scheduling model where agents work flexible hours to accumulate overtime, and this is set for
them as “time balance”. This is paid out in the form of time, where agents can use their balances for

time off or to compensate for other work hours. The system is the control unit that manages and tracks
these “exchange” activities and reconciles balances accordingly.

This is a concept that provides added convenience to workers, while allowing organizations to optimize
cost.

BPO Exchange

This is a functionality where forecasting and scheduling is interchangeably performed for a combination
of in-house and outsourced operations. This is required for optimization purposes, and balancing the
blend of workload and cost across the two operations based on various elements.

VTO (Voluntary Time Off)

This functionality is important as a cost optimization tool. It is more prominent among BPOs and
organizations engaging in temporary, seasonal, and part-time employment.

This works by issuing leave requests to attract opt-ins from agents to leave work in the event of low call
volumes and potential overstaffing. It involves a combination of configuration attributes and work rules
relating to priorities, rotation and handling, along with inputs from real time variables to recalculate
staffing levels and trigger such requests.

The above new features are not to be part of the initial release of the revamped product, but will be planned for later
stages
5.4 Workforce Planner Tool Kit
This is the configuration and settings component associated with the Workforce Planner. At this stage it
will include the following:

▪ Work Rules
▪ Skills Settings
▪ FTE Calculator
▪ Staffing Planner
The first two components above are quite similar to the existing functionalities under the same names.
In the new system they will undergo some modification to the UX/UI, but no major changes to the
function itself.

The last two features in the above list are impractical and somewhat redundant as they stand today, and
would most probably need to be expanded or incorporated into another component.

A New Practice for Configuration Functionalities

A key practice will be introduced in the new system, which is a “Control Panel” concept for configuration
and settings, and shall be utilized across the system (wherever relevant and appropriate). Instead of
listing all items within the main menu, there will be a unified control panel for all items within the same
family, which acts as a “Control Center” that gives useful stats on the items being configured, and
through which the user can venture into a specific area to obtain full details or perform the
configuration/addition.

This is a best-practice usability approach that helps in reducing errors and keeping the system in order.

This concept is exhibited in the below wireframe:

6 Workforce Manager
This is the component that deals with all that is related to managing workforce: organizing,
understanding the day-to-day or intra-day variations, and making actions based on these findings.

6.1 Adherence
The current approach to listing all agents within a screen proved to be impractical, especially for larger
teams. Although this was the trend for quite some time, the new approach is to deemphasize these
views and provide additional - more prominent - visualizations to show top defects, most alarming
trends, or abnormal variations. This view can then be used to drill down to specific areas of interest for
further investigation or rectification. This is the key principle that would be used here.

There will be several views for adherence management. This is extremely important to steer the
attention and efforts of the manager towards the most pressing issues, and ensure that nothing is
overlooked. These views are listed in the following sections.

6.1.1 Daily Adherence Tracker
This component is very similar to “Real Time Adherence” within the current system. However, with the
new system some modifications to its functions and user interface will be required, such as:

▪ Additional and easier sorting capabilities.
▪ Better approach for showing types and split of OOA (start, end, during).
▪ Better approach for showing events and issues, and allowing processing them (comments,
pending requests, pending exceptions, etc.) on the go, while providing insights on their impact.
This component should also look into “Utilization”, which is closely tied to adherence and has a great
impact on the WFM process. Therefore, additional insights would be provided here on trends and
alarming signs related to aspects such as long AHT, high hold or successive Not-ready times.

In terms of function, this screen will have two collapsible sections placed at the top of the screen in
addition to the typical “Agents List” section to provide the following:

▪ Insights on the day, such as prevalent trends, exceptions, or top defaulters; and,
▪ Staffing levels by interval and projected impact.
A manager using this screen can access the “Requests” and “Exceptions” for viewing or processing, and
can perform modifications such as swaps or shift/time changes from within the same screen.

The wireframe below shows a design concept (with one of the two collapsible sections only):

6.1.2 Historical Adherence
Understanding the trends associated with adherence is yet another critical component in the WFM array
of management practices. Looking into root causes as opposed to merely reacting to issues on the day
is very important for effective optimization and harnessing more operational efficiencies. Therefore, this
new functionality is to be introduced to the system.

This component deals with historical adherence. It will be a screen with two sections; a “Quick Insights”
at the top, and a “Details” grid at the bottom:

▪ The top section will have a panel or set of cards with insights on trends, such as top defaulters,
top default dimensions (shifts, day of the week, etc.), trend, and so on. It will give the manager a
quick overview on the overall trend, and where the main issues seem to be. Clicking one of these
cards will filter out the records within the bottom section to show the details associated with a
specific area of concern.
▪ The bottom section carries a grid to show adherence history data (by day). A manager can view
all agents, filter out from the insights at the top, or filter out at will to view a single or more
agents. The manager can also slide the period to show the previous/next 3-4 weeks. This list
should also allow switching the displayed view by agents, by teams, or by shifts, to understand
specific trends related to any of these dimensions impacting adherence.
This design concept is shown in the wireframe below:

6.1.3 Adherence Analysis
This is a screen to give in-depth analysis of adherence for a single employee. It shows day-to-day trend,
influencing factors, along with correlations with various elements such as time of the shift/day, call
volume, etc.

The analytics shown within this screen will use the same data sets in the previous screens, but with
greater granularity to provide detailed insights on a single employee, such as detailed timelines showing
work modes or day-to-day variations, and behavioral trends.

This will be accessible through the “Daily Adherence Tracker” and “Historical Adherence” screens
described above, as well as the main menu.

6.2 WFM Insights
This is a battery of dashboards to tackle the various operational areas associated with the WFM
business cycle. At this stage, there will be two variations for this:

▪ Scheduling Dashboard: This is similar to the current dashboard available within the current
system in terms of function, but it will incorporate a modified set of metrics and components,
along with a modified design.
▪ Agents Dashboard: This is a new dashboard to tackle the agents’ dimension (performance and
behavioral trends).
These dashboards will use the typical form and format of a dashboard, therefore no further elaboration
on the functionality or design elements is required at this stage.

One key element that is to be taken into account is that these dashboards must have drill-down
capabilities to allow for showing greater granularity for the various metrics being selected.

6.3 Real Time Monitor
Real time monitoring is yet another extremely critical management practice that the system must
accommodate properly. Although the system does not deal with the actual handling of interactions at
the contact center, and as such it focuses on WFM readings only, floor managers and Real time
Monitoring experts need a more extended view to understand the full picture and act effectively.

The system shall depart from the current practice of simply listing agents in a table, as it is
counterproductive to show all agents and have the user filter and search for defects. In contrast, the
system must proactively point out most pressing defects or alarming trends at any given time to direct
the attention of managers to these critical areas swiftly.

This is the underlying principle for real time monitoring that ensures operational effectiveness.
Accordingly, Real Time Monitoring components shall be refitted to be able to:

▪ Point out defects or defaulters for various aspects falling outside certain thresholds (which have
to be defined within the system.
▪ Outline statuses along with laps times for alarming behaviors and key metrics.
▪ Provide indicators associated with workload along with predictive insights on them to prompt
intervention
▪ Provide insights on deviation and variations whenever applicable, which is critical for taking
preemptive measures.
In line with the above, the system would have to be refitted to obtain additional data sets from the ACD
to aid in the real Time Monitoring process. This is important to give managers a more wholistic view to
allow them not only to deal with scheduling aspects at hand, but also the prevailing aspects related to
managing the call center floor as a whole.

In addition, the real time monitor should allow switching between differn views to show defaulters or
daily trends (depending on the case at hand)

The wireframe below shows an envisioned design concept:

6.4 Optemizer (AKA Schedule Maintenance)
This is one of the most critical functionalities within the WFM system. The new system will use quite a
different approach for this functionality compared to what is used within the existing system. This
necessitates major changes to its form, format, and usability elements.

A manager engaged in schedule maintenance must be able to approach this function in “totality” as
opposed to dealing with each aspect on its own. Therefore, this functionality needs to be designed in a
manner that gives the user a wholistic view that encompasses all underlying factors. It should also allow
for examining actions while simultaneously measuring their impact and viability, with the ability to act
upon all findings easily.

These are very critical principles for providing an amicable user experience and ensuring utmost
practicality and effectiveness. Some of the key design concepts to be introduced here are:

▪ Visual representation of both standings and possible actions, to allow for better visibility, and
understanding of the anticipated outcomes.
▪ Introduce the concept of “Roster Blocks” which allows easier allocation, modification and
insertion of work activities. This also involves introducing new concepts such as “Slide” and
“Drop” techniques to allow for this.
▪ The system must also reallocate impact by instance for easy exploration of the results or
potential impact (on-the-go)
Accordingly, this functionality will be designed in the manner described below:

▪ A new view will be provided with the split by starting times (shifts) rather than listings of agents.
This is to corelate staffing volumes with timings for easier tracking and better understanding of
the impact on timings. This approach is far easier for performing actions rather than browsing
through lists of agents, especially for larger call center teams.
▪ The traditional view by agent will still be available (in case preferred by existing customers),
where a user can easily switch between views.
▪ The screen will also provide visual representation of staffing levels and volumes/SL within two
separate collapsible sections at the top. This is also another dimension that allows an
immediate detection of the areas requiring most attention.
▪ Some additional concepts would be introduced here which are:
o Skewness Score, which is s statistical scoring methodology that measures variation to
the staffing levels. This is an easy visual representation to help managers understand
the magnitude of overstaffing or understaffing and how the actions performed could
impact staffing accuracy levels.
o Deviation measures, which is the deviation of actual call load to that originally
forecasted. This should also include simple predictive modeling to give visibility on the
projected variation. This is to help managers even further and allow them to restaff for
the later parts of the day if call load is expected to remain higher than originally
forecasted.
The above views combined will give a manager visibility on the current standing and how it diverges from
the planned staffing and desired service levels.

The wireframe below shows this envisioned concept:

To optimize the schedule, the manager would simply need to “Slide” a subset of a shift, or drop a new
work type or activities into the original roster. This is performed in the manner described below:

▪ The system will show the “Roster Blocks” Panel when selected, which is a panel on which
blocks of staff for various types of work are pinned based on time periods relevance, and the
variance in staffing levels during these periods. This can also pin other activities such as
trainings or meetings. (from an UI perspective this may be replaced by marking spots on the
original roster itself).
▪ The manager can simply drop any of these blocks into the original roster, while viewing how
those changed staffing levels and skewness (in the chart on the top section). Examples of these
can be overtime, part time work, etc. when these are dropped into the roster, the staffing level
chart and skewness chart would be updated to reflect the level of enhancement or potential
impact.
▪ The manager can also modify the original staffing by sliding a subset of any of the schedule
clusters (shifts), while also viewing the impact on staffing levels on the top charts. This is
actually a “Change Shift” action but performed using these sliders instead of the traditional
manner.
This approach was designed to reduce “cognitive load” and processing effort, which would allow for far
better experience and much more effective handling.

The conceptual wireframe below shows the above aspects:

The manager can use the above to explore with a wide range of actions. Upon arriving at the most
adequate set of actions, the manager can then move to an execution panel (a slider or pop up) which
provides the best matching agents for each of the actions (who’s to do overtime, whose to do training,
etc.) based on the selections made earlier. Upon the manager’s confirmation of the selected actions
these are executed and updated within the schedule.

There are obviously many more details and intricate design elements here, which are yet to be worked
out. However, at this point, the concept described herein should be sufficient to give the visibility
required for the planning process.

At a later and more advanced stage, it is envisioned that this functionality should evolve to be fitted with
the following:

▪ Cost calculation and impact: the above blocks and optimization scenarios would incorporate
costing elements, which becomes another dimension based on which variations are
determined and actions are set.
▪ “Auto Optimize” feature, where the system automatically makes tweaks and adjustments and
have them implemented based on intra-day and real time data feeds. This can involve statistical
modeling algorithms or more sophisticated AI modeling techniques.
6.5 Workforce Manager Tool Kit
This tool kit will contain setting and managing events and activities, which include:

▪ Meetings
▪ Trainings
▪ Extra Hours
▪ Open Hours
At this stage these will remain similar to the current system, while undergoing some UX and UI
modifications. In addition, these might be consolidated using the “Control Panel” concept described
earlier. However, no major changes to the function are expected at the initial stage.

At a later stage these concepts would have to be revisited in terms of the logic for setting and assigning
these events. In addition, some additional features are to be introduced like recurrence management
and pre-allocation. This is not tackled in the document and shall be planned as part of the future
product roadmap.

7 Actions Manager
7.1 Requests
7.1.1 Requests Manager
This is a new component that will replace several existing components. This component is in fact a
consolidation of several functionalities for handling agents’ requests, which are: vacations, leaves,
swaps and breaks.

This consolidated structure is necessary for the following reasons:

▪ Gives better visibility, and allows more effective handling and elevated user experience.
▪ Provides more in-depth insights on the requests as they are being processed, to allow managers
to react and plan wholistically, which is critical for better control and more effective handling.
If a user does not have the privilege to access a certain type of requests, this can be withheld through
the user permissions (configuration), but there will be no need for different interfaces with respect to the
different types of requests.

As for the envisioned design, this will be a workplace format, where the screen will carry several cards to
guide the manager, give insights, and enable the processing of requests. This is to be structured in the
following manner:

▪ A card to show a summary of the requests and their statuses (overdue/safe, todays, requests,
rejected, etc.) it would also show statuses for those requests that involve a second line of
approval and their current standings.
▪ A card to show the list of requests, and main highlights on these requests (name, date etc.). the
user can choose to filter these to show all requests or certain types (i.e. vacations only or
vacations and breaks, etc.), or filter based on status (pending, overdue, etc.)
▪ Upon selecting one of the requests a “Details card” would show the full details of this request,
along with a brief on previous requests for the same requester (perhaps in a pop up), along with
highlights on adherence history. This is important for a manager for understanding trends and
making the decision. Through this same card the manager can approve or reject the request.
The manager can also include a note here, where several note types can be selected such as
(recommend swap, or propose a different date), similar to the meeting requests concept within
Microsoft Outlook
▪ An additional card would show a chart that would point to the “Impact Zone”, which is the
scheduling period that would be impacted by this request along with the required vs actual
staffing levels. This is to easily and quickly see the impact should the request is approved, which
would replace the current approach of showing a calendar window with many figures. The chart
here can switch modes, where it will show daily staffing for day-dependent requests such as
vacations, or interval staffing for hour-dependent requests such as leaves.
▪ An additional section called “Associated” would show other agents with requests impacting the
same period. This gives further clarity on projected impact and volumes of all requests
combined. The manager can zoom into those to filter out requests related to this particular
period and see the overall impact on the “Impacted Zone” chart, and jointly approve or reject
them if required.
This concept is shown in the wireframe below:

7.1.2 Requests History
This is a secondary screen accessed from within the Requests manager Workplace or the main menu,
where a manager can view the historical requests (upon selecting a period). This would be in a grid
format that shows requests history for all agents, and can be filtered down to show a specific group or a
single agent. This screen would also house an insights panel at the top showing some key stats
associated with these requests, such as:

▪ Swaps per agent, top swaps, most swapped shifts
▪ Vacation per agent, longest duration, durations split
▪ Etc.
7.1.3 Requests Trends
This is a dashboard with multiple charts showing insights and details on all requests, allowing
correlations with multiple factors.

This will be a typical dashboard format as described in an earlier section.

8 Agent Functionalities
In line with the product attributes discussed earlier, the new product must incorporate similar
modifications to the Agent Functionalities, assuming the same governing guidelines and principles
outlined above.

The sections below provide a general outline on the envisioned Agent functionalities:

8.1 Agent Screens
8.1.1 My Schedule (Landing Page)
This is a landing page available to agents (or any position who is part of the roster). It will be a central
personal processing space (a workplace format) where an agent can obtain all insights and details, or
perform any actions related to his working schedule. The screen shall house several cards related to
various areas:

▪ Schedule Panel: Agents can view their schedules here, using a week view for a detailed interval
breakdown or a month view for a general overview. This can be enlarged to better view the
details.
▪ Requests: All types of requests such as vacation requests, shift swaps, breaks, etc. will be
consolidated into this section. Agents can submit new requests or track the status of existing
ones from this same section.
▪ Performance Highlights: This is a “personal dashboard”, providing agents with highlights on key
performance aspects related to WFM, such as adherence, helping them stay on track with their
performance. Agents can move from here to a more detailed insights within an inner screen.
▪ To My attention: This section notifies the agent of any issues that requires his attention, such as
low performance issues or a request waiting his action.
▪ Upcoming events: This is a reminders section to list events related to the agents, such as
upcoming meetings, appraisals, etc.
An envisioned design concept is shown in the wireframe below:

8.1.2 Inner Screens
In addition to the above, a set of inner screens will be available to the agent. This is to provide more in-
depth or/and historical details on the aspects described in the previous section. These screens are:
▪ Requests history
▪ Adherence and Utilization details (and history)
▪ Past schedules
8.2 New Agent Functionalities
In addition to the above components associated with the agent, some features are required within the
system to allow even more effective use and increased effectiveness. These are:

▪ Requests Auto Approval: Allowing the agents to modify their breaks without needing an
approval. If an agent requests a break during times where no understaffing is anticipated, the
system is to automatically approve and process this request.
▪ Auto Swap Approval: Allowing agents to perform shift swaps without needing an approval from
the supervisor.
▪ Shift Bidding: This is a feature that was available within the system. It is to be reinstated.
▪ Waiting Lists. If an agent requests a vacation and this vacation is not possible during the
requested period, the approver (or system) has the choice to add this request to a waiting list,
where this could get approved if another agent with an approved request cancels his request
within a certain period of time.
▪ Exception Management: this is a feature that allows agents to make exceptions requests. These
will be sent to a supervisor for approval before being set into the schedule.
▪ Callender link this is a feature that allows connecting to any external calendar so that users can
view their schedules within that calendar (such as on iOS or Android) for added convenience.
No actions will be performed through these external calendars.
Not all of the above features must be part of the initial release of the revamped product. However, these must be
added to the product very soon after.
9 Additional Considerations
9.1 Core Functionalities
The core functionalities of the system would have to be closely examined and reassessed in conjunction
with this modernization undertaking. This is necessary to ensure that the system adopts sound
computation logic and best industry practices. It is also critical that any issues or pitfalls relating to
these functions (if present) are avoided with the new product.

Some of the areas to be considered are:

▪ The logic for scheduling and setting associations (meetings, extra hours, etc.) would have to be
reassessed to ensure the soundness and effectiveness of the methodologies being used by the
system.
▪ Scheduling models would have to be retested and examined to ensure accuracy and
performance as per the expected norms.
Furthermore, some of the current models for forecasting and scheduling would need to be enhanced,
mainly for Outbound and eChannels (at some point and not necessarily stage 1). On the other hand, at
some point the system would also need to incorporate additional forecasting and scheduling models to
cater for other types of work, mainly:

▪ Interaction Blending
▪ Parttime Work
▪ Activity Planning (For back-office work and work types involving workflows)
9.2 Additional Best-Practice Features
Apart from the components described within this document, the system must incorporate some
additional features and capabilities in conjunction with best industry practices. These are not separate
components or screens by their own right, but features built into the system’s Scheduling and
Forecasting functions. Therefore, no specific design concept is provided, as the impact here would
mostly be at the core/back end, with some modifications to the inputs and variables within various
screens throughout the system (mostly configuration).

These features are listed in the following page in order of importance.

Home
Agents

This is a key feature that allows scheduling for Home Agents. Just like on-premise
scheduling, this has to follow similar rules in terms of destitution, rotation, allocation,
etc. it has to allow for several modes, such as “Spill-over”, where on-premise staffing is
capped at a certain level and the remainder of the agents are staffed at home, or,
“Splitting”, which is based on certain criteria/breakdown for home/office agents. The
feature should cater for fairness rules and proper rotation just like normal scheduling.
It should also allow for overrides or allowances (for example new agents work less at
home or poor performers must always work on-premise, etc.). This may also involve an
Agent Desktop Panel for agents to track or log/request time-away events.
Flexible
Periods

Scheduling is now based on cycles, with a set start of the week day for each cycle. This
is limiting when starting a pop-schedule for a certain period, such as Ramadan or Eid.
This needs to be modified to allow for flexible scheduling periods even if a period does
not start on a Sunday. This can be by modifications to the scheduling algorithms or
simply snipping out the few days that fall outside the period.
Multiple
Schedules

This is a feature where the system allows creating multiple schedules for a particular
period and keeping them in a staging area. One is published at a time.
Sub-Cycles This is a feature where a schedule created for a certain period (such as 5 weeks) would
have smaller scheduling cycles of 1 week. This is to ensure rotation of shifts and days
off within the sub cycles instead of the larger 5 weeks cycles to ensure better fairness.
In other words, this allows creating five 1-week schedules in one go and placing them
under one schedule.

Activities
Scheduling

A feature to allow incorporating additional non-work activities into the schedule, such
as coaching sessions or training programs. Several settings need to be incorporated
into this, and the system should follow similar rules typical of scheduling such as
rotation and priorities.
Scheduling
Allowances

This is a feature where an “allowance” is granted to agents based on certain factors
such as seniority or performance. Agents are categorized using a certain method,
where agents belonging to a certain category (senior agents, for example) are allowed
higher propensity to be allocated to a morning shift, or a specific day off. This can be
turned on and off, or configured based on several attributes. It can also be used for
limited time spans (for example granting this to top performers for the following month
only).
What-If
Scenarios

This was part of an older version of the product. It needs to be reinstated at some
point.
Schedule
Top Ups

This is a feature that allows topping up an existing schedule. In other words, creating a
schedule annex for a new batch of agents and adding it on top of an existing schedule
without impacting the existing employees. The new employees will be allocated to
more understaffed slots or locked slots based on business rules and settings.
Precision
Queueing
Support

This is a new approach to scheduling that involves the incorporation of Precession
Queueing (PQ). PQ is a more complex ACD methodology for queueing which involves
factoring and scoring callers based on a multitude of attributes (obtained from CRM).
These are used to perform queue hoping and rescoring to point caller to certain agents
based on propensity and skill matching
It is not required that all the above features are delivered in Stage 1 as part of the initial release of the revamped
product, but only the first 2- 4 items. The remaining can be planned for later stages.
9.3 Mobile App
The Mobile app associated with the product would have to undergo some modification and changes in
line with the elements described in this document. It shall follow the same design concepts and
principles of the master application.