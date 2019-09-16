#README

##Examples
Create JWT:
{
  privKeyMsg: 'H+CGGWLkjHdfzYIr/HCqlG4PbIZ3oHTPsGXpeFDdVuf1W+1j3q/axwNTNxFVNnXzueOrCX8Um2zxGwQ1OIVmymU=',
  jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJta3IiOiIwMDAwMDAwMDAwMDAwMDAwMDI1M2E0NmYyNGZjOWM3MGM1ODFmYjMwNmFjNTMxYmZmZDg3ZTNiZDIyNTUxMzI5IiwiZWJrIjo2MDA1NTF9.1_3qrZWFX0TUErbeWkWO4MjaMovyAZtCuLju9LOxWNo'
}


Verify JWT:
{
  header: { alg: 'HS256', typ: 'JWT' },
  payload: {
    mkr: '00000000000000000253a46f24fc9c70c581fb306ac531bffd87e3bd22551329',
    ebk: 600551
  },
  pubKey: '1P23VhvFLH18qP7YRCPDWPwA9TCJjmp9B5'
}
