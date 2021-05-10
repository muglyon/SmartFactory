import { useRouter } from 'next/router'
import Link from 'next/link'
import React, { Children } from 'react'

const ActiveLink = ({ children, activeClassName, href, ...props }) => {
  const { asPath } = useRouter()
  const child = Children.only(children)
  const childClassName = props.className || '';


  const className =
    asPath === href || asPath === props.as
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName

  return (
    <Link {...props} href={href}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  )
}

export default ActiveLink