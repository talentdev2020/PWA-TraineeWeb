import jcookies from 'js-cookie'
export default async function ({ store,route,redirect }) {

    let rule = ['login','error','course'];
    let code = route.path.substring(1);
    if(code.includes('logout'))
    {
      jcookies.set("__session", '');
      return redirect("/login");
    }
    if((code != '') && (!rule.includes(code) ))
    {


      //store.state.accesscode = code;

    }
    if(!store.state.authenticated)
    {
      if(!code.includes('login'))
      {
        if(rule.includes(code))
          return redirect('/login');
        else
        return redirect('/login?accesscode='+code)
      }

    }
    else if((code != '') && (!rule.includes(code) )&&(!code.includes('/?accesscode')))
      {
        if(code == 'finish')
          return redirect("/login?finish=1");
        else
          return redirect("/?accesscode="+code);
      }


 }
