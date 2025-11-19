<!-- Page 2 -->


```
Table of contents
```

## PART 1 | Introduction to Next.js Performance Optimization   4

1.1 Intro  4

1.2 Structure of This Guide  5

## PART 2 | Code splitting   6

2.1. Overview  6

2.2 Implementation  8

2.2.1. next/dynamic (Pages Router)  8

2.2.2. next/dynamic (App Router)  11

2.2.3. Automatic Code Splitting  12

2.2.4. External Modules  12

2.3 Keypoints  14

## PART 3 | Streaming, Suspense & Hydration   15

3.1. Overview  15

3.2. Implementation  17

3.2.1. Progressive/Selective Hydration & Suspense  17

3.3. Keypoints  18

## PART 4 | Next/Image Component  19

4.1. Overview  19

4.2. Implementation  19

4.2.1. Prioritize critical images and lazy load non-critical   20

4.2.2 Image placeholders and blur   21

4.2.3. Use modern image formats   22

4.2.4. Set sizes Appropriately  24

4.2.5. Image quality  27

4.3. Keypoints  29

## PART 5 | Third-Party Scripts  30

5.1. Overview   30

5.2. Implementation  31

5.2.1. beforeInteractive   31

5.2.2. afterInteractive  32

5.2.3. lazyOnLoad  32

5.2.4. Enhancing Script Management with Callback Functions   33

5.2.5. Next-third-parties  34

5.3. Keypoints  35

## PART 6 | Font optimization   36

6.1. Overview  36

6.2. Implementation  37

6.2.1 Using Variable Fonts  38

6.3. Keypoints  38

The Ultimate Guide to Next JS Optimalization   |  2



<!-- Page 3 -->

## PART 7 | Rendering  39

7.1 Overview  39

7.2 Implementation  39

7.2.1. App Router Rendering Strategies  40

7.2.2. Pages Router Rendering Strategies   75

7.2.3. Node.js and Edge Runtimes  82

7.3. Keypoints  83

## PART 8 | Web Vitals  84

8.1. Overview   84

8.1.1. Largest Contentful Paint (LCP) (loading performance)  85

8.1.2. Interaction To Next Paint (INP) (interactivity)  86

8.1.3. Cumulative Layout Shift (CLS) (visual stability)   87

8.1.4. Other Web Vitals  88

8.1.5. Metrics weight in Lighthouse  92

8.2. Keypoints  93

## PART 9 | Development culture   94

9.1. Overview  94

9.1.1. Performance budget   95

9.1.2. Adding New Libraries  97

9.1.3. Code reviews   99

9.1.4. Dedicated time for tech debt handling and refactoring  100

9.2. Keypoints  101

## PART 10 | Measuring performance  102

10.1. Overview  102

10.2. Tools and services  102

10.2.1. Lighthouse  102

10.2.2. WebPageTest   103

10.2.3. PageSpeed Insights   104

10.2.4. Vercel Speed Insights  105

10.2.5. Other Real User Monitoring Solutions  106

10.3. Keypoints   107

## Meet the authors   108

The Ultimate Guide to Next JS Optimalization   |  3



<!-- Page 4 -->


```
Introduction
to   Next.js
Performance
Optimization
PART 1
1.1 Intro
```

Speed and interactivity are the keywords you must address to meet user expectations in web

development. Of course, frameworks like Next.js help developers create feature-rich, high-per-

forming applications.

However, getting the best performance requires more than just a good framework. That's why

we decided to write this ebook.

The ebook provides a comprehensive exploration of practical techniques to  maximize the per-

formance of applications built with Next.js. It covers the importance of key metrics like Core

Web Vitals for assessing user experience while guiding you through various optimization

strategies.

What's inside?

�  Code splitting and lazy loading for efficient resource delivery,

�  image optimization using Next.js's built-in tools,

�  and much more to enhance the speed of our apps.

The guide will also discuss streamlining your application's build and deployment processes to

keep it scalable and agile as it grows. You'll learn when to use different rendering approaches

to keep your app fast and up-to-date.

On top of that, you'll learn how to monitor performance metrics, interpret the data, and im-

plement continuous improvements for an optimal user experience.

Whether building a personal project or a large-scale application, these insights will help you

create a faster, more reliable user experience that delights your audience. With the right ap-

proach to Next.js optimization, you can confidently build feature-packed and blazing-fast

applications.

So, let's dive in and explore how to get the best performance out of your Next.js applications!

The Ultimate Guide to Next JS Optimalization   |  4



<!-- Page 5 -->

Introduction to Next.js Performance Optimization


```
1.2 Structure of This Guide
```

Overview:

The overview section introduces the reader to the central issue. It summarizes the problem

and establishes the context necessary to understand the guide's subsequent solutions and

recommendations.

Implementation:

The implementation section delves into practical strategies and best practices for improving

the performance of Next.js applications. This section includes architectural guidelines, opti-

mization techniques, and tooling recommendations to help developers craft high-perform-

ing web applications.

Key Points:

A brief list of essential points covered throughout the chapter.


```
If you need help with
performance optimization,
application scalability,
user experience, or
other challenging
issues, contact us!
```

## As a team of Next.js experts and contributors to its Open Source

## solutions, we are happy to help!

The Ultimate Guide to Next JS Optimalization   |  5



<!-- Page 6 -->


```
Code   splitting
PART 2
2.1. Overview
```

Code splitting is a technique for optimizing web applications. It involves breaking down

the codebase into smaller, manageable chunks loaded separately. This approach usually

improves initial load times and overall performance. In Next.js, code splitting works closely

with  dynamic imports, allowing developers to load components or modules on demand.

## How do dynamic imports differ from static imports?

Dynamic imports differ from static imports in how they load JavaScript modules. With static

imports, the build process includes modules at build-time, which can result in larger initial

bundles. Whereas dynamic imports use code splitting to break up the application into small-

er, on-demand chunks loaded only when needed.

This approach improves page load times by initially sending less code to the client, reducing

the initial download size, and allowing faster page rendering.

The Ultimate Guide to Next JS Optimalization   |  6



<!-- Page 7 -->

Code splitting

Here are example strategies for segmenting a web application's code through code splitting:

�  Pages:  Separate bundles for different pages or routes. Next.js enables this optimiza-

tion by default.

�  Components:  Individual or groups of components as separate chunks.

�  Libraries: Distinct chunks for third-party libraries.

�  Features:  Code related to specific features, possibly toggled by feature flags.

�  User Interactions:   Modules loaded based on specific user actions (e.g., when scroll-

ing into view).

Implementing these strategies requires planning the application's architecture to ensure

modules are split logically and manage dependencies properly. Modern developer tooling can

automate a lot, but we still need to consider what code should be split and what should not.

The Ultimate Guide to Next JS Optimalization   |  7



<!-- Page 8 -->

Code splitting

Ignoring Code Splitting Risks:

�  Slower Load Times & Poor UX:  Without code splitting, users must download the en-

tire app upfront, leading to long load times and sluggish interactions.

�  Higher Bounce Rates & SEO Impact:   Slow pages increase abandonment, and poor

performance metrics (e.g., TBT, INP) hurt search rankings.

�  Security Risks: Including sensitive content in the main bundle instead of lazy load-

ing can expose data to unauthorized users.

Understanding these potential issues helps developers and stakeholders understand the role

of proper code splitting in building user-friendly web apps. This chapter covers best practices

for effective code splitting, pinpoints areas where it can be most beneficial, and explains how

to implement it in Next.js.


```
2.2  Implementation
```

Once you see the benefits of code splitting, the next question is how to apply it in practice.

Next.js automatically splits code by route segments, making navigation faster. This mech-

anism contrasts with traditional React SPAs, where the entire app loads at once, which can

slow down the initial experience.

However, this basic setup might not always meet all performance needs. Luckily, Next.js pro-

vides extra tools and features to improve code splitting further. Let's explore them.


```
2.2.1. next/dynamic (Pages Router)
```

The next/dynamic function in Next.js allows components to be loaded dynamically, reduc-

ing the initial load time by excluding them from the main JavaScript bundle. This function is

handy for components with large dependencies or those not immediately needed.

The Ultimate Guide to Next JS Optimalization   |  8



<!-- Page 9 -->

Code splitting

Below is a basic example of how to use next/dynamic:


```
import dynamic from 'next/dynamic';
import { useState } from 'react';
```

const   Modal = dynamic(()  =>  import('=./components/Modal'));


```
export const GenericComponent = ()  =>  {
const [isModalOpen, setIsModalOpen] = useState(false);
return (
<div>
<h1>Welcome to My Next.js App</h1>
<button onClick={()  =>  setIsModalOpen(true)}>Open Modal</button>
{isModalOpen  =&  <Modal onClose={()  =>  setIsModalOpen(false)} />}
</div>
);
};
```

In this example, the  Modal  component represents content that isn't needed when the appli-

cation first loads. When you use  next/dynamic  function, your application loads the com-

ponent only when required, preventing it from affecting the initial load time. This approach

improves performance, especially for non-essential UI elements.


```
Note:
```

Using next/dynamic  incorrectly can hurt Core Web Vitals  like  CLS  and LCP.

Avoid dynamic imports for above-the-fold elements and small, independent

components, as they should load immediately for a smooth user experience.

As a rule of thumb, it’s usually a good practice to dynamically import conditional UI ele-

ments such as:

�  Heavy Components   – Large third-party libraries (e.g., charts, maps, editors).

�  Rarely Used Components   – Modals, dialogs, or tooltips that aren’t always visible.

�  Device-Specific Components   – UI that differs between mobile and desktop.

�  Auth-Based Components   – UI elements that depend on user roles or authentica-

tion status.

�  Locale-Specific UI  – Different layouts or text-heavy components based on user

language.

Technically speaking, dynamic imports are most effective for components large enough to

impact performance, such as those involving complex data fetching, processing, or render-

ing. In contrast, they offer little benefit for small, static UI elements made up of just a few lines

of code.

The Ultimate Guide to Next JS Optimalization   |  9



<!-- Page 10 -->

Code splitting

## Example 1: dynamic tab content

This example demonstrates a dynamic approach to managing  multiple tabs. Code splitting

allows each tab component to be loaded on-demand when clicking the corresponding tab

button. Simply put, there's no need to import Tab2 and Tab3 if we're viewing only Tab1.


```
import { useState } from 'react';
import dynamic from 'next/dynamic';
const   DynamicTabs = {
Tab1: dynamic(()  =>  import('./Tab1')),
Tab2: dynamic(()  =>  import('./Tab2')),
Tab3: dynamic(()  =>  import('./Tab3'))
};
type   TabKeys = keyof typeof DynamicTabs;
export const HomePage = ()  =>  {
const [activeTab, setActiveTab] =  useState<TabKeys>('Tab1');
const TabContent = DynamicTabs[activeTab];
return (
<div>
<h1>Dynamic Tab Switcher</h1>
<button onClick={()  =>  setActiveTab('Tab1')}>Tab 1</button>
<button onClick={()  =>  setActiveTab('Tab2')}>Tab 2</button>
<button onClick={()  =>  setActiveTab('Tab3')}>Tab 3</button>
<div>
<TabContent />
</div>
</div>
);
};
```

## Example 2: Disabling SSR

To load a component only on the client side without using server-side rendering, we can dis-

able pre-rendering by setting the   ssr   option to  false. This setup will not pre-render the com-

ponent, so unless you provide a placeholder, that component will be replaced by something

else and loaded only on the client.


```
export const HeavyComponent = dynamic(()  =>  import('=./components/
header'), {
ssr: false,
loading: ()  =>  <div>Loading…</div>
});
Note:
```

When your application renders a component conditionally, it won’t perform

SSR even if you set the ssr option to true.Instead, the component will load only

when the conditions are met on the client side.

The Ultimate Guide to Next JS Optimalization   |  10



<!-- Page 11 -->

Code splitting

## Why might you choose to disable server-side rendering for a component?

1.  Using Browser-Specific APIs (e.g., window,   document) that aren't available
during SSR.

2.  Client-Side Only Libraries that may break during SSR (e.g., certain charting
libraries).

3.  Conditional Client-Side Rendering based on local state (e.g., feature flags in

```
localStorage).
```

4.  User-Specific Content that doesn't need pre-rendering (e.g., dates adjusted to
a user’s timezone).

There's also an option to add   a loading fallback. In this case, the suspense will render a fall-

back first, so instead of a layout shift, the end user will see the placeholder while the compo-

nent loads.


```
2.2.2. next/dynamic (App Router)
```

Next.js 13 introduced support for React Server Components, which are automatically code-

split by default. This support eliminates the need to manage code splitting for server compo-

nents manually. However, code splitting is still relevant when working with client components,

making it an important consideration. In this case, the approach to code splitting remains

almost the same as in the Pages directory.

Let's break down an example:


```
'use   client'
import dynamic from 'next/dynamic'
```

const   TrueClientComponent = dynamic(() =>  import('=./components/


```
TrueClientComponent'), { ssr: false  })
```

export const  ClientComponentExample  = () => {


```
return (
<div>
<TrueClientComponent />
</div>
)
}
```

You might notice something interesting:   why would we disable server-side rendering (SSR)

for a client component? The explanation is straightforward. By default, both  “use   client”

and server components are initially rendered on the server. By setting  ssr:  false,

TrueClientComponent  will not be pre-rendered on the server and will only execute on the cli-

ent side, providing  an actual true “client” component experience.

The Ultimate Guide to Next JS Optimalization   |  11



<!-- Page 12 -->

Code splitting

Let’s return to server components because we can also load them dynamically. However,

it's important to understand the implications:


```
import dynamic from 'next/dynamic'
const   ServerComponent = dynamic(()  =>  import('=./components/
ServerComponent'))
export const ServerComponentExample  = ()  =>  {
return (
<div>
<ServerComponent />
</div>
)
}
```

When a server component is dynamically imported, it primarily facilitates the lazy-loading

of any  nested client components  rather than directly optimizing the server-side loading of

its content.


```
2.2.3. Automatic Code Splitting
```

In Next.js, each page is loaded as a separate chunk, enabling route-based code splitting with

key benefits:

�  Isolated Error Handling:  Errors on one page don’t affect others, enhancing stability.

�  Optimized Bundle Size:  Users load only the code needed for visited pages, keeping

performance fast as the app grows.

�  Prefetching: Next.js preloads linked pages in the background, ensuring near-instant

navigation.

Next.js doesn’t support disabling code splitting, but you can achieve it by directly modifying

the webpack configuration.


```
Note:
```

It's worth noting that it works the same way in the   app directory. Shared

code is bundled separately and reused across pages, preventing duplicate

downloads.


```
2.2.4. External Modules
```

In modern web development, external modules or libraries enhance functionality without

requiring you to build everything from scratch. However, these modules can significantly in-

crease your JavaScript bundle size, impacting your performance. In Next.js, dynamic imports

help mitigate this issue by loading external modules only when needed, as we know how to

implement it for components. Let’s see how to implement it for modules.

The Ultimate Guide to Next JS Optimalization   |  12



<!-- Page 13 -->

Code splitting


```
Tip:
```

### It’s worth checking the bundle size of the packages you import to the proj-

### ect. You can find many popular websites for that purpose (e.g., bundlephobia,

### pkg-size) or IDE extensions (e.g., for VSCode import cost).

# Why Use Dynamic Imports for External Functions?

### �  Improved Initial Load Time:   Only load external modules when required, reduc-

### ing the initial load time. This approach is crucial for large libraries or features used

### conditionally.

### �  Optimized Resource Usage:   Download large modules only if the user interacts with

### the relevant feature, saving bandwidth and improving user experience.

### �  Scalability:  As your application expands, dynamic imports prevent performance

### degradation by limiting the modules loaded at startup.

### Here's an example using code splitting to load a heavy library:


```
import { useState, useRef } from 'react'
```

export const  PdfComponent = () => {


```
const [pdfReady, setPdfReady] = useState(false)
const pdfLibRef = useRef(null)
const handleInputFocus = async  () => {
if (!pdfLibRef.current) {
const jsPdfModule = await import('jspdf')
pdfLibRef.current = jsPdfModule.default
}
}
const handleGeneratePdf = async  (e) => {
e.preventDefault()
if (!pdfLibRef.current) {
const jsPdfModule = await import('jspdf')
pdfLibRef.current = jsPdfModule.default
}
```

=* Actual PDF generation logic  =/


```
setPdfReady(true)
}
return (
<div>
<form onSubmit={handleGeneratePdf}>
<input
type="text"
placeholder="Enter document title"
onFocus={handleInputFocus}
/>
<button type="submit">Generate PDF</button>
</form>
```

{pdfReady  =& <div>PDF Generated Successfully!</div>}


```
</div>
)
}
```

The Ultimate Guide to Next JS Optimalization   |  13



<!-- Page 14 -->

Code splitting

This example uses the external jsPDF library, which is a perfect candidate for dynamic im-

ports due to its size. The implementation includes two key performance optimizations:

1.  Preloading on Focus: The library starts loading when the user focuses on the input
field, before they even click the generate button.

2.  Module Caching with useRef: We store the imported module in a ref to ensure it's
only loaded once, even across multiple component renders.

This pattern improves user experience and performance by avoiding the initial bundle size

penalty and preventing input lag by intelligently timing when to load the library.


```
2.3  Keypoints
```

1.  We can use dynamic imports and 'next/dynamic' to load code only when needed,
reducing initial bundle size compared to static imports.

2.  Next.js automatically splits pages into separate chunks, enabling prefetching and
faster load times.

3.  Disabling server-side rendering ensures that a component loads only on the client.
4.  Large conditional UI elements like tabs, modals, and carousels benefit from dy-
namic imports.

5.  Dynamically imported server components dynamically import nested client com-
ponents but always load server-side.

6.  Code splitting separates pages and components into small chunks, reducing bun-
dle size.

The Ultimate Guide to Next JS Optimalization   |  14



<!-- Page 15 -->


```
Streaming,
Suspense   &
Hydration
PART 3
3.1. Overview
```

## What is streaming?

Streaming is a technique that allows you to break down the rendering process into smaller,

manageable chunks. Instead of waiting for all the data to load before showing the full page,

streaming lets your app render and send parts of the page as soon as they’re ready. This ap-

proach significantly improves your application's performance, as users can see and interact

with content much faster.

## Why does streaming matter?

Nowadays, users expect instant results. Even a few seconds of delay can increase bounce

rates and decrease conversions. Streaming addresses this challenge by:

�  Enhancing perceived performance  by displaying critical content first.

�  Reducing user frustration  by minimizing blank or loading screens.

�  Optimizing server efficiency by handling data transfer in chunks.

�  Improving SEO and conversions  through faster load times.

## What is hydration?

Hydration in web development refers to the process where a server-rendered or statically gen-

erated page becomes fully interactive on the client side. When using Server-Side Rendering

(SSR), the server generates and sends the initial HTML to the client. At this stage, the page is

functional but lacks interactivity powered by JavaScript

Certain built-in browser features, such as links and standard HTML forms, continue to work

without JavaScript. However, interactive components like modals, dropdowns, and dynamic

state management require JavaScript.

Hydration occurs when the client-side JavaScript framework, such as React, loads and reus-

es the pre-rendered HTML instead of generating it from scratch. It reconstructs the compo-

nent tree, associates the existing DOM elements with the corresponding React components,

and attaches event handlers. Lifecycle effects (such as useEffect in React) are also executed,

ensuring the application behaves as expected.

The Ultimate Guide to Next JS Optimalization   |  15



<!-- Page 16 -->

Streaming, Suspense & Hydration

Once hydration is complete, the page is fully interactive, with the client-side framework tak-

ing over rendering and state management.

## Hydration and Suspense

By wrapping individual components in <Suspense>, we break down the application into

smaller units called Suspense boundaries. React can prioritize the hydration of these small-

er chunks, starting with the most critical areas based on user interaction. This approach

leads to quicker interactivity for essential components while other parts of the app load

asynchronously.


```
Important:
```

The requirement for hydration is that the content rendered on the server and

client must be identical. If it’s not, a hydration mismatch error is thrown. The

error is minified in production environments, making it easy to miss, but it has

a significant impact. If this happens, the whole page falls back to client ren-

dering, which might cause a flash of content and slower Time to Interactive

times. Common things that cause hydration errors are:

1.  Usage of   typeof   window   conditional rendering in JSX.
2.  Local date formatting can be different than the one generated on
the server if the client uses different date formatting rules.

3.  Any random values that are different each time you call a function

```
e.g.,  Math.random().
```

In short, hydration is key to combining the best of both worlds:

�  the  speed  of a statically generated website

�  and the  interactivity  of a single-page application (SPA).

## What is the problem with hydration, then?

Despite its benefits, hydration's downside is the complexity and extra overhead it adds to web

applications. The entire app has to be rendered again in the browser and rehydrated, leading

to longer loading times and increased resource usage. Slow hydration can also negatively

impact the time it takes for the page to become interactive.

Here are the key issues associated with hydration in Next.js and similar frameworks:

�  Performance Overhead:  The browser must download, parse, and execute

JavaScript to rehydrate the page, increasing resource usage and load times.

�  JavaScript Bloat:  Large applications can accumulate excessive JavaScript, slowing

parsing and execution.

�  Delayed Interactivity:  Content appears instantly (SSR/SSG), but interactions will

not be available until hydration completes, frustrating users.

Let’s explore how to mitigate these issues in Next.js.

The Ultimate Guide to Next JS Optimalization   |  16



<!-- Page 17 -->

Streaming, Suspense & Hydration


```
3.2. Implementation
```

To optimize the hydration process in Next.js, we might suspend non-essential parts of the UI

using Suspense. This way, we can reduce the amount of JavaScript we have to request and

ensure that the crucial parts of the page remain responsive and interactive without unnec-

essary delays.


```
3.2.1. Progressive/Selective
Hydration & Suspense
```

Progressive hydration and selective hydration are techniques with similar goals but distinct

implementations. Progressive hydration, generally based on criteria set by developers, de-

termines which parts of the user interface (UI) are initially hydrated. This technique ensures

that key UI components become interactive first, following the developer's understanding of

application priorities.

Selective Hydration, builds upon Progressive Hydration by adding prioritization based on

user interactions.  It breaks down hydration into smaller units called Suspense boundar-

ies.  By wrapping individual components in <Suspense>, React can suspend the hydration

of these smaller chunks, starting with the most critical areas based on user interaction. This

technique leads to quicker interactivity for essential components while other parts of the app

load asynchronously.

In the Pages Router,   hydration required all JavaScript to be loaded and executed before

the page became interactive, often leading to performance bottlenecks on content-heavy or

complex pages, with no built-in options for optimization.

Thanks to the Next.js App Router, we can now easily enable Selective Hydration for almost any

part of a website by implementing Suspense to defer hydration of non-critical components.

Selective hydration breaks an app into smaller chunks wrapped in  <Suspense>  boundar-

ies. Critical components needed for immediate user interaction, like navigation, are hydrat-

ed first, while non-essential (suspended) parts load asynchronously in the background. This

approach reduces perceived load time and improves the app's responsiveness, particularly

in complex applications.

## Key Features and Improvements

�  Streaming HTML

HTML is streamed to the client progressively as it's rendered on the server. When

ready, components inside <Suspense> boundaries will have their content streamed

in smaller units.

�  Prioritization of Hydration

Hydration is prioritized based on the order of user interactions and the natural ren-

dering order of the component tree. React will first hydrate the nearest Suspense

boundary that the user interacts with, ensuring critical functionality is available

promptly.

�  Reduced Blocking

The Pages Router required hydrating the entire page before any interaction. With

Selective Hydration, React handles boundaries in smaller chunks, avoiding

the blocking of unrelated components.

The Ultimate Guide to Next JS Optimalization   |  17



<!-- Page 18 -->

Streaming, Suspense & Hydration


```
import { Suspense } from 'react';
import Comments from './comments';
import Sidebar from './sidebar';
import Spinner from './spinner';
```

export const  PageContent = () => {


```
return (
<main>
<h1>Welcome to the Blog</h1>
<Suspense fallback={<Spinner />}>
<Sidebar />
</Suspense>
<article>
<h2>Main Article</h2>
```

<p>Content of the main article==.</p>


```
</article>
<Suspense fallback={<Spinner />}>
<Comments />
</Suspense>
</main>
);
};
```

## Explanation

�  Suspense with Server Components:   The server-side data fetching ensures data is

available before sending the initial HTML to the client. By wrapping components like

Comments and Sidebar in <Suspense>, these sections can be loaded independent-

ly, with loading handled asynchronously.

�  Selective Hydration:  Once the server-side HTML is delivered, only the necessary

JavaScript is loaded, prioritizing hydration based on the user's immediate needs.


```
3.3. Keypoints
```

1.  Hydration adds performance overhead due to extra JavaScript, leading to
JavaScript bloat, delayed interactivity, and resource-intensive downloads, but fast

initial pages must be served from the server.

2.  Progressive and Selective Hydration aim to improve performance by not hydrating
the entire page at once.

3.  React's Suspense feature allows breaking hydration into smaller chunks, enabling
selective loading and prioritizing critical functionality.

4.  Next.js App Directory streams HTML progressively to the client, using Suspense
boundaries to prioritize and hydrate content dynamically.

The Ultimate Guide to Next JS Optimalization   |  18



<!-- Page 19 -->


```
Next/Image
Component
PART 4
4.1. Overview
```

Images are often the heaviest resources in web applications, directly influencing performance

and user experience. Slow loading times and high data consumption can frustrate users and

lower engagement. Nowadays, image optimization is a must if you want your app to deliver

a seamless, responsive, and visually appealing experience.

And this is where the next/image  component comes into play. Designed as a powerful, built-in

image optimization solution for Next.js projects, it offers responsive image sizing, lazy loading,

compression, automatic  srcset   generation, and much more. This solution ensures images

load quickly and efficiently across all devices without compromising quality.

In this chapter, we'll show why  next/image is an excellent tool for managing images and solv-

ing issues like slow performance, high data usage, and slow rendering. You'll also discover

how to use features like responsive sizing, image prioritization, placeholders, and blur effects

to improve your visuals.


```
4.2. Implementation
```

So, before we start implementing the  next/image, the first question is why we should use it

instead of the traditional  img   tag. The answer is simple–it provides all the essential optimi-

zations out-of-the-box and simplifies implementing the more advanced ones.

Using the  next/image  is generally a good choice. However, if your app has a lot of images,

using that feature on some hosting providers can get expensive. For example, Vercel charges

for each optimized image.

## What if you don’t want to use the next/image for some reason?

It isn't the only way to optimize images in Next.js. While it's user-friendly and makes main-

taining your app easier, you can always use other standard methods for image optimization,

such as:

�  lazy loading below the fold,

�  setting  fetchpriority   for critical images,

The Ultimate Guide to Next JS Optimalization   |  19



<!-- Page 20 -->

Next/Image Component

�  decoding images asynchronously,

�  or setting  srcset   manually.

In fact,  next/image   uses these techniques under the hood but requires much less config,

which makes it an excellent choice. For this reason, in this chapter, we’ll only focus on using

the  next/image.

Now, let's delve into some fundamental guidelines for optimizing images that help achieve

optimal performance.


```
4.2.1. Prioritize critical images
and   lazy load non-critical
```

Managing how images load is crucial based on their importance and position on the page.

For images that are immediately visible, known as "above the fold," you can use the priority

attribute with the Next.js Image component to improve the loading strategy. This attribute

instructs the browser to preload these images, deeming them high priority and skipping lazy

loading.


```
import Image from "next/image";
```

export const  Page = () => (


```
<div>
<Image
src="/images/lcp-image.png"
alt="LCP Image"
priority
width={1000}
height={500}
/>
```

{/* Below the fold content  =/}


```
</div>
);
```

This approach is particularly useful for images contributing to the Largest Contentful Paint

(LCP). The traditional img tag indeed has a similar attribute called "loading." But does setting

it to "eager" achieve the same effect as the "priority" attribute in next/image?

## What is the difference between loading="eager" and the priority prop?

�  for plain HTML using loading="eager": When applied to an HTML   img tag, this

attribute ensures that the image downloads immediately as the browser processes

the HTML. The eager attribute signals the browser to prioritize fetching the image.


```
<img src="path/to/image.jpg" alt="Description of image" loading="eager" />
```

�  for JSX and next/image component using the  priority  attribute:   This attribute

instructs Next.js to include a  <link   preload>   tag at the top of your page. This

approach is more aggressive than plain HTML’s   loading="eager"   because it

prompts the browser to load the image even before the HTML is fully parsed, opti-

mizing the loading process for critical resources.

The Ultimate Guide to Next JS Optimalization   |  20



<!-- Page 21 -->

Next/Image Component


```
import Image from 'next/image';
export const MyComponent = ()  =>  {
return (
<div>
<Image
src="/path/to/image.jpg"
alt="Description of image"
width={500}
height={300}
priority
/>
</div>
);
};
```

Some notes here: next/image also supports loading="eager|lazy,"  just like plain HTML.

However, we advise applying it and recommend using the  priority   prop instead. Keep in

mind that using the  loading   prop on next/image is for advanced use cases and typically

worsens performance.


```
Worth   knowing:
```

In most cases, it doesn't make a noticeable difference. However, when pro-

grammatically adding images to the DOM, you should pay extra attention to

the decoding property.

Using  decoding="sync"   ensures that the  <img/>  tag and the surrounding

<div>  remain hidden until the decoding is complete. However, this approach

will block other unrelated rendering processes for the next tick(s), which is

the intended visual behavior.

On the other hand,   decoding="async"   doesn't block other resources from

(re)rendering. It also does not guarantee that the   <img/>   and surrounding

<div>  will be visible only after the image has finished loading. For example, if

the  <div>  has an orange background, you will see a flash of orange, which is

likely not the intended visual behavior. Choose the option that best fits your

needs when programmatically adding elements to the DOM!


```
4.2.2   Image placeholders and blur
```

You may want to display the placeholder while the images load. It can be easily achievable

using the  'placeholder'   property from next/image. The placeholder can be one of the fol-

lowing values:

1.  empty  – The default value set for all the images. This means that no placeholder is
set and there is no visual representation of the loading state.

2.  blur   – When you specify it, the app displays a blurry version of the im-
age during loading. When it comes to the dynamic images – here, along with

the  placeholder="blur"   you   must use   the  blurDataURL   property and specify

The Ultimate Guide to Next JS Optimalization   |  21



<!-- Page 22 -->

Next/Image Component

the blurhash manually if your image hosting provider supports returning it from

the server.

The placeholders indicate to the user that the site is not broken and that something will be put

in place for the temporary value in the image container. They also prevent some layout shifts.


```
4.2.3. Use modern image formats
```

Using modern image formats like WebP and AVIF in your web applications can significantly

enhance performance by reducing file sizes and improving page load times. In the context

of Next.js, this process is being streamlined with the Image component. It automates the de-

livery of images in the most efficient format supported by the user's browser.


```
Worth   knowing:
```

Progressive JPGs load in stages, initially displaying a full but blurry image

that gradually sharpens, unlike standard baseline JPGs, which load from top

to bottom.

In case of

�  very slow internet connections (e.g., apps targeting developing

countries),

�  large and detailed images,

�  or downloadable content.

Progressive JPGs can be a better choice than WebP due to their perceived

loading speed advantage.

## How Automatic Image Optimization Works in Next.js?

Using the next/image module component automatically converts images into more efficient

formats, depending on browser support. This means that even if the original image is in JPEG

or PNG format, Next.js can serve it in a format that results in smaller file sizes and (in most

scenarios) faster loads.


```
import Image from 'next/image';
export const Component = ()  =>  (
<div>
```

<Image src="https:=/example.com/path/to/your/image.jpg"


```
alt="example" priority />
</div>
);
```

The Ultimate Guide to Next JS Optimalization   |  22



<!-- Page 23 -->

Next/Image Component

So, if we quickly revisit the previous example, it's important to note that   "example.png"   will

be served as a WebP image instead of a PNG file.


```
import Image from 'next/image';
const Page = ()  =>  (
<div>
<Image src="/images/example.png" alt="example" priority />
<Image src="/images/example.png" alt="example" />
</div>
);
export default Page
Worth   knowing:
```

By default, Next.js will use only WebP format.

AVIF has to be enabled explicitly. It is important to actively pick the best im-

age format for your application, as this is often overlooked.

## Fine-Grained Image Format Control

While automatic image optimization is beneficial, you might want to disable this behavior in

some situations.

For example:

�  certain applications may require the original format for compatibility reasons,

�  or you might want to maintain specific visual qualities that the optimization process

could alter.

Here are some scenarios when automatic optimization might not be suitable:

�  Compatibility with Legacy Systems:  If your application interfaces with older sys-

tems that do not support modern image formats like WebP (Next.js serves opti-

mized images as WebP by default) or AVIF, you may need to keep the images in their

original format.

�  Preserving Image Quality: It might be better to use the original format in cases

where the original image has specific qualities (like color fidelity or transparency)

that might be affected by conversion.

�  Already Optimized Images:  If you have images that are already optimized (for ex-

ample, images generated by tools like ImageOptim or TinyPNG), serving them in

their original format may be preferable to avoid unnecessary processing and poten-

tial quality loss.

�  Vector Images (SVG):  Automatic image optimization isn’t ideal for SVGs because it

can remove the advantages of using vector graphics, such as scalability and main-

taining the original quality. Converting SVGs to raster formats like WebP during

The Ultimate Guide to Next JS Optimalization   |  23



<!-- Page 24 -->

Next/Image Component

optimization can remove important elements. Also, SVGs are typically small and

don’t need aggressive optimization.

�  Large Amount of Images:  Automatic optimization can be expensive when handling

a large number of images. In these cases, manual control over image formats and

optimizations could be more efficient, especially cost-efficient.

To disable automatic image optimization in Next.js, you can use the   unoptimized   prop in

the  next/image   component. This prop instructs Next.js to serve the image in its original for-

mat without any conversion or optimization.


```
import Image from 'next/image'
export const Component = ()  =>  {
return (
<div>
<Image
```

src="/path/to/your/image.jpg"  =/ Original image path


```
alt="Description of image"
width={500}
height={300}
```

unoptimized  =/ Disable automatic optimization


```
/>
</div>
)
}
4.2.4. Set sizes Appropriately
```

Correctly sizing images is vital for optimal web performance, minimizing layout shifts, and

ensuring visuals appear sharp on various devices. The next/image simplifies this task, of-

fering several methods to specify image dimensions and behavior depending on specific

requirements.

## Three Approaches to Image Sizing in Next.js

1.  Automatic Sizing for Static Imports
Next.js can automatically determine the dimensions of locally stored images imported stat-

ically, helping the browser reserve the space needed before the image loads. This approach

prevents layout shifts and ensures smooth rendering.


```
import Image from 'next/image';
```

import teamPhoto from  '=./public/team.jpg';  =/ Static import of an image


```
export const Home = ()  =>  {
return (
<div style={{ width: '500px', height: 'auto' }}>
<h1>Meet Our Team</h1>
<Image
src={teamPhoto}
alt="Our team standing together"
/>
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  24



<!-- Page 25 -->

Next/Image Component

### 2.  Explicit Sizing with Width and Height Properties

### Set explicit width and height for remote images or fixed dimensions to help the browser al-

### locate the right space. This straightforward method ensures images are rendered at the in-

### tended size, avoiding unexpected layout shifts.


```
import Image from 'next/image';
```

export const  ProductPage = () => {


```
return (
<div style={{ width: '800px', margin: 'auto' }}>
<h2>Featured Product</h2>
<Image
```

src="https:=/example.com/product.jpg"


```
alt="Newest model of a high-tech gadget"
width={800}
height={600}
/>
</div>
);
};
```

### 3.  Implicit Sizing with the Fill Property

### The fill property allows an image to expand and cover its parent container, making it ideal for

### dynamic sizing or adapting to varying display dimensions. It's particularly useful when the ex-

### act image size isn't known in advance and must adjust to the layout dynamically.


```
import Image from 'next/image';
```

export const  Banner = () => {


```
return (
<div style={{ width: '100%', height: '400px', position: 'relative'
}}>
<Image
src="/banner.jpg"
alt="Promotional banner image"
fill
```

style={{ objectFit: 'cover'  }}  =/ Ensures the image covers the


```
full   area of the container
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
</div>
);
};
```

The Ultimate Guide to Next JS Optimalization   |  25



<!-- Page 26 -->

Next/Image Component

Why use the sizes attribute with the fill layout?

The sizes attribute is essential when using the fill layout, as it tells the browser which image

size to load based on the screen resolution.

Without the sizes attribute, the browser may download a larger image than necessary, lead-

ing to longer load times and higher data usage. By setting conditions such as   (max-width:

768px) 100vw, (max-width: 1200px) 50vw, or 33vw, you ensure the browser loads an appro-

priately sized image, preventing excessive bandwidth usage and improving performance.


```
Note:
```

Without the 33vw size setting, the browser would select an image three times

wider than needed. Since file size grows with the square of the width, the user

would end up downloading an image nine times larger than necessary.

Next.js can automatically handle resizing for full-width images, but explicitly defining sizes

can improve performance.

The Ultimate Guide to Next JS Optimalization   |  26



<!-- Page 27 -->

Next/Image Component

4.  deviceSizes and imageSizes in the project configuration
If you know the types of devices your users have, you can configure   deviceSizes  and

imageSizes  to ensure images are resized correctly for optimization. These configuration

properties serve different purposes, which are explained below:

�  deviceSizes: Defines breakpoints for full-width images, with a default set of


```
[640,   750,   828,   1080,   1200,   1920,   2048,   3840]. Use this when targeting
```

specific device widths. These breakpoints help Next.js choose the appropriate im-

age size based on the device’s viewport width.

�  imageSizes: Used for images smaller than the viewport width (when using the 'sizes'

prop). The default values are  [16,   32,   48,   64,   96,   128,   256,   384], and each

must be smaller than the smallest value in  deviceSize.

In summary, sizing images appropriately with Next.js's Image component prevents layout

shifts and optimizes loading times and bandwidth usage, ensuring your website performs

well across all devices and resolutions.


```
4.2.5. Image quality
```

Setting the right image quality is essential to optimizing your web application's performance

and user experience. While the default quality setting of  75  typically strikes a good balance

between file size and visual experience, there are situations where adjusting this parameter

can further enhance your website.

Pros & Cons of Manipulating Image Quality:

Enhanced Visuals: Higher quality ensures that images look crisp and detailed on

high-definition displays or when they are a focal point (like in a photography portfolio).

Brand Image: High-quality images can reflect more professionally on your brand,

which might be critical in e-commerce and digital marketing.

User Experience: Sharper, more vibrant images can improve user engagement and sat-

isfaction, potentially leading to longer site visits.

Longer Loading Times

More Bandwidth Usage

Visual Artifacts: Reduced quality can introduce noticeable imperfections like pixelation

or compression artifacts, potentially impacting the image's overall visual appeal.

The Ultimate Guide to Next JS Optimalization   |  27



<!-- Page 28 -->

Next/Image Component

Here's how to explicitly set the image quality in Next.js to tailor the user experience based

on your specific needs.


```
import Image from 'next/image';
```

export  const SimpleImage = () =>  {


```
return (
<Image
```

src="/path-to-your-image.jpg"  =/ Replace with your image path or


```
URL
alt="A description of the image"
width={800}
height={500}
```

quality={80}  =/ Set image quality from 0 to 100. Default is 75.


```
/>
);
}
```

Considerations:

�  Assess Needs: Determine the importance of image quality vs. performance for your

application. For instance, a blog with many images might prioritize lower quality for

speed, whereas an art gallery website would benefit from higher-quality settings.

�  Test Changes: Use tools like  Lighthouse to measure how changes in image quali-

ty affect performance and loading times. Observe the balance between quality and

performance to find the optimal setting for your use case.


```
Note:
```

These considerations apply to raster images (e.g., JPEG, WebP, PNG). The de-

fault loader generally does not optimize vector images (e.g., SVG) because

they can be resized without losing quality. Additionally, SVG optimization is

limited due to security concerns related to the format.

If you want to use next/image   for SVGs, the unoptimized   flag is recommended, but Next.js

also turns optimization off automatically when the image’s src ends with ".svg."

The Ultimate Guide to Next JS Optimalization   |  28



<!-- Page 29 -->

Next/Image Component


```
4.3. Keypoints
```

1.  Next <Image> component automatically converts your images to modern formats
like AVIF or WebP. Still, you should always consider which image format best suits

your needs.

2.  If there are no specific needs, use the default WebP format, which the next image
provides by default for static images.

3.  Images with the largest LCP should be loaded with priority attributes.
4.  Images other than LCP but above the fold should always be assessed to determine
whether the priority attribute is beneficial.

5.  Images located below the fold should have lazy loading enabled.
6.  Always include the sizes attribute when using the layout="fill" setting.
7.  Experimenting with different image qualities can yield optimal results.
8.  Use the  unoptimized   prop to skip optimization for specific images.
The Ultimate Guide to Next JS Optimalization   |  29



<!-- Page 30 -->


```
Third-Party
Scripts
PART 5
5.1. Overview
```

Script loading is critical to web development because it directly affects website performance,

influencing user experience and search engine optimization (SEO). Understanding how these

scripts interact with a browser's main thread is essential to optimizing loading times and

page responsiveness.

## Impact on the Main Thread

The main thread parses HTML, executes JavaScript, and renders page content. Since

JavaScript is inherently blocking, when the browser encounters a script, it must pause other

tasks until the script is downloaded and executed. This blocking behavior can cause signifi-

cant delays in page interactivity and visual stability, especially if the script is large or served

from a slow server.

�  Blocking Behavior: Scripts loaded without attributes like async or defer are ren-

der-blocking. When scripts lack these attributes, the browser stops parsing HTML

until the JavaScript is fully executed. This lack of attributes can cause delays in page

loading, particularly when such scripts are placed inside the <head> element.

�  Main Thread Utilization:  Main Thread Utilization: Heavy scripts can monopolize

the main thread, delaying rendering and the page’s readiness for interaction. These

heavy scripts can severely impact user experience by making the page sluggish

and unresponsive.

Script Loading Strategies to Mitigate Blocking:

�  <script> in <head>: Highly critical scripts that affect the DOM structure of the entire page.

�  <link rel="preload"> + <script async> or <script type="module" async>:  Medium to

high priority scripts that generate critical content.

�  <script async>:  Often used for non-critical scripts.

�  <script defer>: Low priority scripts.

�  <script> at the end of <body>: Lowest priority scripts that may be used occasionally.

Pretty complicated, isn't it?

Fortunately, Next.js introduces a more streamlined and efficient method.

The Ultimate Guide to Next JS Optimalization   |  30



<!-- Page 31 -->

Third-Party Scripts


```
5.2. Implementation
```

Next.js provides developers with the powerful next/script  component to simplify and optimize

script handling in modern web applications. It manages scripts intelligently based on load-

ing performance and priority, helping to overcome the limitations of traditional script tags.

The component also offers greater flexibility by supporting callback functions such as onLoad,

onReady, and onError, allowing developers to control script behavior better and respond to

loading events.

Let’s dive deeper and understand its full capabilities.


```
5.2.1. beforeInteractive
```

The beforeInteractive loading strategy is for scripts that must run before the page becomes

interactive. These scripts are embedded directly into the server-rendered HTML and are pri-

oritized for early download and execution. This loading strategy ensures critical scripts influ-

ence the page’s initial load and behavior without delay.

## Code Placement:

Scripts tagged with   beforeInteractive  are automatically placed within the <head> tag of

the HTML document, and they include the defer attribute. This setup allows the browser to

parse the HTML without blocking, download the script early, and execute it before the page

is hydrated.

## Use Cases:

�  Critical Third-Party Integrations:  Load essential services like payment gateway

SDKs (e.g., Stripe, PayPal) early to ensure users can perform transactions without

delay.

�  Security Measures:   Run critical security scripts, such as those enforcing a Content

Security Policy (CSP) or setting up feature policies, before other resources load to

establish security settings immediately.


```
import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
const   Document = ()  =>  {
return (
<Html>
<Head />
<body>
<Main />
<NextScript />
<Script
strategy="beforeInteractive"
src="/path/to/bot-detector.js"
/>
</body>
</Html>
);
};
export default Document;
```

The Ultimate Guide to Next JS Optimalization   |  31



<!-- Page 32 -->

Third-Party Scripts


```
5.2.2. afterInteractive
```

The  afterInteractive  strategy loads scripts right after the page becomes interactive. It is

meant for scripts that are important but not as critical as those using beforeInteractive. These

scripts are injected on the client side and load only after Next.js completes hydration.

## Code Placement:

You can place   afterInteractive  scripts anywhere within your components. They will execute

only when the page or component containing them is rendered in the browser.

## Use Cases:

�  User Interaction Trackers:   Scripts that track user interactions or site engage-

ment (e.g., Google Analytics, Facebook Pixel) should load immediately after the site

becomes interactive to start capturing data. However, these are not critical to

the page’s initial functionality.

�  Live Chat Support:  Systems like Intercom or Drift should load right after hydration

so they're ready when needed without affecting the initial page load.

�  Feedback: Tools like Hotjar or Usabilla, which gather feedback on usability and user

experience, can be initialized once the user interacts with the page.


```
import Script from 'next/script';
export const Analytics = ()  =>  {
return (
<Script
strategy="afterInteractive"
```

src="https:=/==w.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_


```
ID"
/>
);
};
5.2.3. lazyOnLoad
```

lazyOnload scripts are loaded during the browser's idle time using requestIdleCallback, en-

suring they do not impact the page's critical load path. This solution is ideal for non-essential

functionalities that can wait until all higher-priority tasks are complete.

## Code Placement:

You can place   afterInteractive  scripts anywhere within your components; they will only exe-

cute when the browser renders the containing page or component.

## Use Cases:

�  Social Media Widgets:  Widgets for social media platforms (e.g., Facebook Like but-

tons or Twitter posts) that are non-essential but enhance user engagement once

the page has fully loaded.

The Ultimate Guide to Next JS Optimalization   |  32



<!-- Page 33 -->

Third-Party Scripts

�  Advertisement Scripts: Ad scripts that need to be present but not loaded at high

priority, ensuring that the primary content loads uninterrupted while ads load in

the background during idle time.

�  Additional Multimedia Content:  Loading scripts for interactive maps, image galler-

ies, or embedded video players that are not critical to the initial user experience but

can enhance the page content once loaded.


```
import Script from 'next/script';
```

export const  SocialMediaWidget = ()  => {


```
return (
<Script
strategy="lazyOnload"
src="/path/to/social-media-widget.js"
/>
);
};
5.2.4. Enhancing Script  Management
with   Callback Functions
```

Next.js improves script management by supporting callback functions like onLoad, onReady,

and onError. These callbacks give developers more control over script behavior at different

stages of the loading process:

�  onLoad: Executes when the script has successfully loaded.

�  onReady: Ensures the script is fully loaded and ready to execute. This is particular-

ly useful for scripts with complex dependencies or those that need to interact with

other loaded scripts.

�  onError: Executes if the script fails to load, allowing developers to handle errors

gracefully, such as falling back to default functionality or loading an alternative

script.

Here’s how you might use these callbacks in a Next.js project:


```
import Script from 'next/script';
```

export const  CustomScript = () => {


```
return (
<Script
```

src="https:=/example.com/important-script.js"


```
strategy="beforeInteractive"
```

onLoad={() => console.log("Script loaded successfully!")}

onReady={() => console.log("Script is ready to execute!")}

onError={(e) => console.error("Script failed to load!", e)}


```
/>
);
};
```

The Ultimate Guide to Next JS Optimalization   |  33



<!-- Page 34 -->

Third-Party Scripts


```
5.2.5. Next-third-parties
```

The  @next/third-parties   library simplifies integrating and managing popular third-par-

ty scripts in Next.js apps by providing pre-built components tailored for common use cases.

By building on the <Script>  component in Next.js, you can optimize loading strategies and

improve the developer experience when handling external scripts.

## Use Cases:

�  Google Tag Manager (GTM): Easily integrate GTM without manually configuring

a  <Script>   component for each tag.

�  Google Analytics: Simplify Google Analytics integration using a single, pre-config-

ured component that ensures optimal performance.

�  Social Media Embeds: Pre-built components for popular embeds like YouTube and

Google Maps make it easy to add these features with minimal setup.

�  Optimized Loading: The components apply strategies like   lazyOnload   and can be

configured to use web workers, helping reduce main-thread usage and improving

performance.


```
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/
google";
import { YouTubeEmbed } from "@next/third-parties/youtube";
const   Layout = ({ children  }) =>  {
return (
<html lang="en">
<body>
{children}
<GoogleTagManager gtmId="GTM-XYZ" />
<GoogleAnalytics gaId="G-XYZ" />
<YouTubeEmbed videoid="dQw4w9WgXcQ" height={400} />
</body>
</html>
);
}
export default Layout
```

It also provides useful utility functions like sendGTMEvent for interacting with the GTM data

layer. These functions simplify development and make code easier to understand.

The Ultimate Guide to Next JS Optimalization   |  34



<!-- Page 35 -->

Third-Party Scripts


```
5.3. Keypoints
```

1.  The next/Script component simplifies adding and managing scripts in Next.js
applications.

2.  The beforeInteractive strategy loads scripts before the page becomes interactive,
making it ideal for critical scripts needed immediately.

3.  The afterInteractive strategy loads scripts after the page becomes interactive, en-
suring they don’t block the initial rendering.

4.  The lazyOnload strategy loads scripts in the background after the page fully loads,
minimizing their impact on performance.

5.  Support for external scripts enables seamless integration of analytics, advertise-
ments, and third-party tools with no harm for performance.

6.  Optimized script handling improves Core Web Vitals, boosting SEO rankings and
enhancing the overall user experience.

The Ultimate Guide to Next JS Optimalization   |  35



<!-- Page 36 -->


```
Font
optimization
PART 6
6.1. Overview
```

The traditional approach to handling fonts in web development encountered several problems

that could negatively impact both performance and user experience:

�  Recurrent Network Requests:  Without proper font caching strategies (e.g., miss-

ing cache control headers), the browser could repeatedly request fonts each time

a page loads. This unnecessary traffic increases bandwidth usage and slows down

page load times, especially on slower connections.

�  Flash of invisible text (FOIT):  When fonts are downloaded asynchronously to avoid

blocking DOM rendering, delays can cause the text to appear late, disrupting

the user’s reading experience.

�  Flash of unstyled text (FOUT): Fallback fonts may initially display before switching

to the web font once it's loaded, causing visible layout shifts that can be jarring to

users. These shifts also negatively impact Core Web Vitals, important metrics for

user experience, and SEO.

�  Manual Configuration Complexity:  Developers had to manually configure CSS

properties like  font-display   to control font loading behavior. Balancing perfor-

mance and visual stability required careful tuning, making the process error-prone

and time-consuming.

�  Inefficient Format and Resource Usage:  Without optimization, browsers might

download larger or outdated font formats instead of more efficient ones like WOFF2.

Although modern browsers prioritize better formats by default, inefficiencies can still

occur.

This is where the `next/font` feature comes in, addressing the limitations of traditional font

management with built-in improvements and automation. Let’s explore how it works and

the benefits it offers.

The Ultimate Guide to Next JS Optimalization   |  36



<!-- Page 37 -->

Font optimization


```
6.2. Implementation
```

For instance, next/font offers two key advantages that are highly valuable in modern web

development:

�  Reducing Layout Shifts: By automatically applying the CSS `size-adjust` proper-

ty, next/font preserve maintain the layout during font loading. It minimizes layout

shifts, which are a common issue affecting user experience.

�  Efficient Font Loading: Instead of relying on external font requests, next/font allows

developers to include fonts directly in the project. During the build process, Next.js

downloads the necessary font and CSS files and bundles them with the application,

serving them as part of a unified deployment package.

Additionally, next/font supports all Google Fonts with performance and privacy in mind. Font

and CSS files are downloaded at build time and self-hosted alongside your static assets.   If

configured correctly, the browser does not send requests to Google.

Here’s an example of how to implement Google Fonts using next/font in a Next.js application:


```
import { Inter } from 'next/font/google';
const   inter = Inter({
subsets: ['latin'],
display: 'swap',
});
export const RootLayout = ({ children }: { children: React.ReactNode })
```

=>  {


```
return (
<html lang="en" className={inter.className}>
<body>{children}</body>
</html>
);
};
```

In summary, next/font is a powerful tool that automates many complex, time-consum-

ing tasks in web font optimization. It streamlines font loading, resource delivery, and layout

stability—reducing developer effort while improving the performance and reliability of web

applications.

By handling the details of font management, next/font lets developers focus on other parts

of their projects. This ensures that fonts enhance both aesthetics and user experience with-

out the need for manual tuning.

The Ultimate Guide to Next JS Optimalization   |  37



<!-- Page 38 -->

Font optimization


```
Note:
```

Similar to next/image, there are also manual methods to boost the perfor-

mance, such as:

�  font-display: swap

�  using system fonts instead of external ones

�  preloading fonts

But with tools like   next/font   available, the manual effort and configuration

required by other methods is rarely worth it..


```
6.2.1 Using Variable Fonts
```

For an even more sophisticated approach and optimal performance, consider utilizing

Variable Fonts. Although this format was introduced in 2016, it remains underutilized, resulting

in many web applications missing out on significant font-related performance optimizations.

Variable Fonts eliminate the need for multiple files for different styles and weights, significant-

ly reducing overall file size and providing complete control over typography.

With Variable Fonts, you are not limited to predefined weights and styles; instead, you can

select any weight and combine it with optical size adjustments. This fine-grained control can

significantly enhance your application's design, elevating it to new heights.

One key benefit of using Variable Fonts is  enhanced performance, which is achieved through

a single file that can significantly reduce overall size when dealing with fonts with multiple

weights and styles.

Variable fonts encapsulate multiple styles (weight, width, and slant) into a single font file, re-

ducing the overall number of font files that need to be loaded, minimizing bandwidth usage,

and improving load times.

Since multiple styles are contained in one file, browsers can cache a single variable font

file, further enhancing performance. It can also help with FOUT, as different styles will load

simultaneously.


```
6.3. Keypoints
```

1.  Layout Stability: next/font prevents flickering and possible layout shifts by auto-
matically adjusting CSS properties.

2.  Efficient Loading: Bundles fonts directly with applications, eliminating external
requests.

3.  Self-Hosting: Downloads and serves fonts like those from Google Fonts locally, re-
ducing reliance on third-party services and potentially improving performance.

4.  Simplified API: Offers an easy-to-use API for font management, reducing
complexity.

The Ultimate Guide to Next JS Optimalization   |  38



<!-- Page 39 -->


```
Rendering
PART 7
7.1  Overview
```

Rendering is a core part of web performance and directly affects how fast users can see and

interact with content. In Next.js, choosing the right rendering strategy is essential for balanc-

ing speed, flexibility, and scalability.

Next.js offers multiple rendering strategies, including:

�  Server-Side Rendering (SSR),

�  Static Site Generation (SSG),

�  Incremental Static Regeneration (ISR),

�  and Client-Side Rendering (CSR).

The introduction of the App Router brings new paradigms like React Server Components

(RSC), which improve performance by optimizing data fetching and reducing client-side

JavaScript and application complexity. Gaining a solid understanding of how this works is

essential.

Now, let’s dive into the implementation.


```
7.2  Implementation
```

In this chapter, we’ll explore:

�  how rendering strategies differ between the App Router and the Pages Router,

�  the key elements in both approaches,

�  how to decide which approach fits your use case,

�  and best practices to optimize performance.

We will do so using code implementation, as code says more than a thousand words.

The Ultimate Guide to Next JS Optimalization   |  39



<!-- Page 40 -->

Rendering


```
7.2.1. App Router Rendering Strategies
```

## 7.2.1.1. Elements

## Server Components

Server Components represent a fundamental shift in how we build React applications. Unlike

traditional components that execute both on the server and client, Server Components run

exclusively on the server, sending lightweight JSON representation or the rendered HTML to

the client. This approach combines the best aspects of server-side rendering with the com-

ponent-based architecture that makes React powerful.

Let's explore how Server Components work in detail.

Core Characteristics:

1.  Server-Side Execution
=/  app/products/page.tsx


```
async function ProductsPage() {
```

=/ This code only runs on the server


```
const products = await db.query('SELECT * FROM products');
return <ProductList products={products} />;
}
```

�  All code executes in the server environment.

�  Direct database access without API layers.

�  Secure handling of sensitive data.

�  Reduced risk of exposing business logic.

2.  Bundle Size Optimization
=/  This large dependency only exists on the server


```
import {  massive_library  } from 'huge-package';
export default function DataVisualizer() {
```

const processedData =  massive_library.process(data);


```
return <div>{processedData}</div>;
}
```

�  Dependencies don't impact client bundle size.

�  Improved initial page load performance.

�  Reduced memory usage on client devices.

The Ultimate Guide to Next JS Optimalization   |  40



<!-- Page 41 -->

Rendering

### 3.   Built-in Data Fetching


```
async function BlogPost({ id }) {
```

=/ Fetch runs on server, result included in initial HTML


```
const post = await fetch(`/api/posts/${id}`);
const data = await post.json();
return <article>{data.content}</article>;
}
```

### �  Streamlined data access patterns.

### �  No useEffect for data fetching.

### �  Improved SEO with complete initial HTML.

### Limitations and Considerations:

### 1.  Browser APIs

=/  This won't work in a Server Component


```
function WindowSizeDisplay() {
=/  ❌  Error: window is not defined
const width = window.innerWidth;
return <div>Width: {width}px</div>;
}
```

### 2.  Interactive Features

=/  This needs to be a Client Component


```
function Button() {
=/  ❌  Error: useState is not available in Server Components
const [clicked, setClicked] = useState(false);
```

return  <button onClick={() => setClicked(true)}>Click me</button>;


```
}
```

### 3.   State Management

=/  This must be moved to a Client Component


```
function Counter() {
=/  ❌  Error: Can't use hooks in Server Components
const [count, setCount] = useState(0);
return <div>{count}</div>;
}
```

The Ultimate Guide to Next JS Optimalization   |  41



<!-- Page 42 -->

Rendering

### Optimal Use Cases:

### 1.  Data-Heavy Components


```
async function UserDashboard() {
const userData = await fetchUserData();
const analytics = await fetchAnalytics();
const recommendations = await generateRecommendations();
return (
<div>
<UserProfile data={userData} />
<AnalyticsDisplay data={analytics} />
<Recommendations items={recommendations} />
</div>
);
}
```

### 2.  SEO-Critical Content


```
async function BlogPost() {
const post = await fetchPost();
return (
<article>
<h1>{post.title}</h1>
<div dangerouslySetInnerHTML={{  __html:  post.content }} />
<MetaTags
title={post.title}
description={post.excerpt}
/>
</article>
);
}
```

### 3.   Static Content


```
function PrivacyPolicy() {
return (
<div>
<h1>Privacy Policy</h1>
<LastUpdated date="2024-01-01" />
<PolicyContent />
</div>
);
}
```

### Server Components excel in scenarios where interactivity isn't the primary concern, but per-

### formance, SEO, and secure data access are crucial. They form the foundation of the App

### Router's architecture, making server-first rendering the default approach in modern Next.js

### applications.

The Ultimate Guide to Next JS Optimalization   |  42



<!-- Page 43 -->

Rendering

# Client Components

### Client Components bring interactivity and dynamic behavior to modern Next.js applications.

### While they still participate in server-side rendering for the initial page load, they become fully

### interactive on the client side after hydration. Understanding their work is crucial for building

### responsive, interactive, performant applications.

### Core Characteristics:

### 1.  Client-Side Execution


```
'use client';
import { useState } from 'react';
export default function InteractiveForm() {
const [formData, setFormData] = useState({
name: '',
email: ''
});
const handleSubmit = async (e)  =>  {
e.preventDefault();
await submitForm(formData);
};
return (
<form onSubmit={handleSubmit}>
<input
value={formData.name}
onChange={(e)  =>  setFormData(prev  =>  ({
```

==.prev,


```
name: e.target.value
}))}
/>
```

{/*  ==.  =/}


```
</form>
);
}
```

### �  Full access to browser APIs

### �  State management capabilities

### �  Event handling support

### �  Interactive UI elements

### 2.  Hydration Process


```
'use client';
import { useEffect, useState } from  'react';
export default function HydratedComponent() {
const [isHydrated, setIsHydrated]  = useState(false);
useEffect(()  =>  {
```

The Ultimate Guide to Next JS Optimalization   |  43



<!-- Page 44 -->

Rendering


```
setIsHydrated(true);
}, []);
return (
<div>
{isHydrated  ?  (
<InteractiveContent />
) : (
<StaticFallback />
)}
</div>
);
}
```

### �  Initial server render for fast first paint

### �  Progressive enhancement after JavaScript loads

### �  Seamless transition to interactive state

### �  Fallback support for non-JS environments

### 3.   Browser API Integration


```
'use client';
export default function LocationAware() {
const [location, setLocation] = useState(null);
useEffect(()  =>  {
if ('geolocation' in navigator) {
navigator.geolocation.getCurrentPosition(
position  =>  setLocation(position)
);
}
}, []);
return (
<div>
{location  ?  (
<Map coordinates={location.coords} />
) : (
```

'Loading location==.'


```
)}
</div>
);
}
```

### �  Access to browser-specific features

### �  Integration with device APIs

### �  Real-time updates and interactions

### �  Client-side data persistence

The Ultimate Guide to Next JS Optimalization   |  44



<!-- Page 45 -->

Rendering

### Optimal Use Cases:

### 1.  Interactive Forms


```
'use client';
export default function DynamicForm() {
const [fields, setFields] = useState([{ id: 1, value: '' }]);
const addField = ()  =>  {
```

setFields(prev  =>  [==.prev,  {


```
id: prev.length + 1,
value: ''
}]);
};
return (
<form>
{fields.map(field  =>  (
<input
key={field.id}
value={field.value}
onChange={e  =>  handleChange(field.id, e)}
/>
))}
<button type="button" onClick={addField}>
Add Field
</button>
</form>
);
}
```

### 2.  Real-Time features or pagination implementation


```
'use client';
export default function ChatWidget() {
const [messages, setMessages] = useState([]);
useEffect(()  =>  {
const ws = new WebSocket('wss:=/chat.api');
ws.onmessage = (event)  =>  {
setMessages(prev  =>  [==.prev,  event.data]);
};
return ()  =>  ws.close();
}, []);
return (
<div className="chat-window">
{messages.map(msg  =>  (
<Message key={msg.id} content={msg} />
))}
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  45



<!-- Page 46 -->

Rendering

### 3.   Complex UI Interactions


```
'use   client';
export default function DragAndDropList() {
const [items, setItems] = useState(initialItems);
const onDragEnd = (result)  =>  {
if (!result.destination) return;
const reorderedItems = Array.from(items);
const [removed] = reorderedItems.splice(result.source.index, 1);
reorderedItems.splice(result.destination.index, 0, removed);
setItems(reorderedItems);
};
return (
<DragDropContext onDragEnd={onDragEnd}>
<Droppable droppableId="list">
{provided  =>  (
```

<div ref={provided.innerRef}  {==.provided.droppableProps}>


```
{items.map((item, index)  =>  (
<DraggableItem key={item.id} item={item} index={index} />
))}
{provided.placeholder}
</div>
)}
</Droppable>
</DragDropContext>
);
}
```

### Client Components are essential for building interactive features that respond to user input

### and maintain client-side state. They should be used judiciously, as each Client Component

### increases the JavaScript bundle size and adds to the hydration overhead.

### The key is to keep Client Components as small and focused as possible, using them only for

### the interactive parts of your application while letting Server Components handle the static

### and data-fetching aspects.

The Ultimate Guide to Next JS Optimalization   |  46



<!-- Page 47 -->

Rendering

# Client Boundary

### The Client Boundary is a crucial architectural concept in Next.js App Router that determines

### where server-side rendering ends and client-side rendering begins. Understanding this bound-

### ary is essential for optimizing application performance and managing the transition between

### Server and Client Components.

### Understanding the Client Boundary

### The Client Boundary is established by the 'use client'  directive at the top of a file. This di-

### rective tells Next.js that everything in this file needs to be treated as client-side code.

### Let's explore how this works in practice:

=/  app/page.tsx


```
import { ClientComponent } from "@/components/client-component"
import { ServerComponent } from "@/components/server-component"
export default function Page() {
return (
<ClientComponent>
<ServerComponent/>
</ClientComponent>
)
}
```

=/  components/client-component.tsx


```
'use client';
import { useState } from 'react';
export function ClientComponent({ children }) {
const [isMenuOpen, setIsMenuOpen] = useState(false);
return (
<div>
```

<button onClick={() => setIsMenuOpen(!isMenuOpen)}>


```
Toggle Menu
</button>
```

{isMenuOpen  =& (


```
<nav>
{/* Server Components cannot be used within Client Components
```

=/}


```
{/* directly, but they can be passed as 'children' or any
```

other  =/}

{/* prop that will have JSX supplied, in this way  =/}


```
{/* the Client Component's only responsibility regarding this
```

=/}

{/* is to decide where 'children' will be placed  =/}


```
{children}
</nav>
)}
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  47



<!-- Page 48 -->

Rendering

### In this example, the  ClientComponent   creates a Client Boundary. Everything within this

### component will be part of the client bundle, even though it may contain Server Components

### passed as children, composed in the upper Page component.

### Implications of Client Boundaries

### 1.  Bundle Size Management


```
=/  ❌  Poor boundary placement
'use   client';
import { heavyLibrary } from 'large-package';
```

=/  Everything including heavyLibrary will be in client bundle


```
export function App() {
return (
<div>
<HeavyComponent />
<LightComponent />
</div>
);
}
=/  ✅  Optimized boundary placement
```

=/  app/page.tsx


```
import { HeavyServerComponent } from './HeavyServerComponent';
export function App() {
return (
<div>
<HeavyServerComponent />
<ClientInteractiveComponent />
</div>
);
}
```

=/  components/ClientInteractiveComponent.tsx


```
'use   client';
export function ClientInteractiveComponent() {
```

=/  Only interactive code goes in client bundle


```
return <button onClick={()  =>  alert('Clicked!')}>Click me</button>;
}
```

The Ultimate Guide to Next JS Optimalization   |  48



<!-- Page 49 -->

Rendering

### 2.  Hydration Strategy


```
'use   client';
export function ComplexUI({ serverData }) {
const [clientData, setClientData] = useState(null);
useEffect(()  =>  {
```

=/ This runs after hydration


```
fetchAdditionalData().then(setClientData);
},  []);
return (
<div>
```

{/* Server-rendered data available immediately  =/}


```
<ServerRenderedContent data={serverData} />
```

{/* Client data loads after hydration  =/}


```
{clientData  ?  (
<ClientContent data={clientData} />
) : (
<LoadingSpinner />
)}
</div>
);
}
```

### 3.   Component Organization

=/  components/feature/index.tsx

=/  Entry point for a feature


```
import { FeatureWrapper } from './FeatureWrapper';
import { DataFetcher } from './DataFetcher';
import { InteractiveUI } from './InteractiveUI';
export function Feature() {
return (
<FeatureWrapper>
```

{/* Keeps data fetching on server  =/}


```
<DataFetcher>
{(data)  =>  (
```

{/* Moves interactivity to client  =/}


```
<InteractiveUI initialData={data} />
)}
</DataFetcher>
</FeatureWrapper>
);
}
```

=/  components/feature/InteractiveUI.tsx


```
'use client';
export function InteractiveUI({ initialData }) {
```

=/ Client-side logic here


```
}
```

The Ultimate Guide to Next JS Optimalization   |  49



<!-- Page 50 -->

Rendering

### Best Practices for Managing Client Boundaries

### 1.  Minimize Boundary Size


```
=/  ❌  Large client boundary
'use client';
export function Page() {
return (
<div>
<Header />
<Sidebar />
<MainContent />
<Footer />
</div>
);
}
=/  ✅  Targeted client boundaries
export function Page() {
return (
<div>
<StaticHeader />
<ClientSidebar />
<MainContent />
<StaticFooter />
</div>
);
}
```

=/  Only make interactive parts client components


```
'use client';
export function ClientSidebar() {
```

=/ Interactive sidebar logic


```
}
```

### 2.  Strategic Component Splitting

=/  components/ProductCard.tsx

=/  Server component for data and structure


```
export function ProductCard({ product }) {
return (
<div className="product-card">
<ProductImage src={product.image} />
<ProductInfo product={product} />
<AddToCartButton productId={product.id} />
</div>
);
}
```

=/  components/AddToCartButton.tsx

=/  Client component for interactivity


```
'use client';
export function AddToCartButton({ productId }) {
return (
<button onClick={()  =>  addToCart(productId)}>
Add to Cart
</button>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  50



<!-- Page 51 -->

Rendering

3.   Data Flow Optimization
=/  Optimized data flow across boundary


```
export async function DataAwareComponent() {
```

=/ Fetch data on server


```
const data = await fetchData();
return (
<div>
<ServerRenderedContent data={data} />
<ClientInteraction serverData={data} />
</div>
);
}
'use client';
function ClientInteraction({ serverData }) {
```

=/ Use server-fetched data without refetching


```
const [localState, setLocalState] = useState(serverData);
return (
<div>
<DisplayData data={localState} />
<UpdateButton onUpdate={setLocalState} />
</div>
);
}
```

Understanding and properly managing Client Boundaries is crucial for building performant

Next.js applications. It allows you to maintain the benefits of server-side rendering while pro-

viding rich client-side interactivity where needed.

The key is to keep client boundaries as small and focused as possible, ensuring that serv-

er-rendered content remains efficient while interactive elements are properly hydrated on

the client.

## 7.2.1.2. Server Rendering Strategies

## Static Rendering

Static rendering is like pre-cooking meals before a restaurant opens—everything is prepared

and ready for serving when needed. In Next.js, static rendering prepares your pages during

the build process, converting them into HTML files that can be served immediately to users.

This approach offers exceptional performance since no server processing is needed at the re-

quest time.

How Static Rendering Works

Let's explore a practical example of static rendering in action:

=/  app/blog/page.tsx


```
async function getBlogPosts() {
```

=/ This function runs at build time


```
const posts = await prisma.post.findMany({
where: { status: 'published' },
orderBy: { publishedAt: 'desc' }
});
```

The Ultimate Guide to Next JS Optimalization   |  51



<!-- Page 52 -->

Rendering


```
return posts;
}
export default async function BlogPage() {
```

=/ Data is fetched once at build time


```
const posts = await getBlogPosts();
return (
<article>
<h1>Our Blog</h1>
```

{posts.map(post => (


```
<BlogPostPreview
key={post.id}
post={post}
/>
))}
</article>
);
}
```

### In this example, the blog page and all its content are generated during the build process. When

### users request the page, they receive the pre-rendered HTML immediately, resulting in speedy

### page loads. It’s worth noting, that since the code doesn’t opt into dynamic behavior (like access-

### ing cookies()) or force static rendering (by exporting const dynamic = "force-dynamic"),

### Next.js will just default to static rendering automatically.

### Static Rendering with Dynamic Routes

### Often, you'll need to generate multiple static pages based on your data. Here's how to handle

### that:

=/  app/blog/[slug]/page.tsx


```
export async function generateStaticParams() {
```

=/ This runs at build time to generate all possible routes


```
const posts = await prisma.post.findMany({
select: { slug: true }
});
```

return  posts.map(post => ({


```
slug: post.slug
}));
}
export default async function BlogPost({ params }) {
const post = await prisma.post.findUnique({
where: { slug: params.slug }
});
return (
<article>
<h1>{post.title}</h1>
```

<div dangerouslySetInnerHTML={{ __html: post.content }} />


```
</article>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  52



<!-- Page 53 -->

Rendering

### Optimizing Static Generation

### Consider a documentation site that needs to generate hundreds of pages. We can optimize

### the build process:

=/  app/docs/[==.slug]/page.tsx


```
export async function generateStaticParams() {
```

=/  Implement parallel processing for faster builds


```
const allDocs = await fetchAllDocuments();
```

=/  Process in batches to manage memory


```
const batchSize = 50;
const batches = chunk(allDocs, batchSize);
const params = [];
for   (const batch of batches) {
const batchParams = await Promise.all(
batch.map(async  doc => ({
slug: doc.path.split('/'),
lastMod: doc.lastModified
}))
);
```

params.push(==.batchParams);


```
}
return params;
}
```

### Static Data Requirements

### Sometimes you need to fetch data that's used across multiple static pages:

=/  app/layout.tsx


```
export async function generateMetadata() {
```

=/  This data is fetched once and reused across all static pages


```
const siteConfig = await fetchSiteConfig();
return {
title: {
template: `%s | ${siteConfig.siteName}`,
default: siteConfig.siteName
},
description: siteConfig.description
};
}
```

### Incremental Static Regeneration (ISR)

### Incremental Static Regeneration allows for updating static pages incrementally by regenerat-

### ing them in the background after a specified time interval. This approach combines the ben-

### efits of static site generation with dynamic content updates. When requested, Next.js serves

### the cached page if available and triggers regeneration if the cache is stale, ensuring users

### get fast load times while keeping content fresh.

The Ultimate Guide to Next JS Optimalization   |  53



<!-- Page 54 -->

Rendering

### Let’s go back to our previous example, and see how we can implement ISR here:

=/  app/blog/page.tsx

=/  exporting const named `revalidate` enables ISR for specified time


```
interval
export const revalidate = 60  =/ seconds
async function getBlogPosts() {
```

=/  This function runs at build time to generate the static page, and


```
when a request arrives after the time specified in revalidate has
elapsed since the last generation, it re-runs in the background to
regenerate the page.
const posts = await prisma.post.findMany({
where: { status: 'published' },
orderBy: { publishedAt: 'desc' }
});
return posts;
}
export default async function BlogPage() {
const posts = await getBlogPosts();
return (
<article>
<h1>Our Blog</h1>
{posts.map(post  =>  (
<BlogPostPreview
key={post.id}
post={post}
/>
))}
</article>
);
}
```

### When to Use Static Rendering

### Static rendering is ideal for content that:

### 1.  Is the same for all users.

### 2.  Can be determined at build time.

### 3.  It doesn't need frequent updates.

### Common use cases include:

=/  Marketing pages

=/  app/about/page.tsx


```
export default function AboutPage() {
return (
<div>
<h1>About Our Company</h1>
<CompanyHistory />
<TeamSection />
<ContactInfo />
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  54



<!-- Page 55 -->

Rendering

=/  Documentation

=/  app/docs/[==.path]/page.tsx


```
export default async function DocPage({ params }) {
const doc = await getDocContent(params.path);
return (
<div className="doc-page">
<TableOfContents headings={doc.headings} />
<MarkdownRenderer content={doc.content} />
<PreviousNextLinks />
</div>
);
}
```

=/  Product listings with infrequent  updates

=/  app/products/page.tsx


```
export default async function ProductsPage() {
const products = await getProducts();
return (
<div className="products-grid">
{products.map(product  =>  (
<ProductCard
key={product.id}
product={product}
```

staticImage  =/ Images are  optimized at build time


```
/>
))}
</div>
);
}
```

### Limitations and Considerations

### While static rendering offers superior performance, it comes with some trade-offs:

### 1.  Build Time Impact

=/  Consider build time for large datasets


```
export async function generateStaticParams() {
```

if  (process.env.SKIP_LONG_BUILDS)  {

=/ During development, generate fewer pages


```
return getLimitedStaticPaths();
}
```

=/ In production, generate all pages


```
return getAllStaticPaths();
}
```

The Ultimate Guide to Next JS Optimalization   |  55



<!-- Page 56 -->

Rendering

2.  Content Freshness
=/  app/news/page.tsx

=/  This might not be suitable for static rendering


```
export default async function NewsPage() {
```

=/ Content will be stale until next build unless ISR is used


```
const news = await getLatestNews();
return (
<NewsFeed items={news} />
);
}
```

3.   Memory Usage During Build
When statically generating thousands of pages (e.g., blog posts), memory usage and build

time can grow significantly.


```
export async function generateStaticParams() {
const totalPages = await getAllPosts();  =/ fetching thousand of
entries
```

return  posts.map((post) => ({


```
slug: post.slug,
}));
}
```

## Dynamic Rendering

Dynamic rendering generates page content on the server in response to each request. This

solution ensures users always receive up-to-date information, but requires server processing

for every page load. In this case, content is generated on-demand for each request, serving

the most up-to-date information. Unlike static rendering, which serves pre-built pages, dy-

namic rendering processes each request individually on the server.

Understanding Dynamic Rendering

When a page is rendered dynamically, Next.js executes all the code on the server for each

request. It means you can access request-specific information and generate personalized

content. Here's a practical example:

=/  app/dashboard/page.tsx


```
export default async function DashboardPage() {
```

=/  This function runs for every request


```
const user = await getCurrentUser();
const userPreferences = await getUserPreferences(user.id);
const recommendations = await getPersonalizedContent(user.id);
return (
<div className="dashboard">
<WelcomeHeader
name={user.name}
```

The Ultimate Guide to Next JS Optimalization   |  56



<!-- Page 57 -->

Rendering


```
lastLogin={user.lastLogin}
/>
<DashboardContent
preferences={userPreferences}
recommendations={recommendations}
/>
</div>
);
}
export const dynamic = "force-dynamic"
```

### In this example, each user sees their personalized dashboard. The server generates the con-

### tent specifically for them when they request the page.

### Request-Time Data Access

### Dynamic rendering allows you to work with request-specific data, including cookies, headers,

### and URL parameters:

=/  app/api/user-region/page.tsx


```
import { headers, cookies } from 'next/headers';
export default async function UserRegionPage() {
```

=/ Access request headers


```
const headersList = headers();
const userCountry = headersList.get('x-country-code');
```

=/ Access cookies


```
const cookieStore = cookies();
const userPreferences = cookieStore.get('preferences');
```

=/ Fetch region-specific content


```
const content = await getRegionalContent(userCountry);
return (
<div>
<RegionalHeader country={userCountry} />
<ContentDisplay
content={content}
preferences={userPreferences}
/>
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  57



<!-- Page 58 -->

Rendering

### Real-Time Data Requirements

### Some applications need to display real-time information that changes frequently:

=/  app/stocks/[symbol]/page.tsx


```
export default async function StockPage({ params }) {
```

=/ Fetch real-time stock data for each request


```
const stockData = await getStockPrice(params.symbol);
const companyInfo = await getCompanyInfo(params.symbol);
const marketTrends = await getMarketTrends();
return (
<div className="stock-page">
<StockPriceDisplay
currentPrice={stockData.price}
change={stockData.change}
/>
<CompanyOverview info={companyInfo} />
<MarketContext trends={marketTrends} />
</div>
);
}
```

### Handling User Authentication

### Dynamic rendering is particularly useful for authenticated content:

=/  app/account/settings/page.tsx


```
import { redirect } from 'next/navigation';
export default async function AccountSettings() {
const session = await getSession();
```

=/ Redirect if not authenticated


```
if (!session) {
redirect('/login');
}
```

=/ Fetch user-specific data


```
const settings = await getUserSettings(session.user.id);
const securityInfo = await getSecurityDetails(session.user.id);
return (
<div className="settings-page">
<UserProfileSection
user={session.user}
settings={settings}
/>
<SecuritySettings
info={securityInfo}
enabled={settings.securityFeatures}
/>
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  58



<!-- Page 59 -->

Rendering

### Optimizing Dynamic Content

### While dynamic rendering ensures fresh content, it's important to optimize performance:

### 1.  Caching Strategies (request deduping)

=/  utils/cache.ts


```
import { cache } from 'react';
export const getUser = cache(async (userId: string)  =>  {
```

=/  This will be cached for the duration of the request


```
const user = await db.user.findUnique({
where: { id: userId }
});
return user;
});
```

=/  app/profile/[id]/page.tsx


```
export default async function ProfilePage({ params }) {
```

=/  Multiple components can call getUser without duplicate fetches


```
const user = await getUser(params.id);
return (
<>
<ProfileHeader user={user} />
<ProfileContent user={user} />
<ProfileSidebar user={user} />
</>
);
}
```

### 2.  Partial Static Content

=/  app/product/[id]/page.tsx


```
export default async function ProductPage({ params }) {
return (
<div className="product-layout">
```

{/* Static content  =/}


```
<StaticSidebar />
<StaticFooter />
```

{/* Dynamic content  =/}


```
<Suspense fallback={<Loading />}>
<DynamicProductInfo id={params.id} />
</Suspense>
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  59



<!-- Page 60 -->

Rendering

### Common Use Cases

### Dynamic rendering is ideal for:

### 1.  Personalized Content

=/  app/feed/page.tsx


```
export default async function PersonalizedFeed() {
const user = await getCurrentUser();
const feed = await generatePersonalizedFeed(user.id);
return (
<div className="feed">
{feed.map(item  =>  (
<FeedItem
key={item.id}
item={item}
userPreferences={user.preferences}
/>
))}
</div>
);
}
```

### 2.  Part of e-commerce products details page that is above the fold

=/  app/products/[id]/page.tsx


```
export default async function ProductPage({ params }) {
const product = await getProduct(params.id);
const inventory = await getRealtimeInventory(params.id);
const pricing = await getCurrentPricing(params.id);
return (
<div className="product-page">
<ProductInfo product={product} />
<InventoryStatus stock={inventory.available} />
<PricingDisplay
price={pricing.current}
discounts={pricing.activeDiscounts}
/>
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  60



<!-- Page 61 -->

Rendering

### 3.   Analytics Dashboards

=/  app/analytics/page.tsx


```
export default async function AnalyticsDashboard() {
const startDate = new Date();
startDate.setDate(startDate.getDate() - 30);
const metrics = await getAnalyticsData(startDate);
const trends = await analyzeTrends(metrics);
return (
<div className="analytics-dashboard">
<MetricsOverview data={metrics} />
<TrendAnalysis trends={trends} />
<RealtimeVisitors />
</div>
);
}
```

### Understanding Trade-offs

### Dynamic rendering comes with certain considerations:

### 1.  Server Load

=/  Implement rate limiting for expensive operations


```
import { rateLimit } from './utils/rate-limit';
export async function GET(request: Request) {
const identifier = request.headers.get('x-forwarded-for') ||
'anonymous';
const limit = await rateLimit(identifier);
if (!limit.success) {
return new Response('Too Many Requests', {
status: 429,
headers: {
'Retry-After': limit.reset
}
});
}
```

=/ Process request normally


```
}
```

The Ultimate Guide to Next JS Optimalization   |  61



<!-- Page 62 -->

Rendering

### 2.  Response Time

=/  Implement timeout handling


```
async function fetchWithTimeout(resource: string, timeout: number) {
const controller = new AbortController();
const id = setTimeout(()  =>  controller.abort(), timeout);
try {
const response = await fetch(resource, {
signal: controller.signal
});
return response;
}  catch (error) {
if (error.name === 'AbortError') {
throw new Error('Request timed out');
}
throw error;
}  finally {
clearTimeout(id);
}
}
```

### 3.   Cache Strategy

=/  Implement custom caching for specific routes


```
export async function GET(request: Request) {
const cacheKey = new URL(request.url).pathname;
const cachedResponse = await cache.get(cacheKey);
if (cachedResponse) {
return new Response(cachedResponse, {
headers: {
'Cache-Control': 'public, max-age=60',
'X-Cache': 'HIT'
}
});
}
const data = await generateResponse();
await cache.set(cacheKey, data, 60);  =/ Cache for 60 seconds
return new Response(data, {
headers: {
'Cache-Control': 'public, max-age=60',
'X-Cache': 'MISS'
}
});
}
```

### Dynamic rendering provides the flexibility needed for personalized, real-time content while

### requiring careful consideration of performance implications. The key is to use it carefully, im-

### plementing appropriate caching strategies and optimization techniques to ensure a respon-

### sive user experience.

The Ultimate Guide to Next JS Optimalization   |  62



<!-- Page 63 -->

Rendering

# Streaming

### Streaming is a technique that enables progressive page rendering, where content is sent

### to the client in chunks as it becomes available rather than waiting for the entire page to be

### ready. Rather than waiting for all content to be generated before sending anything to the user,

### the application can start sending pieces of the UI as soon as they're ready.

### Understanding Streaming

### In traditional server rendering, the server must complete all data fetching and rendering be-

### fore sending any content to the client. If data requests are slow, It can lead to a slower Time to

### First Byte (TTFB). Streaming solves this issue by breaking the response into smaller chunks

### and sending them progressively. Let's see how this works in practice:

=/  app/profile/page.tsx


```
import { Suspense } from 'react';
export default async function ProfilePage() {
```

=/  The header will be sent immediately


```
return (
<div className="profile-page">
<Header />
```

{/* User info will stream in when ready  =/}


```
<Suspense fallback={<UserInfoSkeleton />}>
<UserInfo />
</Suspense>
```

{/* Activity feed will stream  in independently  =/}


```
<Suspense fallback={<ActivityFeedSkeleton />}>
<ActivityFeed />
</Suspense>
```

{/* Recommendations can load last  =/}


```
<Suspense fallback={<RecommendationsSkeleton />}>
<Recommendations />
</Suspense>
</div>
);
}
```

=/  Components with their own data fetching


```
async function UserInfo() {
const user = await fetchUserData();  =/ Takes 500ms
return <UserProfile user={user} />;
}
async function ActivityFeed() {
const activities = await fetchActivities();  =/ Takes 1000ms
return <Feed items={activities} />;
}
async function Recommendations() {
const recommendations = await fetchRecommendations();  =/ Takes 2000ms
return <RecommendedItems items={recommendations} />;
}
```

The Ultimate Guide to Next JS Optimalization   |  63



<!-- Page 64 -->

Rendering

### In this example, instead of waiting for all data fetching to complete (which would take 3.5 sec-

### onds total), the user sees the header immediately and:

### 1.  User info after 500ms.

### 2.  Activity feed after 1000ms.

### 3.  Recommendations after 2000ms.

### This progressive loading creates a more engaging user experience, as content appears in-

### crementally rather than all at once after a long wait.

### Loading UI and Suspense Boundaries

### The loading UI is crucial for maintaining user engagement during streaming. Let's explore

### how to create effective loading states:

=/  components/LoadingStates.tsx


```
export function UserInfoSkeleton() {
return (
<div className="animate-pulse">
<div className="h-20 w-20 rounded-full bg-gray-200" />
<div className="mt-4 h-4 w-48 bg-gray-200" />
<div className="mt-2 h-4 w-32 bg-gray-200" />
</div>
);
}
```

=/  app/complex-page/page.tsx


```
export default function ComplexPage() {
return (
<div className="grid grid-cols-12 gap-4">
<Suspense
fallback={<UserInfoSkeleton />}
key="user-info"
>
<UserSection />
</Suspense>
```

{/* Nested suspense boundaries  =/}


```
<section className="col-span-8">
<Suspense fallback={<ContentSkeleton />}>
<AsyncContent>
<Suspense fallback={<DetailsSkeleton />}>
<AsyncDetails />
</Suspense>
</AsyncContent>
</Suspense>
</section>
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  64



<!-- Page 65 -->

Rendering

### Streaming with Data Requirements

### Sometimes components need data from multiple sources. Here's how to handle complex

### data requirements while streaming:

=/  app/dashboard/page.tsx


```
export default async function Dashboard() {
```

=/ This data is needed for all child components


```
const user = await getCurrentUser();
return (
<div className="dashboard">
<Header user={user} />
<div className="dashboard-grid">
```

{/* Each section streams independently  =/}


```
<Suspense fallback={<StatsSkeleton />}>
<UserStats userId={user.id} />
</Suspense>
<Suspense fallback={<ChartsSkeleton />}>
<AsyncCharts userId={user.id} />
</Suspense>
<Suspense
fallback={<TableSkeleton />}
```

key={user.id}  =/ Reset suspense when user changes


```
>
<DataTable userId={user.id} />
</Suspense>
</div>
</div>
);
}
```

=/  Components can have their own loading states


```
async function UserStats({ userId }) {
const stats = await fetchUserStats(userId);
return (
<div className="stats-grid">
{stats.map(stat  =>  (
<StatCard
key={stat.id}
value={stat.value}
label={stat.label}
/>
))}
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  65



<!-- Page 66 -->

Rendering

### Optimizing Streaming Performance

### To make the most of streaming, consider these optimization techniques:

### 1.  Prioritize Critical Content


```
export default function ProductPage() {
return (
<>
```

{/* Critical content outside Suspense  =/}


```
<ProductHeader />
<MainProductImage />
```

{/* Less critical content streams in  =/}


```
<Suspense fallback={<RelatedSkeleton />}>
<RelatedProducts />
</Suspense>
<Suspense fallback={<ReviewsSkeleton />}>
<ProductReviews />
</Suspense>
</>
);
}
```

### 2.  Parallel Data Fetching


```
async function ParallelDataSection() {
```

=/ Start both fetches immediately


```
const productPromise = fetchProducts();
const categoryPromise = fetchCategories();
```

=/ Wait for both in parallel


```
const [products, categories] = await Promise.all([
productPromise,
categoryPromise
]);
return (
<section>
<ProductGrid products={products} />
<CategoryList categories={categories} />
</section>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  66



<!-- Page 67 -->

Rendering

### 3.   Waterfall Prevention


```
=/  ❌  Avoid data fetching waterfalls
async function SlowComponent() {
const data1 = await fetch1();  =/ Wait
const data2 = await fetch2();  =/ Then wait again
const data3 = await fetch3();  =/ And again
return <Display data1={data1} data2={data2} data3={data3} />;
}
=/  ✅  Fetch in parallel
async function FastComponent() {
```

=/ Start all fetches immediately


```
const [data1, data2, data3] = await Promise.all([
fetch1(),
fetch2(),
fetch3()
]);
return <Display data1={data1} data2={data2} data3={data3} />;
}
```

### Real-World Streaming Patterns

### Let's look at some common patterns for implementing streaming in different scenarios:

### 1.  Social Media Feed


```
export default function FeedPage() {
return (
<div className="feed-layout">
```

{/* Main feed streams in chunks  =/}


```
<Suspense fallback={<FeedSkeleton />}>
<InfiniteFeed />
</Suspense>
```

{/* Sidebar content streams separately  =/}


```
<aside>
<Suspense fallback={<TrendingSkeleton />}>
<TrendingTopics />
</Suspense>
<Suspense fallback={<SuggestionsSkeleton />}>
<SuggestedUsers />
</Suspense>
</aside>
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  67



<!-- Page 68 -->

Rendering

### 2.  E-commerce Category Page


```
export default function CategoryPage({ params }) {
return (
<div className="category-page">
```

{/* Critical filters load first  =/}


```
<Suspense fallback={<FiltersSkeleton />}>
<ProductFilters category={params.category} />
</Suspense>
<div className="product-grid">
```

{/* Products stream in batches  =/}


```
<Suspense fallback={<ProductGridSkeleton />}>
<StreamingProductGrid category={params.category} />
</Suspense>
</div>
```

{/* Load faceted search last  =/}


```
<Suspense fallback={<FacetsSkeleton />}>
<SearchFacets category={params.category} />
</Suspense>
</div>
);
}
```

### 3.   Analytics Dashboard


```
export default function AnalyticsDashboard() {
return (
<div className="dashboard-grid">
```

{/* Quick metrics load first  =/}


```
<Suspense fallback={<QuickStatsSkeleton />}>
<QuickStats />
</Suspense>
```

{/* Charts stream in progressively  =/}


```
<div className="charts-grid">
<Suspense fallback={<ChartSkeleton />}>
<RevenueChart />
</Suspense>
<Suspense fallback={<ChartSkeleton />}>
<UserRetentionChart />
</Suspense>
<Suspense fallback={<ChartSkeleton />}>
<ConversionChart />
</Suspense>
</div>
```

{/* Detailed tables load last  =/}


```
<Suspense fallback={<DetailsSkeleton />}>
<DetailedMetrics />
</Suspense>
</div>
);
}
```

### Streaming is a powerful feature that can significantly improve your application's perceived

### performance. The key here is to identify which parts of your UI can be loaded progressively

### and implement appropriate loading states that maintain visual stability as content streams in.

The Ultimate Guide to Next JS Optimalization   |  68



<!-- Page 69 -->

Rendering

### By combining streaming with parallel data fetching and proper prioritization, you can create

### highly responsive applications. This approach ensures a great user experience, even when

### working with slow data sources or complex UI requirements.

# Partial Pre-rendering (PPR)

### Partial Pre-rendering (PPR) is a hybrid rendering approach that combines static and dynam-

### ic rendering at the component level. It pre-renders a static shell of your page and streams in

### dynamic content as needed. This way, you get the speed of static rendering and the freshness

### of dynamic content at the same time.

### Understanding PPR

### Partial Pre-rendering represents a fundamental shift in how we render web pages. Instead of

### choosing between static and dynamic rendering for an entire page, PPR allows us to make

### this choice at the component level. Here's how it works:

=/  app/products/page.tsx


```
export default async function ProductPage() {
```

=/ This part becomes the static shell


```
return (
<div className="product-page">
```

<Header />  {/* Static  =/}

<Navigation />  {/* Static  =/}

{/* Dynamic hole in the static shell  =/}


```
<Suspense fallback={<ProductGridSkeleton />}>
```

<ProductGrid />  {/* Rendered at request time  =/}


```
</Suspense>
</div>
);
}
```

=/  The static parts are pre-rendered and cached


```
function Header() {
return (
<header>
<h1>Our Products</h1>
<nav>
<Link href="/categories">Categories</Link>
<Link href="/deals">Deals</Link>
</nav>
</header>
);
}
```

=/  Dynamic content streams in after the static shell loads


```
async function ProductGrid() {
```

=/ This code runs at request time


```
const products = await fetchLatestProducts();
return (
<div className="grid">
{products.map(product  =>  (
<ProductCard
key={product.id}
product={product}
/>
))}
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  69



<!-- Page 70 -->

Rendering

### The PPR Process

### Let's break down how PPR processes a page request:

### 1.  Initial Response

=/  When the page is first requested:


```
export default function StorePage() {
return (
<>
```

{/* Immediate static response  =/}

<StoreLayout>  {/* Pre-rendered  =/}

<CategoryNav />  {/* Pre-rendered  =/}

{/* Placeholder for dynamic content  =/}


```
<Suspense fallback={<ProductsSkeleton />}>
```

<Products />  {/* Streams in  =/}


```
</Suspense>
</StoreLayout>
</>
);
}
```

### 2.  Dynamic Content Integration

=/  The dynamic part that streams in:


```
async function Products() {
```

=/ Real-time data fetching


```
const products = await getProducts();
const inventory = await getInventory();
return (
<div className="products-grid">
{products.map(product  =>  (
<ProductCard
key={product.id}
product={product}
stock={inventory[product.id]}
/>
))}
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  70



<!-- Page 71 -->

Rendering

### Implementing PPR Effectively

### Let's look at some patterns for implementing PPR in different scenarios:

### 1.  E-commerce Product Page


```
export default function ProductPage({ params }) {
return (
<div className="product-layout">
```

{/* Static product framework  =/}


```
<ProductBreadcrumb category={params.category} />
<ProductImageGallery id={params.id} />
```

{/* Dynamic, real-time elements  =/}


```
<Suspense fallback={<PricingSkeleton />}>
<DynamicPricing id={params.id} />
</Suspense>
<Suspense fallback={<InventorySkeleton />}>
<InventoryStatus id={params.id} />
</Suspense>
```

{/* Static content again  =/}


```
<ProductDescription id={params.id} />
```

{/* More dynamic content  =/}


```
<Suspense fallback={<ReviewsSkeleton />}>
<CustomerReviews id={params.id} />
</Suspense>
</div>
);
}
```

### 2.  News Article with Live Comments


```
export default function ArticlePage({ params }) {
return (
<article className="news-article">
```

{/* Pre-rendered article content  =/}


```
<ArticleHeader id={params.id} />
<ArticleBody id={params.id} />
```

{/* Dynamic social engagement  =/}


```
<Suspense fallback={<SocialStatsSkeleton />}>
<LiveSocialStats id={params.id} />
</Suspense>
```

{/* Live comments section  =/}


```
<Suspense fallback={<CommentsSkeleton />}>
<LiveComments id={params.id} />
</Suspense>
</article>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  71



<!-- Page 72 -->

Rendering

### Optimizing PPR Performance

### To get the most out of PPR, consider these optimization strategies:

### 1.  Static Shell Optimization


```
export default function DashboardPage() {
return (
<div className="dashboard">
```

{/* Optimize the static shell for largest contentful paint  =/}

<DashboardHeader />  {/* Static, critical for LCP  =/}

<SideNavigation />  {/* Static navigation  =/}

{/* Progressive enhancement with dynamic content  =/}


```
<div className="dashboard-content">
<Suspense fallback={<WidgetsSkeleton />}>
<DynamicWidgets />
</Suspense>
</div>
</div>
);
}
```

### 2.  Loading State Design


```
function WidgetsSkeleton() {
```

=/ Match exact dimensions of dynamic content


```
return (
<div className="widgets-grid" style={{ height: '500px' }}>
{Array.from({ length: 4  }).map((_,  i)  =>  (
<div
key={i}
className="animate-pulse bg-gray-200 rounded-lg"
style={{ height: '200px' }}
/>
))}
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  72



<!-- Page 73 -->

Rendering

### 3.   Parallel Data Fetching for Dynamic Parts


```
async function DynamicWidgets() {
```

=/ Start all data fetches immediately


```
const [
analyticsPromise,
inventoryPromise,
ordersPromise
]  = await Promise.all([
fetchAnalytics(),
fetchInventory(),
fetchOrders()
]);
return (
<div className="widgets-grid">
<AnalyticsWidget data={analyticsPromise} />
<InventoryWidget data={inventoryPromise} />
<OrdersWidget data={ordersPromise} />
</div>
);
}
```

### Real-World PPR Patterns

### Here are some common patterns for implementing PPR in different scenarios:

### 1.  Social Media Profile


```
export default function ProfilePage({ params }) {
return (
<div className="profile-page">
```

{/* Static profile shell  =/}


```
<ProfileHeader userId={params.id} />
<Bio userId={params.id} />
```

{/* Dynamic content areas  =/}


```
<div className="profile-content">
<Suspense fallback={<StoriesSkeleton />}>
<UserStories userId={params.id} />
</Suspense>
<Suspense fallback={<PostsSkeleton />}>
<UserPosts userId={params.id} />
</Suspense>
<Suspense fallback={<ActivitySkeleton />}>
<RecentActivity userId={params.id} />
</Suspense>
</div>
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  73



<!-- Page 74 -->

Rendering

2.  Real-time Dashboard

```
export default function AnalyticsDashboard() {
return (
<div className="dashboard">
```

{/* Static dashboard framework  =/}


```
<DashboardHeader />
<NavigationTabs />
```

{/* Real-time metrics  =/}


```
<div className="metrics-grid">
<Suspense fallback={<MetricsSkeleton />}>
<LiveMetrics />
</Suspense>
</div>
```

{/* Streaming charts  =/}


```
<div className="charts-section">
<Suspense fallback={<ChartsSkeleton />}>
<LiveCharts />
</Suspense>
</div>
```

{/* Real-time alerts  =/}


```
<Suspense fallback={<AlertsSkeleton />}>
<LiveAlerts />
</Suspense>
</div>
);
}
```

PPR significantly advances web rendering strategies, offering the best static and dynamic

rendering. By planning what to pre-render and what to load dynamically, you can build fast

applications with instant page loads and fresh content.

The key to successful PPR implementation lies in understanding your application's needs and

designing your component structure to make the most out of this hybrid approach.

## 7.2.1.3. Client Rendering Strategies

Client-side rendering in App Router:

�  is limited to Client Boundaries,

�  is useful for highly interactive sections,

�  impacts initial load performance,

�  and serves best for post-hydration interactions.

The Ultimate Guide to Next JS Optimalization   |  74



<!-- Page 75 -->

Rendering


```
7.2.2. Pages Router Rendering Strategies
```

### The Pages Router in Next.js provides three main rendering strategies:

### �  Server-Side Rendering (SSR),

### �  Static Site Generation (SSG),

### �  and Client-Side Rendering (CSR).

### The App Router offers more granular control with Server and Client Components. Still, under-

### standing traditional rendering approaches is valuable, especially for maintaining existing apps

### or using simpler patterns when they’re enough.

# Dynamic (Server-Side Rendering)

### Server-Side Rendering in the Pages Router generates HTML for each request, making it ideal

### for pages that need fresh data or user-specific content. Let's explore how to implement SSR

### effectively:

=/  pages/posts/[id].tsx


```
import { GetServerSideProps } from 'next';
interface Post {
id:   string;
title: string;
content: string;
author: {
name: string;
avatar: string;
};
}
```

=/  This runs on every request


```
export const getServerSideProps: GetServerSideProps = async (context)  =>
{
const { id } = context.params;
const { req, res } = context;
```

=/  Access request-specific data


```
const userAgent = req.headers['user-agent'];
const cookies = req.cookies;
try   {
```

=/ Fetch data for this specific  request


```
const post = await fetchPost(id);
const author = await fetchAuthor(post.authorId);
```

=/ Set cache headers for performance


```
res.setHeader(
'Cache-Control',
'public, s-maxage=10, stale-while-revalidate=59'
);
return {
props: {
post,
author,
userAgent,
},
};
}  catch (error) {
```

=/ Handle errors gracefully


```
return {
```

The Ultimate Guide to Next JS Optimalization   |  75



<!-- Page 76 -->

Rendering

notFound: true,  =/ Returns 404 page


```
};
}
};
function PostPage({ post, author, userAgent }: {
post: Post;
author: Author;
userAgent: string;
})  {
return (
<article className="post">
<header>
<h1>{post.title}</h1>
<AuthorInfo author={author}  />
</header>
<div className="content">
{post.content}
</div>
```

{/* Conditional rendering based on device  =/}


```
{userAgent.includes('Mobile')  ?  (
<MobileShareButtons />
) : (
<DesktopShareButtons />
)}
</article>
);
}
export default PostPage;
```

### Performance Optimization for SSR

### Server-Side Rendering can be optimized in several ways:

### 1.  Request-Level Caching (usually implemented along with serverless redis or some

### serverless key-value storages)

=/  utils/cache.ts


```
const cache = new Map();
export async function cachifiedFetch(key: string, fetchFn: ()  =>
Promise<any>) {
if  (cache.has(key)) {
return cache.get(key);
}
const data = await fetchFn();
cache.set(key, data);
```

=/  Clear cache after 1 minute


```
setTimeout(()  =>  {
cache.delete(key);
},  60000);
return data;
}
```

=/  Usage in getServerSideProps


```
export const getServerSideProps: GetServerSideProps = async ({ params })
```

=>  {

The Ultimate Guide to Next JS Optimalization   |  76



<!-- Page 77 -->

Rendering


```
const data = await cachifiedFetch(
`post-${params.id}`,
()  =>  fetchPost(params.id)
);
return { props: { data } };
};
```

### 2.  Parallel Data Fetching


```
export const getServerSideProps: GetServerSideProps = async ({ params })
```

=>  {

=/ Fetch multiple data sources in parallel


```
const [post, comments, relatedPosts] = await Promise.all([
fetchPost(params.id),
fetchComments(params.id),
fetchRelatedPosts(params.id)
]);
return {
props: {
post,
comments,
relatedPosts
}
};
};
```

# Static Site Generation (SSG)

### Static Site Generation pre-renders pages at build time, providing optimal performance for

### content that doesn't need to be real-time. Let's explore different SSG patterns:

### 1.  Basic Static Page

=/  pages/about.tsx


```
export default function AboutPage() {
return (
<div className="about">
<h1>About Our Company</h1>
<p>Static content that rarely  changes==.</p>
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  77



<!-- Page 78 -->

Rendering

### 2.  Data-Dependent Static Page

=/  pages/blog/index.tsx


```
export async function getStaticProps() {
```

=/  This runs at build time in production


```
const posts = await fetchBlogPosts();
return {
props: {
posts,
generatedAt: new Date().toISOString(),
},
```

=/ Optional: Revalidate every hour


```
revalidate: 3600
};
}
function BlogIndex({ posts, generatedAt }) {
return (
<div className="blog">
<small>Last updated: {generatedAt}</small>
{posts.map(post  =>  (
<BlogPreview key={post.id} post={post} />
))}
</div>
);
}
```

### 3.   Dynamic Routes with SSG

=/  pages/products/[category]/[id].tsx


```
export async function getStaticPaths() {
```

=/  Generate paths for most popular products


```
const popularProducts = await fetchPopularProducts();
return {
paths: popularProducts.map(product  =>  ({
params: {
category: product.category,
id: product.id.toString()
}
})),
```

=/ Generate other pages on demand


```
fallback: true
};
}
export async function getStaticProps({ params }) {
try   {
const product = await fetchProduct(params.id);
return {
props: { product },
```

revalidate: 3600  =/ Revalidate every hour


```
};
}  catch (error) {
return { notFound: true };
}
}
```

The Ultimate Guide to Next JS Optimalization   |  78



<!-- Page 79 -->

Rendering

# Incremental Static Regeneration (ISR)

### ISR extends SSG by allowing static pages to be updated after they're built, providing a bal-

### ance between performance and freshness:

=/  pages/products/[id].tsx


```
export async function getStaticProps({ params }) {
const product = await fetchProduct(params.id);
return {
props: {
product,
lastFetched: Date.now()
},
```

=/ Revalidate this page every minute


```
revalidate: 60
};
}
export async function getStaticPaths() {
return {
```

=/ Pre-render nothing at build time


```
paths: [],
```

=/ Generate all pages on-demand


```
fallback: 'blocking'
};
}
```

### Advanced ISR Patterns

### 1.  On-Demand Revalidation

=/  pages/api/revalidate.ts


```
export default async function handler(req, res) {
```

=*


```
Check for secret token. NOTE: This can be prone to time-based attacks,
for extremely secure setup it is advised to use timingSafeEqual from
`node:crypto` or a polyfill
```

=/

if (req.query.token !==  process.env.REVALIDATION_TOKEN)  {


```
return res.status(401).json({ message: 'Invalid token' });
}
try {
```

=/ Revalidate the specific page


```
await res.revalidate('/path/to/page');
return res.json({ revalidated: true });
}  catch (err) {
return res.status(500).send('Error revalidating');
}
}
```

The Ultimate Guide to Next JS Optimalization   |  79



<!-- Page 80 -->

Rendering

### 2.  Conditional Revalidation


```
export async function getStaticProps({ params }) {
const product = await fetchProduct(params.id);
```

=/ Different revalidation times based on product type


```
const revalidate = product.type === 'perishable'  ?  300 : 3600;
return {
props: { product },
revalidate
};
}
```

# Client-Side Rendering (CSR)

### While Next.js emphasizes server-side and static rendering, there are cases where client-side

### rendering is appropriate:

=/  pages/dashboard.tsx


```
import { useEffect, useState } from 'react';
export default function Dashboard() {
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(()  =>  {
async function loadDashboard() {
try {
const response = await fetch('/api/dashboard-data');
const dashboardData = await response.json();
setData(dashboardData);
} catch (error) {
console.error('Failed to load dashboard:', error);
} finally {
setLoading(false);
}
}
loadDashboard();
}, []);
if (loading) {
return <DashboardSkeleton />;
}
return (
<div className="dashboard">
<RealTimeMetrics data={data} />
<LiveCharts data={data} />
</div>
);
}
```

The Ultimate Guide to Next JS Optimalization   |  80



<!-- Page 81 -->

Rendering

### Hybrid Approaches

### Sometimes the best solution combines multiple rendering strategies:

=/  pages/product/[id].tsx


```
export async function getStaticProps({ params }) {
```

=/  Get static product data at build time


```
const product = await fetchProduct(params.id);
return {
props: {
product,
```

=/ Pass configuration for client-side fetching


```
realtimeConfig: {
endpoint: `/api/products/${params.id}/realtime`,
pollInterval: 5000
}
},
revalidate: 3600
};
}
function ProductPage({ product, realtimeConfig }) {
```

=/  Use static data for initial render


```
const [data, setData] = useState(product);
```

=/  Set up real-time updates


```
useEffect(()  =>  {
const interval = setInterval(async ()  =>  {
const response = await fetch(realtimeConfig.endpoint);
const updates = await response.json();
```

setData(prev  =>  ({  ==.prev,  ==.updates  }));


```
}, realtimeConfig.pollInterval);
return ()  =>  clearInterval(interval);
},  [realtimeConfig]);
return (
<div className="product">
<h1>{data.name}</h1>
<RealTimeInventory stock={data.stock} />
<DynamicPricing price={data.price} />
</div>
);
}
```

### Each rendering strategy in the Pages Router has its strengths and ideal use cases.

### Understanding these patterns allows you to choose the most appropriate approach for dif-

### ferent parts of your application, balancing factors like performance, data freshness, and user

### experience.

The Ultimate Guide to Next JS Optimalization   |  81



<!-- Page 82 -->

Rendering


```
7.2.3. Node.js and Edge Runtimes
```

When developing applications with Next.js, developers have a choice between two primary

execution environments or "runtimes": the Node.js Runtime and the Edge Runtime.

Each runtime offers distinct capabilities, advantages, and limitations crucial to understand-

ing effective application architecture. This sub-chapter provides a detailed comparison of

the two runtimes, helping developers make informed decisions based on their specific proj-

ect needs.

Understanding Runtimes in Next.js

�  Node.js Runtime:  This is the default runtime in Next.js, which provides full access to

all Node.js APIs and the rich ecosystem of npm packages compatible with Node.js.

This runtime is suitable for applications requiring comprehensive server-side capa-

bilities, including file system access, custom server configurations, and the utiliza-

tion of a vast array of third-party npm modules.

�  Edge Runtime:  Introduced to cater to high-performance, low-latency applications,

the Edge Runtime is a lightweight, restricted environment primarily based on Web

APIs. It's designed to run small, simple functions that benefit from being closer to

the user, thus minimizing latency.

Key Differences and Considerations

1.  Initialization Speed and Cold Boot Time:
�  Node.js:  Has a normal startup time as it initializes a more extensive runtime

environment.

�  Edge:  Features a very low cold boot time, ideal for performance-critical applications

that require quick starts.

2.  Input/Output Operations:
�  Node.js:  Supports all I/O operations available in Node.js, including file system oper-

ations and external database connections.

�  Edge:  Limited to I/O operations that can be performed over the network using fetch.

It does not support Node.js-specific APIs like fs for file system access.

3.   Scalability:
�  Node.js:  Scalable but often requires more infrastructure management unless de-

ployed on serverless platforms that abstract away these complexities.

�  Edge:  This type of infrastructure offers the highest scalability with minimal over-

head and is often managed by cloud providers that distribute edge functions

geographically.

4.  Security and Isolation:
�  Both runtimes  offer high levels of security. However, the Edge runtime often runs

in a more controlled environment, which can inherently reduce the surface area for

attacks.

The Ultimate Guide to Next JS Optimalization   |  82



<!-- Page 83 -->

Rendering

5.  Latency:
�  Node.js: Node.js: Normal latency is suitable for most applications but not optimized

for ultra-low latency requirements.

�  Edge:  This method provides the lowest latency by executing code geographically

closer to the user, significantly improving response times for global applications.

6.  Support for npm Packages:
�  Node.js:  Supports virtually all npm packages.

�  Edge:  Supports only a subset of npm packages compatible with Web APIs, limiting

the use of many traditional Node.js packages.

7.  Rendering Capabilities:
�  Both runtimes   support dynamic and static rendering, although the Edge runtime

does not support static generation during build time.

Choosing the Right Runtime:

�  Use Node.js Runtime  when your application requires access to the full Node.js API,

needs to perform complex computations, or interacts heavily with a filesystem or

external databases.

�  Opt for Edge Runtime   to deliver dynamic content with minimal latency, especially

when the application logic is simple and can be executed within the Edge environ-

ment's constraints (like package size and API limitations).


```
7.3. Keypoints
```

1.  Rendering Strategies Overview: Traditional approaches (SSR, CSR, ISR) have
evolved with Next.js app directory, introducing client and server components for

granular control.

2.  Dual Execution Advantages: Improves user experience by quickly rendering pages
on the server and retaining interactivity on the client.

3.  Server-Side Rendering Limitations: Some functionalities, such as browser-specific
APIs and specific React hooks, cannot be executed on the server.

4.  Impact on SEO: Server-side rendering allows search engines to crawl content easily,
improving SEO.

5.  Static Site Generation (SSG): Pre-renders HTML at build time, resulting in faster
page load times but potentially longer build times for large sites.

The Ultimate Guide to Next JS Optimalization   |  83



<!-- Page 84 -->


```
Web   Vitals
PART 8
8.1. Overview
```

Google's Web Vitals initiative provides a standardized framework for measuring user expe-

rience through key performance signals. Web Vitals turns real user metrics into clear, mea-

sureable metrics.

This standardization enables site owners to consistently track their performance and un-

derstand how users experience their pages. Rather than introducing new optimization tech-

niques, Web Vitals creates a common language and measurement system for evaluating

web performance across different sites and contexts.

Core Web Vitals  is a subset of Web Vitals. These are the metrics considered the most im-

portant for user experience. They are part of Google's "Page Experience" signals, which affect

a website's search ranking.

The three main metrics of Core Web Vitals are:

�  Largest Contentful Paint  (LCP),

�  Interaction To Next Paint  (INP),

�  and  Cumulative Layout Shift (CLS).

The Ultimate Guide to Next JS Optimalization   |  84



<!-- Page 85 -->

Web Vitals


```
8.1.1. Largest Contentful Paint
(LCP)   (loading performance)
```

It measures the time it takes for the largest content element visible in the viewport to be-

come fully loaded and visible to the user. This element could be an image, video, or a sizeable

block-level text.

LCP is a key metric for understanding how quickly a page’s main content loads, which is

a crucial part of the overall user experience. Pages that load faster engage users better and

reduce bounce rates, positively influencing SEO rankings.

Here are some common strategies to optimize Largest Contentful Paint (LCP) in Next.js

applications:

�  Optimize Images:

�  Use WebP/AVIF format.

�  Use  next/image   priority prop for above-the-fold images.

�  Lazy load non-critical images (done automatically by next/image)

�  Use srcset attribute to size the image appropriately (done automatically by next/

image)

�  Preload Resources:  Use <link rel="preload"> for early fetching essential resources.

Evaluate which resources are critical for the first render and preload only those.

�  SSR: Enable server-side rendering to quicken initial content visibility.

�  Critical CSS: Inline necessary above-the-fold CSS.

�  Preconnect: Establish early connections to crucial third-party domains.

The Ultimate Guide to Next JS Optimalization   |  85



<!-- Page 86 -->

Web Vitals


```
8.1.2. Interaction To Next Paint
(INP)   (interactivity)
```

Interaction To Next Paint (INP) is a critical user-centric performance metric used to track

a web page's responsiveness. It measures the delay between a user's interaction with a page,

such as clicking a link or tapping a button, and the time the browser can begin processing

event handlers in response. The INP is essential because it directly impacts the user's per-

ception of the site's interactivity and smoothness.

A lower INP score means a more responsive site, which matters because responsiveness di-

rectly impacts user satisfaction. A webpage that reacts swiftly to user inputs feels more fluid

and natural, improving the overall user experience.

Taking care of the INP is beneficial for keeping users engaged and also affects the site’s tech-

nical optimization. Since search engines prioritize the user experience, a better INP score can

contribute positively to a site's search engine optimization (SEO).

## How to optimize INP?

Optimizing Interaction to Next Paint (INP) in Next.js is key to making your site feel more re-

sponsive and user-friendly. Here are some practical ways to improve it in your app:

�  Selective Hydration with Suspense:

Utilize React 18's selective hydration features to make parts of your page interac-

tive without loading the entire JavaScript bundle. Wrap major components within

a <Suspense> boundary to enable non-blocking hydration.

�  Lazy Loading:

Use lazy loading for images, scripts, and components that aren’t essential to the ini-

tial user interaction. Next.js supports automatic image optimization and lazy load-

ing with the <Image> component from next/image.

�  Optimize JavaScript Bundling:

Code-splitting using dynamic imports can reduce JavaScript bundle sizes,

which ensures that only the necessary JavaScript is loaded and processed, reduc-

ing the load on the main thread.

�  Use CSS for animations:

Where possible, use CSS instead of JavaScript for animations and transitions. CSS

animations are handled by the browser's compositor thread, which can help keep

The Ultimate Guide to Next JS Optimalization   |  86



<!-- Page 87 -->

Web Vitals

the main thread free for other tasks. This approach optimizes CSS animations for

common animation needs like hover effects, transitions between states, or simple

movements.

�  Throttle and Debounce Event Handlers:

For events that trigger frequently (like scrolling or resizing), implement throttling or

debouncing to limit the number of times event handlers are called. Thanks to that,

you'll reduce the workload on the main thread.

�  Reduce DOM Complexity:

Simplify the DOM structure and keep it lean. A complex DOM can slow down

the page, requiring more computational power to render and re-render UI

components.

�  Use Web Workers:

Offload heavy computations to web workers. It helps to keep the main thread clear

for UI and interaction handling, which is critical for maintaining a low INP.

�  Implement Efficient Data Fetching:

Optimize data fetching strategies using SWR or React Query for efficient data cach-

ing and re-fetching, which helps keep the UI responsive.

�  Prioritize Content and Interactions:

Use the startTransition API to mark certain updates as non-urgent. This allows

React to interrupt these updates if more critical tasks (like handling user inputs)

need attention.


```
8.1.3. Cumulative Layout Shift
(CLS)   (visual stability)
```

It measures a website’s visual stability by tracking unexpected content shifts during loading.

A high CLS score can frustrate users, as shifting elements may cause accidental clicks.

Reducing CLS improves stability, enhances user experience, and boosts SEO since Google

favors sites with a reliable and consistent layout.

The Ultimate Guide to Next JS Optimalization   |  87



<!-- Page 88 -->

Web Vitals

Here are some practical steps you can implement to optimize Cumulative Layout Shift

(CLS) in Next.js applications:

�  Specify Image Dimensions:  Use the Next.js Image component to enforce setting

height and width properties, preventing layout shifts caused by image loading.

�  Use Layout Component:  Implement a consistent layout across all pages using

a Layout component to define common structural elements like ad spaces, headers,

and menus.

�  Skeleton Screens: Implement skeleton UIs in the Layout component to maintain

layout stability as content loads.

�  Prevent Ad Layout Shifts: Place ad containers in the Layout component to mini-

mize layout shifts when ads load.

�  Correct Handling of Fonts:  Use font-display settings or preload key fonts to avoid

FOUT and layout shifts. Read more about this in chapter 6.2.

�  Stable Styled Components:  Utilize the babel-plugin-styled-components and

ServerStyleSheet to apply styles server-side, reducing style recalculations and lay-

out shifts.

�  Preload key fonts and critical CSS:  Preloading key fonts and critical CSS ensures

that the most important resources are loaded as soon as possible, minimizing ren-

dering delays.


```
8.1.4. Other Web Vitals
```

Beyond the primary Core Web Vitals, additional metrics help refine web performance anal-

ysis. While not officially part of Core Web Vitals, these metrics are essential for developers

aiming to deliver a smooth and engaging user experience. They offer a broader view of site

performance and help identify areas for improvement.

Let’s take a look at them.

## First Contentful Paint (FCP)

First Contentful Paint (FCP) is a key performance metric that measures how quickly a page

displays the first piece of content to users during the loading process. It tracks the time from

The Ultimate Guide to Next JS Optimalization   |  88



<!-- Page 89 -->

Web Vitals

when the navigation to the page starts to when any part of the page's content, such as text

or images, is first rendered on the screen.

FCP is important because it signals to users that the page is loading, shaping their percep-

tion of the site's speed and responsiveness. Aiming for a fast FCP is essential as it reassures

users that the site is responsive. Ideally, sites should achieve an FCP of 1.8 seconds or less to

ensure a positive user experience.

Factors influencing FCP include the efficiency of network connections, server speed, and

the amount of render-blocking JavaScript, CSS, and fonts.

To improve FCP, you should:

�  Minimize critical CSS: Encapsulate the essential CSS required for rendering above-

the-fold content to avoid delaying page render.

�  Defer non-critical JavaScript code:  Use deferring, async loading, or lazy loading to

load non-critical JavaScript after the initial content is rendered, preventing it from

blocking the page load.

�  Use efficient caching strategies:  Implement proper cache control headers and

caching policies to store assets locally, reducing load times on repeat visits.

�  Handle fonts properly: Preload critical fonts and use font-display: swap to ensure

text is visible while the fonts are loading, reducing render-blocking.

## Total Blocking Time (TBT)

Total Blocking Time (TBT) measures how long the main thread is blocked by long tasks,

preventing the page from responding to user interactions like clicks, taps, or key presses.

TBT is measured between First Contentful Paint (FCP) and Time to Interactive (TTI), focus-

ing on the time during which the main thread was blocked long enough to prevent input

responsiveness.

TBT is an essential metric for diagnosing user experience issues related to the site's inter-

activity. It helps identify the “blocking” (longer than 50ms) tasks on the main thread, where

the browser cannot process user inputs because it is busy with other tasks.

The metric is highly related to JavaScript execution, as lengthy or inefficient JS tasks can sig-

nificantly increase the total blocking time, thus degrading the user's interactive experience.

The Ultimate Guide to Next JS Optimalization   |  89



<!-- Page 90 -->

Web Vitals

By optimizing JS execution and minimizing complex computations on the main thread, de-

velopers can reduce TBT, leading to smoother and more responsive user interaction. The

service workers where you could offload some heavy computations would be your ally here.

## Time to First Byte (TTFB)

Time to First Byte (TTFB) is a crucial metric for assessing web server responsiveness and

the initial stages of loading performance. It measures the duration from when a resource re-

quest is made until the first byte of the response is received.

It contains several phases, including redirect handling, service worker startup, DNS lookups,

connection and TLS negotiation, and the initial request processing.

Optimizing TTFB, especially in frameworks like Next.js, starts by ensuring efficient server con-

figurations, reducing DNS lookup times, and streamlining the connection and TLS processes.

## Deprecated metrics

Certain metrics have been phased out over time as Web Vitals guidelines evolved. These

deprecated metrics are no longer considered best practices.

We’re sharing them here for educational purposes so you can understand what they were and

why they’re no longer used. If you’re not interested, feel free to skip this section.

The Ultimate Guide to Next JS Optimalization   |  90



<!-- Page 91 -->

Web Vitals

## Time To Interactive (TTI)

"Time to Interactive (TTI) has proved overly sensitive to outlier network requests and long tasks,

resulting in high variability in this metric. TTI was removed as a metric from Lighthouse 10.

Newer, alternative, metrics like Largest Contentful Paint (LCP), Total Blocking Time (TBT), and

Interaction to Next Paint (INP) are usually better metrics to use in place of TTI."

Source

## First Input Delay (FID)

FID has been a foundational metric for a long time, but it has certain limitations,

which we will discuss below. To overcome these challenges, FID has been replaced by

Interaction to Next Paint (INP).

## Why did INP replace FID?

�  Comprehensive Measurement: INP captures the latency of all interactions within

a session, making it more representative of the overall user experience. It accounts

for interactions after loading the page and continues tracking responsiveness

throughout the session.

The Ultimate Guide to Next JS Optimalization   |  91



<!-- Page 92 -->

Web Vitals

�  Better Reflection of User Experience:   INP measures how users perceive respon-

siveness by assessing their visual response to interactions. A better INP results in

a smoother experience and higher user satisfaction.

�  Actionable Insight:  Since INP measures a broader set of interactions, it gives devel-

opers more detailed insights into which elements or actions are causing delays. This

can guide more targeted optimizations.


```
8.1.5. Metrics weight in Lighthouse
```

In the Lighthouse tool, each metric has a specific weight that reflects its importance in

the overall performance score. Here's a breakdown of these metrics and their respective

weightings, which can help you focus your optimization efforts effectively.

Of course, what you focus on will depend on your individual priorities and users’ needs, but

these weights can serve as general guidance on what metrics matter the most for user

experience.


```
Metric  Name   Abbreviation   Weighting
```

First Contentful Paint  FCP  10%

Speed Index   SI  10%

Largest Contentful Paint  LCP  25%

Total Blocking Time  TBT   30%

Cumulative Layout Shift   CLS  25%

Source: "Lighthouse performance scoring"

## Strategic Focus for Optimization

�  High-Impact Metrics:  TBT (30%) and LCP (25%) should be your primary focus, given

their weightings. Improvements in these areas will have the most significant impact

on the overall performance score.

�  Secondary Metrics:  CLS (25%) is also critical due to its high weighting. Ensuring vi-

sual stability can significantly enhance user satisfaction.

�  Supportive Metrics:  FCP (10%) and SI (10%) are less weighted but still important.

Improvements in these areas contribute to a better initial load experience and pro-

gressive content rendering.

The Ultimate Guide to Next JS Optimalization   |  92



<!-- Page 93 -->

Web Vitals


```
8.2. Keypoints
```

1.  Web Vitals is a standardized framework by Google that measures user experience
based on real user metrics.

2.  LCP Optimization Strategies include image optimization, resource preloading, SSR,
inlining critical CSS, and early connection establishment.

3.  INP Optimization Techniques involve selective hydration, lazy loading, reducing JS
execution, CSS-based animations, throttling event handlers, simplifying DOM, and

using Web Workers.

4.  CLS Optimization Methods include defining image dimensions, using consistent
layouts, skeleton UI, preventing ad layout shifts, preloading fonts, and server-side

styling.

5.  Deprecated Metrics: Time to Interactive (TTI) and First Input Delay (FID) have been
replaced by more accurate alternatives like INP and TBT.

The Ultimate Guide to Next JS Optimalization   |  93



<!-- Page 94 -->


```
Development
culture
PART 9
9.1. Overview
```

Building high-quality software isn't just about writing code. It's also about cultivating a strong

development culture prioritizing maintainability, collaboration, and long-term efficiency.

Without proper practices, projects can quickly accumulate technical debt, suffer from in-

consistent code quality, become bloated with inefficient solutions and libraries, and become

difficult to scale.

A well-structured development culture includes key principles such as

�  enforcing performance budgets to prevent bloated applications,

�  establishing thorough and constructive code reviews to maintain quality,

�  and implementing strategies for handling technical debt through refactoring and

continuous improvement.

These practices ensure that teams can deliver business value quickly without sacrificing per-

formance and scalability.

This chapter will discuss the importance of setting clear performance budgets, best practices

for effective code reviews, and strategies for continuous tech debt management. By the end,

you'll have a clear framework for cultivating a development culture that leads to sustainable

and scalable software.

The Ultimate Guide to Next JS Optimalization   |  94



<!-- Page 95 -->

Development culture


```
9.1.1. Performance budget
```

A web performance budget is essential in web development, helping ensure a site runs effi-

ciently while maintaining its intended user experience and functionality. It sets measurable

limits on key aspects of design and development to keep performance at optimal levels. This

budget can be implemented in several ways, including:

�  Per File:  Limits on individual files to control their impact.

�  Per File Type:  Constraints on specific types of files (e.g., images, scripts).

�  All Files on a Page:  Overall limit on the total size or load time of all resources on

a page.

�  Specific Metric: Caps on performance metrics like Time to Interactive.

�  Custom Metric:  Limits on user-defined metrics, such as Time to Hero Element.

�  Threshold Over Time:  Constraints that monitor performance over a set period to

identify trends or regressions.

## Purpose of a Web Performance Budget

Setting a performance budget prevents the website from becoming bloated with unnecessary

resources that can slow down load times and negatively affect user experience. It is a guide-

line that helps web designers, developers, and stakeholders decide what features, graphics,

or content to include on a webpage.

## Setting a Web Performance Budget

1.  Assess Needs and Goals: Understand your website's functional requirements and
user experience goals. It will help you determine which performance aspects are

most critical.

2.  Baseline Testing:  Use tools like WebPageTest, Pingdom, or GTmetrix to establish
your site's performance metrics. These tools will give you a baseline to compare

against as you make changes.

3.  Define Metrics:  Decide on the specific metrics you want to prioritize, such as page
load time, number of HTTP requests, or total page size.

4.  Allocate Budgets:  Based on the metrics, set quantitative limits. For example, lim-
it the total size of images on any page to under 500KB or set the page load time to

under 3 seconds.

5.  Monitor and Adjust:  Performance budgets need to be dynamic. Regularly test your
site and adjust the budget as technologies and user expectations evolve.

## Best Practices

�  Prioritize:  Always consider the trade-offs between functionality, design, and perfor-

mance. Not everything needs to be on the homepage.

�  Optimize:  Continuously optimize your content, such as compressing images and

minifying scripts, to fit within your set budgets.

�  Iterate:  Performance optimization is an ongoing process. Regularly revisit your per-

formance budget as your website evolves.

The Ultimate Guide to Next JS Optimalization   |  95



<!-- Page 96 -->

Development culture

## Example

Let's consider optimizing a hypothetical Next.js website for a fictional e-commerce platform

specializing in sustainable outdoor gear  to provide a clear and practical illustration of set-

ting and maintaining a web performance budget. This example will walk you through each

stage, highlighting key actions and decisions.

Step 1: Assess Needs and Goals

First, we defined what the website needed to do well: load quickly and provide a smooth ex-

perience on product pages. The goal was a fast, responsive site without sacrificing quality.

Step 2: Baseline Testing

We used performance tools like WebPageTest to measure:

�  Page Load Time: How long a page takes to become fully interactive.

�  Total Page Size:  The combined size of all the content on a page.

�  Number of HTTP Requests:   The number of requests required to load the page.

Step 3: Set Performance Targets

Based on the initial tests, we set targets to improve site performance:

�  Reduce Page Load Time to under 3 seconds.

�  Limit Total Page Size to under 1.5MB.

�  Reduce HTTP Requests to no more than 50 per page.

Step 4: Implement Changes

To meet these targets, we made specific changes:

�  Images:  Used next/image, web image format, and prioritized critical images.

�  JavaScript:  Used code splitting to load only necessary code and implemented pro-

gressive hydration.

�  DOM:  Reduced the number of components.

�  Fonts: Only essential font files were used.

�  API Calls:  Limited to necessary data, implemented fetch on scroll to avoid fetching

unnecessary data.

Step 5: Monitor and Adjust

We continuously monitored the site’s performance and made adjustments as needed. For

example, if a new feature made the page too slow, we optimized the feature or reconsidered

its necessity.

## Results

Following these steps, the website's load time declined to 2.8 seconds, its total size to 1.2MB,

and the number of HTTP requests to 45. Thanks to these tweaks, the website loads faster and

provides its users with a more engaging experience, particularly on critical product pages.

This streamlined approach shows how targeted optimizations and regular monitoring can

significantly enhance web performance while keeping the process straightforward and

manageable.

The Ultimate Guide to Next JS Optimalization   |  96



<!-- Page 97 -->

Development culture


```
9.1.2. Adding New Libraries
```

Adding a new library to your Next.js project becomes part of your application's bundle. This

bundle is a compiled file or set of files that browsers download and execute. Each additional

library increases the bundle size, affecting your application's loading time and performance.

Therefore, it's essential to carefully consider each library's utility and impact before integrat-

ing it into your project.

## Evaluating the Need for New Libraries

When considering the addition of a new library to a Next.js project, it's crucial to critically

assess its necessity to avoid potential bloat and maintain efficiency. Here's how to evaluate

whether a new library is truly essential:

1.  Assess the Functionality
Start by analyzing the functionality the new library would provide. Can Next.js han-

dle it with its built-in features? For example, Next.js already supports features like

API routes, image optimization, and internationalization, which might eliminate

the need for several external libraries.

2.  Explore Native or Smaller Alternatives
If the functionality isn't natively available in Next.js, consider whether it can

be achieved with smaller, more lightweight utilities or perhaps through native

JavaScript or TypeScript code. For instance, instead of a large utility library like

Lodash, you could use individual utility functions or ES6+ features that perform

similar tasks.

3.  Check for Modular Imports/Tree-shaking
If a library is essential but known for its size, check if it supports tree-shaking or

modular imports. This method allows you to include only the parts of the library

you use, significantly reducing the impact on your bundle size. For example, librar-

ies like lodash-es or individual lodash function packages (lodash/kebabCase) al-

low you to import only the necessary functions.

Lodash example:


```
import   _  from   'lodash';
```

Originally, lodash adhered to the CommonJS standard, which was designed for serv-

er-side applications. This format doesn't lend itself well to tree shaking.

To address this problem, the lodash-es version was introduced using ECMAScript

Modules (ESM), which are better suited for tree shaking because of their static struc-

ture. As a result, Lodash became more efficient for use in web applications.

So, while working on performance optimization, developers should consider the fol-

lowing techniques and approaches:

�  Switch to lightweight alternative:  You could consider "lodash-es," a version of

lodash structured as ES modules, which makes it better for web environments.

Also, you could try "Remeda," which is a smaller and more modular library over-

all. It’s designed to be light, and you can often include only the utilities you need,

resulting in smaller bundle sizes.

�  Use native JavaScript methods when possible:   Modern JavaScript includes

many built-in functions (e.g., Array.prototype.map, filter, reduce) that can replace

The Ultimate Guide to Next JS Optimalization   |  97



<!-- Page 98 -->

Development culture

lodash functions, reducing dependency on external libraries and improving

performance.

�  Consider utility function alternatives:  If you're only using a few lodash func-

tions, creating your own utility functions might be a better option. This minimiz-

es dependencies and keeps your codebase lean.

4.  Performance Impact Analysis
Use tools like Bundlephobia to understand the impact of adding a new library. Bundlephobia

provides insights into the library's size, potential download time, and the additional cost it

would impose on your application's performance.

Before installing, remember to check the library on NPM for its latest version, size, and weekly

downloads. This data will show if the library is popular among developers and supported by

the community, which is always a plus. Additionally, NPM shows both the dependencies and

peer dependencies, which are crucial for understanding potential conflicts and additional

burdens on your application.

5.  Review Community and Maintenance
Consider the library's community support and maintenance history. A well-supported library

is more likely to receive updates and optimizations, which can help maintain or improve per-

formance over time. Conversely, a library with little support or infrequent updates might not

be a sustainable choice.

The Ultimate Guide to Next JS Optimalization   |  98



<!-- Page 99 -->

Development culture


```
9.1.3. Code reviews
```

When reviewing code, it's important to prioritize clarity and maintainability while focusing

on performance. Even if the primary goal of a reviewed PR isn't performance optimization,

adopting basic performance-enhancing techniques can lead to significant improvements

over time.

Here is a detailed list of things to look for when reviewing PRs, including examples and re-

al-life scenarios:

## 1. Unnecessary Libraries and Dependencies

Issue:  Adding heavy libraries that aren't needed can bloat the application, slow down loading

times, and hurt overall performance.

Example: A developer adds a library like Lodash for a single utility function.

Suggestion:  Recommend using native JavaScript methods or importing only the required

modules from the library, f. or example   lodash.map   from NPM.

## 2. Overuse of Memoization

Issue:  Excessive use of React.memo, useMemo, or useCallback can lead to unnecessary

memory overhead and complexity.

Example:  A developer uses React.memo for every component, regardless of its complexity

or re-render frequency.

Suggestion:  Suggest memorization only for components with expensive rendering or those

that re-render often due to frequent props changes.

## 3. Lack of Dynamic Imports

Issue: Not using dynamic imports can lead to large bundle sizes because all components are

loaded upfront, even if they are not immediately needed.

Example:  A PR includes a new feature module that is part of the main bundle instead of be-

ing dynamically loaded.

Suggestion:  We recommend using Next.js dynamic imports with import() to split off heavy

components or libraries that aren’t essential to the initial load.

## 4. Defining Functions Inside Components

Issue:   Defining functions directly inside React components can lead to performance ineffi-

ciencies, especially in larger applications. Each re-render of the component results in re-cre-

ating the functions. If these functions are passed as props, it can lead to unnecessary re-ren-

ders of child components.

Example: A developer defines a click handler function inside a functional component that is

passed down to a child component. Each time the parent component re-renders, the child

component re-renders because it receives a new function object.

Suggestion: Utilize the useCallback hook to memoize functions, particularly those passed as

props to child components. This hook returns a memoized callback version that only chang-

es if one dependency changes. This approach prevents child components from re-rendering

unless necessary, enhancing performance. For functions used only within the component

that don’t interact with its children or hooks, define them outside the component or within its

The Ultimate Guide to Next JS Optimalization   |  99



<!-- Page 100 -->

Development culture

body. Avoid relying on props or state for their definition unless they are wrapped in useCall-

back. If the function is used only within useEffect, it can also be declared inside the scope of

useEffect.

## 5. Large Component Trees

Issue:   Large component trees in Next.js applications can lead to inefficient re-renders, slow

page rendering, and complexity in managing state and props.

Example: A developer builds a deeply nested structure where a top-level component contains

many child components, each with further subcomponents, causing slow initial rendering

and slow state updates across the tree.

Solution:  You can split a large component into smaller, more focused components, reducing

the number of re-renders and improving the application’s performance.

## 6. Unoptimized Images

Issue:   Failing to optimize image loading can lead to significant delays in page load times,

particularly in image-heavy applications, affecting user experience and SEO.

Example:  In a newly submitted PR for an e-commerce product listing page, high-resolution

product images are directly imported and used with standard <img> tags, causing all imag-

es to load on the initial page render. It increases page load times significantly, especially for

users on slower connections.

Suggestion:  To address this issue in Next.js, implement the following optimizations:

�  Switch to Next.js Image Component:   Replace all <img> tags with Next.js's Image

component. This component automatically handles image optimization, supports

responsive loading, and uses modern image formats.

�  Implement Lazy Loading: Enable lazy loading by setting the  loading="lazy"  attri-

bute in the Image component. This approach ensures that images are only loaded

as they enter the viewport, which can significantly improve initial load times.

�  Prioritize Key Images: Use the priority attribute for critical images that impact first

impressions, such as the main product images. This priority attribute tells Next.js

to preload these images during the initial page load, ensuring they are available as

soon as the user views the page.


```
9.1.4. Dedicated time for tech
debt   handling and refactoring
```

Technical debt describes the cost of maintaining and improving the software. As the project

grows, so does the tech debt – various shortcuts and workarounds implemented to meet

project deadlines, new versions of used packages, and unscalable early design choices. This

debt will accumulate and compound over time, leading to a huge blocker.

At this point, dealing with tech debt will be very time-consuming. It can effectively block all

other development, so the management will not be particularly keen to dedicate a whole

team velocity to something that possibly won’t be ever noticed by the user (and surely by

the stakeholders, as this does not translate to immediate earnings).

The Ultimate Guide to Next JS Optimalization   |  100



<!-- Page 101 -->

Development culture

## The most effective strategy for handling tech debt

Considering that tech debt is an example of a vicious circle, the only effective strategy against

it is to break it –  and handle the tech debt regularly.   That’s why implementing the concept

of   dedicated time  for this task is crucial to prevent accumulation and compound growth.

The team should plan these activities periodically – best after finishing some goal (e.g., MVP

release, another feature milestone completed). This way, we can do regular "cleaning" of

the project, handling the tech debt and refactoring without a pending deadline.


```
9.2. Keypoints
```

1.  Performance budgets set limits on file sizes and load times to maintain site speed
and efficiency.

2.  Library evaluation should consider bundle size, native alternatives, and tree-shak-
ing support to avoid bloat.

3.  Code reviews must check for unnecessary dependencies, inefficient memoization,
and unoptimized assets.

4.  The best way to manage technical debt is through regular maintenance, not large-
scale fixes.

5.  Optimization guidelines should define when to optimize, key metrics, and success
measures to prioritize performance.

The Ultimate Guide to Next JS Optimalization   |  101



<!-- Page 102 -->


```
Measuring
performance
PART 10
10.1. Overview
```

Effective and accurate measurement is essential to ensure smooth, user-friendly web expe-

riences. In this section, we will discuss how developers can use various tools and metrics to

assess and enhance performance in Next.js apps.


```
10.2. Tools and services
10.2.1. Lighthouse
```

Lighthouse is a widely used tool developed by Google to analyze the quality of web pages. It

audits various aspects, including performance, accessibility, and search engine optimization

(SEO).

Benefits:

�  Comprehensive Audits: Lighthouse examines various factors, from how quickly

a page becomes interactive to how it handles user input, offering actionable insights

and scores.

�  Developer-Friendly: It integrates directly into Chrome DevTools, making it easily ac-

cessible to developers during development.

Integration with Next.js:

�  Developers can run Lighthouse audits on their local development environment or

deployed sites to obtain performance metrics.

�  Lighthouse's feedback can guide optimizations in Next.js, such as improving image

handling with the Image component or optimizing dynamic imports.

Limitations:

�  In-Browser Variability:  Running Lighthouse in the browser can lead to inconsistent

results due to varying hardware, network conditions, or background processes. For

more consistent results, we recommend using the CLI version of Lighthouse or inte-

grating it into continuous integration (CI) pipelines.

The Ultimate Guide to Next JS Optimalization   |  102



<!-- Page 103 -->

Measuring performance

�  Snapshot Nature:  Lighthouse provides a snapshot of performance at a single point

in time, which might not capture variability under different user conditions or over

time.

Note on In-Browser Testing:

In-browser testing with Lighthouse may not accurately mirror the broader user experience

due to various environmental and technical variables.


```
10.2.2. WebPageTest
```

WebPageTest complements Lighthouse by offering different insights and enhanced consis-

tency across testing environments.

Advantages over Lighthouse:

�  Controlled Test Environment: Unlike Lighthouse’s in-browser setup, WebPageTest

runs tests from multiple locations worldwide using dedicated test agents. This ap-

proach reduces variability caused by different network conditions and hardware

configurations.

�  Advanced Configuration: WebPageTest allows for detailed configuration of test pa-

rameters such as connection speed, browser type, and more. It also supports script-

ing to automate multi-step transactions, closely mimicking a real user’s journey on

a site.

�  Visual Comparison: WebPageTest compares load performance, including video

captures and filmstrip views, presenting the result more graphically. This illustrative

view is particularly useful for understanding visual progress during page loads.

�  Historical Performance Data:  It retains test results for longer periods, enabling his-

torical performance analysis. This data can be crucial for tracking performance

trends over time or before and after specific updates.

When Lighthouse might be a better fit:

�  Quick Local Testing:  Lighthouse is better suited for rapid development cycles where

immediate feedback is needed, as it can run directly in Chrome DevTools without

external services.

�  Accessibility and SEO:  While WebPageTest focuses primarily on performance met-

rics, Lighthouse provides comprehensive audits for accessibility, SEO, and best

practices, making it more suitable for holistic webpage analysis.

�  CI/CD Integration: Lighthouse's CLI version is easier to integrate into continuous in-

tegration pipelines, providing automated performance checks with each build.

The Ultimate Guide to Next JS Optimalization   |  103



<!-- Page 104 -->

Measuring performance


```
10.2.3. PageSpeed Insights
```

PageSpeed Insights combines both lab and field data to provide a comprehensive view of

website performance. It integrates Lighthouse's synthetic testing capabilities with real-world

performance data from the Chrome UX Report.

## Comparison with Other Tools:

vs. Lighthouse:

�  Adds field data from real users via CrUX, while Lighthouse only provides lab data.

�  Runs tests from Google's servers, eliminating local environment variables that can

affect Lighthouse results.

�  Provides optimization suggestions that consider both lab and field data patterns.

�  Less suitable for testing local development environments or internal applications.

vs. WebPageTest:

�  Offers a simpler, more streamlined interface focused on core metrics.

�  Provides fewer configuration options compared to WebPageTest's detailed testing

parameters.

�  Better for quick assessments and general optimization guidance.

�  Less detailed in terms of waterfall analysis and advanced performance debugging.

## Field Data in PageSpeed Insights:

PageSpeed Insights uses the Chrome UX Report (CrUX) to provide real-world performance

data. This offers several benefits:

�  Real User Metrics:  Data collected from actual Chrome users provides insights into

real-world experiences across different devices and network conditions.

�  Large-Scale Analysis:  Aggregates performance data from millions of users to show

general trends.

�  Comparative Analysis:  Enables comparison of your site's performance against

competitors in your industry.

Limitations of Field Data:

�  Monthly Updates: Recent changes don't reflect immediately as CrUX data refresh-

es monthly.

�  Data Sampling:  CrUX dataset includes only sites with sufficient traffic.

�  Privacy Considerations:  Data is anonymized and aggregated, limiting granular

analysis of specific user sessions.

�  Geographic Coverage:   Data availability varies by region and may not represent all

user locations equally.

When to Use PageSpeed Insights:

�  During production monitoring to combine both synthetic and real-user data.

�  When seeking Google-specific optimization recommendations for SEO.

The Ultimate Guide to Next JS Optimalization   |  104



<!-- Page 105 -->

Measuring performance

�  For comparing performance against other sites in the same industry.

�  When needing a balance between detailed metrics and actionable insights.


```
10.2.4. Vercel Speed Insights
```

For Next.js applications deployed on Vercel, Speed Insights provides built-in real-user moni-

toring capabilities that offer immediate visibility into real-world application performance.

## Key Features

Detailed Performance Metrics:

Speed Insights collects various performance data points crucial for understanding how

a website performs under real-user conditions. Metrics such as Real Experience Score (RES),

First Contentful Paint (FCP), and Largest Contentful Paint (LCP) provide a detailed look at

the site's loading performance and visual stability.

Dashboard Integration:

Once enabled, Speed Insights tracks data across all deployed environments, including preview

and production. The data is accessible through a user-friendly dashboard within the Vercel

project view, eliminating the need for additional scripts or code modifications.

Granular Data Views:

�  Device Type and Environment Filtering: Users can toggle views between mobile

and desktop devices and filter data by preview or production environments.

�  Time Range Selection:  Depending on the user's account type, developers can ex-

amine the insights over various periods, from the previous day up to the last 12

months.

�  Performance Metric Customization:   The dashboard allows users to view the 75th

percentile (P75) of performance data by default, with options to include the 90th,

95th, and 99th percentiles in the time-based line graph.

Visual Representations:

�  Kanban Board: This view helps identify which routes or paths may need perfor-

mance improvements, highlighting URLs based on traffic significance.

�  Geographic Maps:  These maps show performance metrics by country, using color

intensity to indicate the data collected per region. They provide a visual representa-

tion of where users might be experiencing issues.

## How RUM with Speed Insights Enhances Next.js Applications

Integrating RUM through Vercel’s Speed Insights allows developers to make data-driven de-

cisions based on how real users interact with their applications. This direct feedback loop

enables the following:

�  Immediate Identification of Issues:  Real-time data helps pinpoint performance

bottlenecks or errors as they occur, often before they impact many users.

The Ultimate Guide to Next JS Optimalization   |  105



<!-- Page 106 -->

Measuring performance

�  Targeted Optimizations: By understanding which areas of a site are underperform-

ing – specific pages, assets, or third-party scripts – developers can prioritize efforts

where they are most needed.

�  Impact Analysis:  After deploying optimizations, developers can immediate-

ly see the impact of changes across different user demographics and device

types.


```
10.2.5. Other Real User Monitoring Solutions
```

While Vercel Speed Insights is deeply integrated with Next.js deployments on Vercel, there are

other RUM solutions available for different hosting environments or specific monitoring needs:

Commercial Services:

�  Analytics platforms like Google Analytics 4 include performance monitoring

features.

�  Specialized RUM services such as New Relic, Datadog, or Sentry offer comprehen-

sive application monitoring.

�  CDN providers like Cloudflare and Akamai provide built-in RUM capabilities.

When to Consider Other RUM Solutions:

�  Need for custom metric collection beyond core web vitals.

�  Multi-platform monitoring requirements.

�  Specific privacy or compliance requirements.

�  Integration with existing monitoring infrastructure.

## Collecting your real-world metrics

You can use the   useReportWebVitals   hook from next/web-vitals   to collect real-world

performance metrics and send them to any service. Because it is deeply integrated with Next,

this might prove more accurate than generic web vitals collection built into your analytics

or data platform SDK.

Example:  Sending Web Vitals to Google Analytics 4


```
import { useReportWebVitals } from 'next/web-vitals'
```

=/  [==.]

useReportWebVitals(metric => {


```
window.gtag('event', metric.name, {
value: Math.round(metric.name === 'CLS'  ?  metric.value * 1000 :
```

metric.value),  =/ values must be integers

event_label:  metric.id,  =/ id unique to current page load

non_interaction:  true,  =/ avoids  affecting bounce rate.


```
});
}
```

Code snippet source: Next.js docs

The Ultimate Guide to Next JS Optimalization   |  106



<!-- Page 107 -->

Measuring performance


```
10.3. Keypoints
```

1.  Use Lighthouse for performance, SEO, and accessibility analysis.
2.  Use WebPageTest for detailed multi-region and user flow testing.
3.  Use PageSpeed Insights for a mix of lab and real-world data.
4.  Combine synthetic testing with real-user monitoring for accuracy.
5.  Implement continuous monitoring in development and production.
6.  Use Vercel Speed Insights for real-user monitoring.
7.  Supplement with additional RUM tools if needed.
The Ultimate Guide to Next JS Optimalization   |  107



<!-- Page 108 -->

Meet the authors


```
THANK   YOU
Meet   the   authors
```

We hope this guide gave you valuable tips to make your Next.js apps faster and more effi-

cient. We did our best to cover technical details and bigger-picture strategies to help you get

the best results.

If you found it helpful, share it with your team or anyone working with Next.js. And if you ever

need expert help with performance optimization, Blazity is here for you. Happy coding!

�  Wojciech Wrotek

Software Engineer

@wojtek-wrotek   @woywro

�  Jakub Jabłoński

Head of Integration

@jj-dev  @jj_web_dev   @jjablonski-it

�  Adam Dziubiński

Senior Software Engineer

@adamdziubinski

�  Karol Chudzik

Software Engineer

@karol-chudzik  @_karolchudzik   @iipanda

�  Igor Klepacki

Software Engineer (Open Source)

@neg4n   @igorklepacki  @neg4n

The Ultimate Guide to Next JS Optimalization   |  108