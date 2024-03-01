# afts

## Installation

```sh
npm install afts --save-dev
```

## Programmatic usage
### Init
```javascript
// init builder
const builder = new aftBuilder(
    '{rest api key}',
    '{api domain}'
);
//set builder

builder.viewPath('/v2/public/')//html view path
    .errorPages({//set error pages
        '404':`404 page path`,
        '400':`400 page path`,
        '401':`401 page path`,
        '500':`500 page path`,
    }).container(document.getElementById('aftApp'))//container html body
    .interceptor((path)=>{ // be
        //to do something before rendering
    })
    .build(()=>{
        //to do something after build.
    });
```
### Set-up route
```typescript
    //Test page
    const TestPage = (route : Route, builder : aftBuilder): RouteType =>{
        return {
            path : `/test`, // url
            event : (): RouteReturnType =>{
                return {
                    path : 'test/main', //view path +  html path without .html
                    onload : async (ele : HTMLElement)=>{
                        //ele = html element(test/main.html)
                        //to do something.
                        return ele;
                    },
                    event:{
                        test : (node:HTMLElement,e : Event)=>{//event from html file(aft-event=test)
                            //to do something when click the element
                        }
                    }
                }
            }
        }
    }
    //test router class 
    class TestRouter implements Route{
        constructor(builder : aftBuilder) {
            this.builder = builder;
        }
    
        call() : RouteType[]{
            return [
                AftContainerBody(TestPage(this,this.builder))
            ];
        }
        update(key:string,params : {[key:string]:any}={}){}
    }
    const router = builder.getRouter();
    router.addAll(
        new TestRouter(builder)
    );
```

